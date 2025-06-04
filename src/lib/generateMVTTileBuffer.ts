import { Math as CesiumMath, Rectangle, WebMercatorProjection, WebMercatorTilingScheme } from "cesium";
import { Feature, Point } from "geojson";
import { vector_tile } from "./protobuf";
import zigzag from "./zigzag";

const tilingScheme = new WebMercatorTilingScheme();

/*
A command ID, a command count, and a CommandInteger are related by these bitwise operations:

CommandInteger = (id & 0x7) | (count << 3)
id = CommandInteger & 0x7
count = CommandInteger >> 3
*/

function commandInteger(id: number, count: number) {
    return (id & 0x7) | (count << 3);
}

const moveToCommandId = 1;

function moveToCommandInteger(count: number) {
    return commandInteger(moveToCommandId, count);
}

/**
 *
 * @param x The integer x coordinate of the tile.
 * @param y The integer y coordinate of the tile.
 * @param level The tile level-of-detail. Zero is the least detailed.
 * @param tileExtent
 * @param feature
 * @returns
 */
function geometryOfPoint(x: number, y: number, level: number, tileExtent: number, feature: Feature) {
    /*
        The POINT geometry type encodes a point or multipoint geometry. 
        The geometry command sequence for a point geometry MUST consist of a single MoveTo command with a command count greater than 0.

        If the MoveTo command for a POINT geometry has a command count of 1, 
        then the geometry MUST be interpreted as a single point; otherwise the geometry MUST be interpreted as a multipoint geometry,
        wherein each pair of ParameterIntegers encodes a single point.
    */

    const tileBound = tilingScheme.tileXYToRectangle(x, y, level, new Rectangle());
    const west = CesiumMath.toDegrees(tileBound.west);
    const east = CesiumMath.toDegrees(tileBound.east);

    let south = WebMercatorProjection.geodeticLatitudeToMercatorAngle(tileBound.south);
    let north = WebMercatorProjection.geodeticLatitudeToMercatorAngle(tileBound.north);

    south = CesiumMath.toDegrees(south);
    north = CesiumMath.toDegrees(north);

    const tileWidth = east - west;
    const tileHeight = north - south;

    // for now only point
    console.assert(feature.geometry.type === "Point", "error");

    const point: Point = feature.geometry as Point;

    const coordinate = point.coordinates;

    // assume they are defined in degree
    const geoX = coordinate[0];
    let geoY = coordinate[1];

    geoY = CesiumMath.toRadians(geoY);
    geoY = WebMercatorProjection.geodeticLatitudeToMercatorAngle(geoY);
    geoY = CesiumMath.toDegrees(geoY);

    // https://github.com/tilezen/mapbox-vector-tile#coordinate-transformations-for-encoding

    /*
    Geometry data in a Vector Tile is defined in a screen coordinate system.
    The upper left corner of the tile (as displayed by default) is the origin of the coordinate system.
    The X axis is positive to the right, and the Y axis is positive downward.
    Coordinates within a geometry MUST be integers.
    */

    const tileX = Math.round(((geoX - west) / tileWidth) * tileExtent);
    const tileY = Math.round(((north - geoY) / tileHeight) * tileExtent);

    const geometry: number[] = [];

    geometry.push(moveToCommandInteger(1));

    geometry.push(zigzag(tileX));
    geometry.push(zigzag(tileY));

    return geometry;
}

interface Options {
    x: number;
    y: number;
    level: number;
    version: number;
    layerName: string;
    tileExtent: number;
}

export default function generateMVTTileBuffer(features: Feature[], options: Options) {
    // @ts-ignore
    const keys = Object.keys(features[0].properties);
    const values = [];

    // prepare unique values
    for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const properties = feature.properties;

        for (let j = 0; j < keys.length; j++) {
            const key = keys[j];
            const value = properties![key];

            if (!value) {
                continue;
            }

            if (values.indexOf(value) === -1) {
                values.push(value);
            }
        }
    }

    const tileFeatures = [];

    const x = options.x;
    const y = options.y;
    const level = options.level;
    const tileExtent = options.tileExtent;

    for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const properties = feature.properties;

        const tags = [];

        for (let j = 0; j < keys.length; j++) {
            const key = keys[j];
            const value = properties![key];

            if (!value) {
                continue;
            }

            tags.push(j); // property key
            tags.push(values.indexOf(value));
        }

        const tileFeature = {
            /*
                A feature MAY contain an id field. 
                If a feature has an id field, the value of the id SHOULD be unique among the features of the parent layer.
                */
            id: properties!["id"],
            type: vector_tile.Tile.GeomType.POINT,
            geometry: geometryOfPoint(x, y, level, tileExtent, feature),
            tags: tags
        };

        tileFeatures.push(tileFeature);
    }

    const layerValues = [];

    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        const type = typeof value;

        if (type === "string") {
            layerValues.push({
                stringValue: value
            });
        } else if (type === "number") {
            layerValues.push({
                doubleValue: value
            });
        } else if (type === "boolean") {
            layerValues.push({
                booleanValue: value
            });
        } else {
            console.error(value);
        }
    }

    const layer = {
        version: options.version, // This is a constant
        name: options.layerName, // The name of the layer
        extent: options.tileExtent, // The extent of the coordinate system local to this tile. 256 means that this tile has 256×256=65536 pixels, from (0,0) to (256,256).
        features: tileFeatures,
        keys: keys,
        values: layerValues
    };

    const tile = vector_tile.Tile.create({
        layers: [layer]
    });

    return vector_tile.Tile.encode(tile).finish();
}
