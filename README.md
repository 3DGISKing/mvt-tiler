# MVT-Tiler

Simply Builds mapbox vector tilesets from of GeoJSON(for now supports only point).

[![](http://img.youtube.com/vi/goE5BPXzzBQ/0.jpg)](http://www.youtube.com/watch?v=goE5BPXzzBQ)

## How to run

```
yarn build:protobuf
yarn dev
```

please specify correct parameters in src/testTiler.ts

```
import testPoints from "./data/points.json"; // test geojson

exportMVTTileset(testPoints as FeatureCollection, {
    version: 2.0,
    name: "test",
    tileExtent: 4096,
    minLevel: 0,
    maxLevel: 7,
    savePath: "D:/wwtest"
});
```

## How to test

1 start MVT tile server. Need to check if mvtTilePath is valid in src/mvtServer.ts

```
yarn dev-server
```

2 execute client/MapboxVectorTile.html on your web serrver.

## Reference

https://keita.blog/2022/04/16/creating-vector-tiles-from-scratch-using-typescript/
