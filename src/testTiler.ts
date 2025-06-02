const fs = require("fs");
import { FeatureCollection } from "geojson";
import { exportMVTTileset } from "./lib/tiler";
import testPoints from "./data/points.json";

const savePath = "mvt-tileset";

if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
}

exportMVTTileset(testPoints as FeatureCollection, {
    version: 2.0,
    name: "test",
    tileExtent: 4096,
    minLevel: 0,
    maxLevel: 7,
    savePath: savePath
});

console.info("done");
