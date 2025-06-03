# MVT-Tiler

Simply Builds mapbox vector tilesets from of GeoJSON(for now supports only point).

[![](http://img.youtube.com/vi/goE5BPXzzBQ/0.jpg)](http://www.youtube.com/watch?v=goE5BPXzzBQ)

## To generate MVT tileset from sample points data.

```
yarn build:protobuf
yarn gen-mvt-tileset
```

## To test generate mvt tiles

1 start MVT tile server. Need to check if mvtTilePath is valid in src/mvtServer.ts

```
yarn mvt-server
```

2 execute client/MapboxVectorTile.html on your web serrver.

## Reference

https://keita.blog/2022/04/16/creating-vector-tiles-from-scratch-using-typescript/
