import "dotenv/config";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { loadEnvironment } from "../config/environment.js";
import { createPool } from "./pool.js";
import { seedProperties } from "./seedData.js";

const environment = loadEnvironment();
const pool = createPool(environment.DATABASE_URL);
const seedMediaRoot = path.resolve(process.cwd(), "seed-media");

try {
    for (const property of seedProperties) {
        await pool.query(
            `INSERT INTO properties (
                id, price_amount, currency, address, city, property_type, bedrooms,
                bathrooms, area_square_metres, badges, media_key, latitude, longitude
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            ON CONFLICT (id) DO NOTHING`,
            [
                property.id,
                property.priceAmount,
                property.currency,
                property.address,
                property.city,
                property.propertyType,
                property.bedrooms,
                property.bathrooms,
                property.areaSquareMetres,
                property.badges,
                property.mediaKey,
                property.latitude,
                property.longitude,
            ],
        );

        const source = path.resolve(seedMediaRoot, property.mediaKey);
        const destination = path.resolve(
            environment.STORAGE_ROOT,
            property.mediaKey,
        );
        if (
            !destination.startsWith(
                `${path.resolve(environment.STORAGE_ROOT)}${path.sep}`,
            )
        ) {
            throw new Error(`Unsafe media destination: ${property.mediaKey}`);
        }
        await mkdir(path.dirname(destination), { recursive: true });
        await copyFile(source, destination, 0x1).catch(
            (error: NodeJS.ErrnoException) => {
                if (error.code !== "EEXIST") throw error;
            },
        );
    }
    console.log(`Seeded ${seedProperties.length} properties and their media`);
} finally {
    await pool.end();
}
