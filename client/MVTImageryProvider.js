const {
    WebMercatorTilingScheme
} = window.Cesium;

class MVTImageryProvider {
    constructor(options) {
        this.ready = true;
        this.tileWidth = 256;
        this.tileHeight = 256;
        this.tilingScheme = new WebMercatorTilingScheme();
        this.hasAlphaChannel = true;
        this.rectangle = this.tilingScheme.rectangle;

        this._mapboxRenderer = new window.Mapbox.BasicRenderer({
            style: options.style,
            showTileBoundaries: true
        });
    }

    requestImage(x, y, level, request) {
        this._mapboxRenderer.filterForZoom(level);

        const tilesSpec = this._mapboxRenderer
            .getVisibleSources()
            .reduce((a, s) => a.concat(this._getTilesSpec({x: x, y: y}, level, s)), []);

        const drawSpec = {
            srcLeft: 0,
            srcTop: 0,
            width: this.tileWidth,
            height: this.tileWidth,
            destLeft: 0,
            destTop: 0
        };

        const canvas = this._createCanvas();

        return new Promise((resolve) => {
            const renderRef = this._mapboxRenderer.renderTiles(
                canvas.getContext("2d"),
                drawSpec,
                tilesSpec,
                (err) => {
                    if (err) {
                        return Promise.reject(err);
                    } else {
                        resolve(canvas);
                        renderRef.consumer.ctx = undefined;
                        this._mapboxRenderer.releaseRender(renderRef);
                    }
                }
            );
        });
    }

    pickFeatures(x, y, level, longitude, latitude) {
        return undefined;
    }

    _createCanvas() {
        const canvas = document.createElement("canvas");

        canvas.width = this.tileWidth;
        canvas.height = this.tileHeight;
        canvas.style.imageRendering = "pixelated";
        canvas.getContext("2d").globalCompositeOperation = "copy";

        return canvas;
    }

    _getTilesSpec(coordinate, zoom, source) {
        const layerSource = this._mapboxRenderer._initStyle.sources[source];
        const tileSize = this.tileWidth;

        if (zoom >= layerSource.maxzoom) {
            // this may be either a single source tile, if we are interested in an interior region,
            // or as much as 4 source tiles, if we have to get the corner of the tile.
            const shift = zoom - layerSource.maxzoom;
            const mask = (1 << shift) - 1;
            const size = tileSize * (1 << shift);
            const ret = [];

            for (let x = -1; x <= 1; x++)
                for (let y = -1; y <= 1; y++) {
                    if (
                        (x === -1 && (coordinate.x & mask) !== 0) ||
                        (x === +1 && (coordinate.x & mask) !== mask) ||
                        (y === -1 && (coordinate.y & mask) !== 0) ||
                        (y === +1 && (coordinate.y & mask) !== mask)
                    ) {
                        // eslint-disable-next-line
                        continue;
                    }
                    ret.push({
                        source: source,
                        z: layerSource.maxzoom,
                        x: (coordinate.x >> shift) + x,
                        y: (coordinate.y >> shift) + y,
                        left: -(coordinate.x & mask) * tileSize + x * size,
                        top: -(coordinate.y & mask) * tileSize + y * size,
                        size: size
                    });
                }

            return ret;
        }

        return [
            {
                source: source,
                z: zoom,
                x: coordinate.x,
                y: coordinate.y,
                left: 0,
                top: 0,
                size: tileSize
            }
        ];
    }
}

export default MVTImageryProvider;