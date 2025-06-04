const fs = require("fs");

import { FeatureCollection } from "geojson";
import { TilingOptions } from "./tilingOptions";
import getSimplifiedFeatures from "./getSimpifiedFeatures";
import generateMVTTileBuffer from "./generateMVTTileBuffer";

export default function exportOneTile(
    tilingOptions: TilingOptions,
    featureCollection: FeatureCollection,
    x: number,
    y: number,
    level: number
) {
    const simplifiedFeatures = getSimplifiedFeatures(featureCollection, x, y, level);

    if (simplifiedFeatures.length === 0) {
        return;
    }

    console.info(`generating ${x}_${y}_${level}`);

    const savePath = tilingOptions.savePath + "/" + level;

    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
    }

    const fileName = `${x}_${y}_${level}.mvt`;
    const fullPath = savePath + "/" + fileName;

    const buffer = generateMVTTileBuffer(simplifiedFeatures, {
        x: x,
        y: y,
        level: level,
        version: tilingOptions.version,
        layerName: tilingOptions.name,
        tileExtent: tilingOptions.tileExtent
    });

    fs.createWriteStream(fullPath).write(buffer);
}
