const fs = require("fs");
const express = require("express");
const cors = require("cors");

const mvtTilePath = "mvt-tileset";

if (!fs.existsSync(mvtTilePath)) {
    console.error(`${mvtTilePath} does not exsit`);
} else {
    start();
}

function start() {
    const app = express();

    function sendMVT(req: any, res: any, next: any) {
        const z = req.params.z;
        const mvtFileName = req.params.mvtFileName;

        const filePath = `${mvtTilePath}/${z}/${mvtFileName}`;

        if (!fs.existsSync(filePath)) {
            res.status(404).send(`Tile not found: ${filePath}`);
            return;
        }

        const readStream = fs.createReadStream(filePath);

        readStream.on("open", function (data: any) {
            res.setHeader("Content-Type", "application/vnd.mapbox-vector-tile");
            readStream.pipe(res);
        });

        readStream.on("error", (err: any) => {
            if (err.code === "ENOENT") {
                res.status(404).send(`Tile not found: ${filePath}`);
            } else {
                console.error(`Error reading tile: ${err.message}`);
                res.status(500).send("Internal server error");
            }
        });
    }

    function sendMVTCesium(req: any, res: any, next: any) {
        const x = req.params.x;
        const y = req.params.y;
        const z = req.params.z;

        const filePath = `${mvtTilePath}/${z}/${x}_${y}_${z}.mvt`;

        if (!fs.existsSync(filePath)) {
            res.status(404).send(`Tile not found: ${filePath}`);
            return;
        }

        const readStream = fs.createReadStream(filePath);

        readStream.on("open", function (data: any) {
            res.setHeader("Content-Type", "application/vnd.mapbox-vector-tile");
            readStream.pipe(res);
        });

        readStream.on("error", (err: any) => {
            if (err.code === "ENOENT") {
                res.status(404).send(`Tile not found: ${filePath}`);
            } else {
                console.error(`Error reading tile: ${err.message}`);
                res.status(500).send("Internal server error");
            }
        });
    }

    app.use(cors());

    // from mapbox
    app.get("/:z/:mvtFileName", sendMVT);

    // from cesium
    app.get("/:z/:x/:y", sendMVTCesium);

    const port = 5000;

    const server = app.listen(port, () => {
        console.info(`Server started at port: ${port}`);
    });
}

export {};
