import Protobuf from "pbf";
import { VectorTile } from "@mapbox/vector-tile";
import exportOneMVTTile from "./lib/exportOneMVTTile";
import generateMVTTileBuffer from "./lib/generateMVTTileBuffer";

const tilingOptions = {
    version: 2.0,
    name: "world-cities",
    tileExtent: 4096,
    minLevel: 0,
    maxLevel: 1,
    savePath: "./one_tile_test"
};

const geoJSONString =
    '{"type": "FeatureCollection","name": "world-cities","crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },"features": [{ "type": "Feature", "properties": { "FID": 2535, "OBJECTID": 2535, "CITY_NAME": "Nelson", "GMI_ADMIN": "NZL-NMR", "ADMIN_NAME": "Nelson-Marlborough", "FIPS_CNTRY": "NZ", "CNTRY_NAME": "New Zealand", "STATUS": "Provincial capital", "POP": 0, "POP_RANK": 0, "POP_CLASS": null, "PORT_ID": 55290, "LABEL_FLAG": 0, "POP_SOURCE": null }, "geometry": { "type": "Point", "coordinates": [ 173.248002401406438, -41.297004033335185 ] } }] }';

const featureCollection = JSON.parse(geoJSONString);
console.log(featureCollection);

exportOneMVTTile(tilingOptions, featureCollection, 1, 1, 1);

const buffer = generateMVTTileBuffer(featureCollection.features, {
    x: 1,
    y: 1,
    level: 1,
    version: 2,
    layerName: "test",
    tileExtent: 4096
});

const vectorTile = new VectorTile(new Protobuf(buffer));

Object.values(vectorTile.layers).forEach((layer: any) => {
    for (let i = 0; i < layer.length; i++) {
        const feature = layer.feature(i);

        const geoJsonFeature = feature.toGeoJSON(1, 1, 1);

        console.log(JSON.stringify(geoJsonFeature));
    }
});

console.info("done");
