import { Buffer } from "buffer";
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

const uint8Array = generateMVTTileBuffer(featureCollection.features, {
    x: 1,
    y: 1,
    level: 1,
    version: 2,
    layerName: "test",
    tileExtent: 4096
});

console.log("buffer");
console.log(Array.from(uint8Array));

const buffer = Buffer.from(uint8Array);

const base64String = buffer.toString("base64");

console.log("base64String");
console.log(base64String);

function base64ToUint8Array(base64String: string) {
    const binaryString = Buffer.from(base64String, "base64").toString("binary");
    const uint8Array = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    return uint8Array;
}

const base64StringFromBq =
    "GqICCgR0ZXN0Eh0SEgAAAQACAQMCBAMFBAYFBwYLBxgBIgUJlAaUEBoDRklEGghPQkpFQ1RJRBoJQ0lUWV9OQU1FGglHTUlfQURNSU4aCkFETUlOX05BTUUaCkZJUFNfQ05UUlkaCkNOVFJZX05BTUUaBlNUQVRVUxoDUE9QGghQT1BfUkFOSxoJUE9QX0NMQVNTGgdQT1JUX0lEGgpMQUJFTF9GTEFHGgpQT1BfU09VUkNFIgkZAAAAAADOo0AiCAoGTmVsc29uIgkKB05aTC1OTVIiFAoSTmVsc29uLU1hcmxib3JvdWdoIgQKAk5aIg0KC05ldyBaZWFsYW5kIhQKElByb3ZpbmNpYWwgY2FwaXRhbCIJGQAAAABA/+pAKIAgeAI=";

const bufferFromStringFromBrowser =
    "GqICCgR0ZXN0Eh0SEgAAAQACAQMCBAMFBAYFBwYLBxgBIgUJzD2UEBoDRklEGghPQkpFQ1RJRBoJQ0lUWV9OQU1FGglHTUlfQURNSU4aCkFETUlOX05BTUUaCkZJUFNfQ05UUlkaCkNOVFJZX05BTUUaBlNUQVRVUxoDUE9QGghQT1BfUkFOSxoJUE9QX0NMQVNTGgdQT1JUX0lEGgpMQUJFTF9GTEFHGgpQT1BfU09VUkNFIgkZAAAAAADOo0AiCAoGTmVsc29uIgkKB05aTC1OTVIiFAoSTmVsc29uLU1hcmxib3JvdWdoIgQKAk5aIg0KC05ldyBaZWFsYW5kIhQKElByb3ZpbmNpYWwgY2FwaXRhbCIJGQAAAABA/+pAKIAgeAI=";

const bufferFromString = base64ToUint8Array(base64StringFromBq);

// const vectorTile = new VectorTile(new Protobuf(uint8Array));
const vectorTile = new VectorTile(new Protobuf(bufferFromString));

Object.values(vectorTile.layers).forEach((layer: any) => {
    for (let i = 0; i < layer.length; i++) {
        const feature = layer.feature(i);

        const geoJsonFeature = feature.toGeoJSON(1, 1, 1);

        console.log(JSON.stringify(geoJsonFeature));
    }
});

console.info("done");
