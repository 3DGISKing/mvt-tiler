import { Cartesian2, Cartographic, Math as CesiumMath, WebMercatorTilingScheme } from "cesium";
import { BBox, FeatureCollection, Point } from "geojson";
import { TilingOptions } from "./tilingOptions";
import exportOneTile from "./exportOneTile";

const tilingScheme = new WebMercatorTilingScheme();

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
