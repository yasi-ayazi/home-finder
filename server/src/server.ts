import "dotenv/config";
import { createApp } from "./app.js";
import { loadEnvironment } from "./config/environment.js";
import { createPool } from "./db/pool.js";
import { PostgresPropertyRepository } from "./repositories/postgresPropertyRepository.js";

const environment = loadEnvironment();
const pool = createPool(environment.DATABASE_URL);
const repository = new PostgresPropertyRepository(pool);
const app = createApp({
    propertyRepository: repository,
    pool,
    storageRoot: environment.STORAGE_ROOT,
    uiOrigin: environment.UI_ORIGIN,
    isProduction: environment.NODE_ENV === "production",
});

const server = app.listen(environment.PORT, () => {
    console.log(
        `Home Finder API listening on http://localhost:${environment.PORT}`,
    );
});

async function shutdown(signal: string): Promise<void> {
    console.log(`${signal} received; shutting down`);
    server.close(async () => {
        await pool.end();
        process.exit(0);
    });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
