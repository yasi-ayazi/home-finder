import express from "express";
import path from "node:path";

import { properties } from "../src/data/properties.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use("/images", express.static(path.join(process.cwd(), "public", "images")));

app.get("/api/properties", (_request, response) => {
    response.json(properties);
});

app.listen(port, () => {
    console.log(`Property API listening on http://localhost:${port}`);
});
