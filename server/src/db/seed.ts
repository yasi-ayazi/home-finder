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
                bathrooms, area_square_metres, badges, media_key,
                gallery_media_keys, description, latitude, longitude
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
                $14, $15
            )
            ON CONFLICT (id) DO UPDATE SET
                description = CASE
                    WHEN properties.description = '' THEN EXCLUDED.description
                    ELSE properties.description
                END,
                gallery_media_keys = CASE
                    WHEN cardinality(properties.gallery_media_keys) = 0
                        THEN EXCLUDED.gallery_media_keys
                    ELSE properties.gallery_media_keys
                END`,
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
                property.galleryMediaKeys,
                property.description,
                property.latitude,
                property.longitude,
            ],
        );

        for (const mediaKey of [
            property.mediaKey,
            ...property.galleryMediaKeys,
        ]) {
            const source = path.resolve(seedMediaRoot, mediaKey);
            const destination = path.resolve(
                environment.STORAGE_ROOT,
                mediaKey,
            );
            if (
                !destination.startsWith(
                    `${path.resolve(environment.STORAGE_ROOT)}${path.sep}`,
                )
            ) {
                throw new Error(`Unsafe media destination: ${mediaKey}`);
            }
            await mkdir(path.dirname(destination), { recursive: true });
            await copyFile(source, destination, 0x1).catch(
                (error: NodeJS.ErrnoException) => {
                    if (error.code !== "EEXIST") throw error;
                },
            );
        }
    }
    console.log(`Seeded ${seedProperties.length} properties and their media`);
} finally {
    await pool.end();
}
