import Protobuf from "pbf";
import { VectorTile } from "@mapbox/vector-tile";

export function testVectorTile(buffer: any, x: number, y: number, z: number) {
    const vectorTile = new VectorTile(new Protobuf(buffer));

    Object.values(vectorTile.layers).forEach((layer: any) => {
        for (let i = 0; i < layer.length; i++) {
            const feature = layer.feature(i);

            const geoJsonFeature = feature.toGeoJSON(x, y, z);

            console.log(geoJsonFeature);
        }
    });
}
