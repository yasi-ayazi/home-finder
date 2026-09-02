import { Router } from "express";
import type { PropertyController } from "../controllers/propertyController.js";

export function createPropertyRouter(controller: PropertyController): Router {
    const router = Router();
    router.get("/", controller.list);
    router.get("/:id", controller.detail);
    return router;
}
