const fs = require("fs");

import {
    Cartesian2,
    Cartographic,
    Math as CesiumMath,
    Rectangle,
    WebMercatorProjection,
    WebMercatorTilingScheme
} from "cesium";
import { BBox, Feature, FeatureCollection, Point } from "geojson";
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
const lineToCommandId = 2;
const closePathCommandId = 7;

function moveToCommandInteger(count: number) {
    return commandInteger(moveToCommandId, count);
}

function lineToCommandInteger(count: number) {
    return commandInteger(lineToCommandId, count);
}

function closePathCommandInteger(count: number) {
    return commandInteger(closePathCommandId, count);
}

function minGeographicTileX(bbox: BBox, level: number) {
    const westSouth = new Cartographic(CesiumMath.toRadians(bbox[0]), CesiumMath.toRadians(bbox[1]));

    const ret = new Cartesian2();

    tilingScheme.positionToTileXY(westSouth, level, ret);

    return ret.x;
}

function minGeographicTileY(bbox: BBox, level: number) {
    const westNorth = new Cartographic(CesiumMath.toRadians(bbox[0]), CesiumMath.toRadians(bbox[3]));

    const ret = new Cartesian2();

    tilingScheme.positionToTileXY(westNorth, level, ret);

    return ret.y;
}

function maxGeographicTileX(bbox: BBox, level: number) {
    const eastNorth = new Cartographic(CesiumMath.toRadians(bbox[2]), CesiumMath.toRadians(bbox[3]));

    const ret = new Cartesian2();

    tilingScheme.positionToTileXY(eastNorth, level, ret);

    return ret.x;
}

function maxGeographicTileY(bbox: BBox, level: number) {
    const eastSouth = new Cartographic(CesiumMath.toRadians(bbox[2]), CesiumMath.toRadians(bbox[1]));

    const ret = new Cartesian2();

    tilingScheme.positionToTileXY(eastSouth, level, ret);

    return ret.y;
}

function getBoundingBox(featureCollection: FeatureCollection): BBox {
    const features = featureCollection.features;

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;

    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < features.length; i++) {
        const feature = features[i];

        if (feature.geometry.type === "Point") {
            const point: Point = feature.geometry as Point;

            const coordinate = point.coordinates;
            const x = coordinate[0];
            const y = coordinate[1];

            if (x < minX) {
                minX = x;
            }

            if (y < minY) {
                minY = y;
            }

            if (x > maxX) {
                maxX = x;
            }

            if (y > maxY) {
                maxY = y;
            }
        }
    }

    return [minX, minY, maxX, maxY];
}

function intersectWithRectangle(feature: Feature, rectangle: Rectangle) {
    if (feature.geometry.type === "Point") {
        const point: Point = feature.geometry as Point;
        const coordinate = point.coordinates;
        const x = coordinate[0];
        const y = coordinate[1];

        const cartographic = new Cartographic(CesiumMath.toRadians(x), CesiumMath.toRadians(y));

        return Rectangle.contains(rectangle, cartographic);
    } else {
        return false;
    }
}

function exportOneTile(
    tilingOptions: TilingOptions,
    featureCollection: FeatureCollection,
    x: number,
    y: number,
    level: number
) {
    const rectangle = tilingScheme.tileXYToRectangle(x, y, level);
    const features = featureCollection.features;
    const intersectedFeatures = [];

    // find intersected features
    for (let i = 0; i < features.length; i++) {
        const feature = features[i];

        if (!intersectWithRectangle(feature, rectangle)) {
            continue;
        }

        intersectedFeatures.push(feature);
    }

    if (intersectedFeatures.length === 0) {
        return;
    }

    console.info(`generating ${x}_${y}_${level}`);

    // @ts-ignore
    const keys = Object.keys(intersectedFeatures[0].properties);
    const values = [];

    // prepare unique values
    for (let i = 0; i < intersectedFeatures.length; i++) {
        const feature = intersectedFeatures[i];
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

    for (let i = 0; i < intersectedFeatures.length; i++) {
        const feature = intersectedFeatures[i];
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
            geometry: geometryOfPoint(x, y, level, tilingOptions.tileExtent, feature),
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
        version: tilingOptions.version, // This is a constant
        name: tilingOptions.name, // The name of the layer
        extent: tilingOptions.tileExtent, // The extent of the coordinate system local to this tile. 256 means that this tile has 256×256=65536 pixels, from (0,0) to (256,256).
        features: tileFeatures,
        keys: keys,
        values: layerValues
    };

    const tile = vector_tile.Tile.create({
        layers: [layer]
    });

    const savePath = tilingOptions.savePath + "/" + level;

    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
    }

    const fileName = `${x}_${y}_${level}.mvt`;
    const fullPath = savePath + "/" + fileName;

    const buffer = vector_tile.Tile.encode(tile).finish();

    fs.createWriteStream(fullPath).write(buffer);
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

    const projection = tilingScheme.projection;

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

interface TilingOptions {
    version: number;
    name: string;
    tileExtent: number;
    minLevel: number;
    maxLevel: number;
    savePath: string;
}

function exportMVTTileset(featureCollection: FeatureCollection, options: TilingOptions) {
    const bbox = getBoundingBox(featureCollection);

    const minLevel = options.minLevel;
    const maxLevel = options.maxLevel;

    for (let level = minLevel; level <= maxLevel; level++) {
        const minX = minGeographicTileX(bbox, level);
        const maxX = maxGeographicTileX(bbox, level);

        const minY = minGeographicTileY(bbox, level);
        const maxY = maxGeographicTileY(bbox, level);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                exportOneTile(options, featureCollection, x, y, level);
            }
        }
    }
}

export { exportMVTTileset };
