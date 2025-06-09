const fs = require("fs");
import { FeatureCollection } from "geojson";
import exportMVTTileset from "./lib/exportMVTTileset";

const savePath = "mvt-tileset";

if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
}

// https://hub.arcgis.com/datasets/esri::world-cities/explore
const dataPath = "./world-cities.geojson";

const rawData = fs.readFileSync(dataPath, "utf8");
const testPoints = JSON.parse(rawData); // Parsed JSON object

exportMVTTileset(testPoints as FeatureCollection, {
    version: 2.0,
    name: "world-cities",
    tileExtent: 4096,
    minLevel: 0,
    maxLevel: 7,
    savePath: savePath
});

console.info("done");
