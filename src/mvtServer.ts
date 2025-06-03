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

        // const tokens = mvtFileName;

        // const z = parseInt(tokens[1]);
        // const x = parseInt(tokens[2]);
        // const y = parseInt(tokens[3]);

        // if (isNaN(y)) {
        //     console.log(1);
        // }

        const filePath = `${mvtTilePath}/${z}/${mvtFileName}`;
        console.log(filePath);

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
    //app.use(express.static(mvtTilePath));

    app.get("/:z/:mvtFileName", sendMVT);

    const port = 5000;

    const server = app.listen(port, () => {
        console.info(`Server started at port: ${port}`);
    });
}

export {};
