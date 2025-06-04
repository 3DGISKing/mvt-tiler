import { Cartographic, Math as CesiumMath, Rectangle, WebMercatorTilingScheme } from "cesium";
import { Feature, FeatureCollection, Point } from "geojson";

const tilingScheme = new WebMercatorTilingScheme();

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

export default function getSimplifiedFeatures(
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

    return intersectedFeatures;
}
