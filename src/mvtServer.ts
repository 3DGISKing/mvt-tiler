const express = require("express");
const fs = require("fs");
const cors = require("cors");

const mvtTilePath = "mvt-tileset";
const port = 5000;

if (!fs.existsSync(mvtTilePath)) {
    console.error(`${mvtTilePath} does not exsit`);
} else {
    start();
}

function sendMVT(req: any, res: any, next: any) {
    res.set({
        "Content-Type": "application/vnd.mapbox-vector-tile",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });

    const tokens = req.url.split("/");

    const z = parseInt(tokens[1]);
    const x = parseInt(tokens[2]);
    const y = parseInt(tokens[3]);

    const filePath = `${mvtTilePath}/${z}/${x}_${y}_${z}.mvt`;

    if (!fs.existsSync(filePath)) {
        next(new Error(`tile: x = ${x} y = ${y} z = ${z} does not exsit`));
        return;
    }

    try {
        const readStream = fs.createReadStream(filePath);

        readStream.on("error", function () {
            next(new Error(req.url));
        });

        readStream.on("data", function (data: any) {
            res.send(data);
        });
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        next(new Error(error.message));
    }
}

function start() {
    const app = express();

    app.options("*", cors());
    app.use(express.static(mvtTilePath));
    app.get("*", sendMVT);

    const server = app.listen(port);

    console.info(`server started at port: ${port}`);
}

export {};
