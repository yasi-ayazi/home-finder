import { apiReference } from "@scalar/express-api-reference";
import cors from "cors";
import express, { type Express } from "express";
import type { Pool } from "pg";
import { PropertyController } from "./controllers/propertyController.js";
import { createErrorHandler, notFoundHandler } from "./middleware/errors.js";
import { openApiSpecification } from "./openapi/specification.js";
import type { PropertyRepository } from "./repositories/propertyRepository.js";
import { createPropertyRouter } from "./routes/propertyRoutes.js";
import { PropertyService } from "./services/propertyService.js";

export type AppDependencies = {
    propertyRepository: PropertyRepository;
    pool: Pick<Pool, "query">;
    storageRoot: string;
    uiOrigin: string;
    isProduction?: boolean;
};

export function createApp(dependencies: AppDependencies): Express {
    const app = express();
    const service = new PropertyService(dependencies.propertyRepository);
    const controller = new PropertyController(service);

    app.disable("x-powered-by");
    app.use(cors({ origin: dependencies.uiOrigin }));
    app.use(express.json({ limit: "100kb" }));
    app.use(
        "/media",
        express.static(dependencies.storageRoot, {
            dotfiles: "deny",
            fallthrough: true,
            index: false,
        }),
    );

    app.get("/health", (_request, response) => response.json({ status: "ok" }));
    app.get("/ready", async (_request, response) => {
        try {
            await dependencies.pool.query("SELECT 1");
            response.json({ status: "ready" });
        } catch {
            response.status(503).json({
                error: {
                    code: "DATABASE_UNAVAILABLE",
                    message: "Database is unavailable",
                },
            });
        }
    });
    app.get("/openapi.json", (_request, response) =>
        response.json(openApiSpecification),
    );
    app.use("/docs", apiReference({ content: openApiSpecification }));
    app.use("/api/properties", createPropertyRouter(controller));
    app.use(notFoundHandler);
    app.use(createErrorHandler(dependencies.isProduction ?? false));

    return app;
}
