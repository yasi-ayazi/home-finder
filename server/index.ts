import cors from "cors";
import express from "express";

import { properties } from "./data/properties.js";

const app = express();
const port = Number(process.env.PORT) || 3000;
const uiOrigin = process.env.UI_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: uiOrigin }));

app.get("/api/properties", (_request, response) => {
    response.json(properties);
});

app.listen(port, () => {
    console.log(`Property API listening on http://localhost:${port}`);
});
