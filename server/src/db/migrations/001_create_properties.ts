import type { MigrationBuilder } from "node-pg-migrate";

export function up(pgm: MigrationBuilder): void {
    pgm.createTable("properties", {
        id: { type: "integer", primaryKey: true },
        price_amount: {
            type: "integer",
            notNull: true,
            check: "price_amount >= 0",
        },
        currency: { type: "char(3)", notNull: true, default: "DKK" },
        address: { type: "text", notNull: true },
        city: { type: "text", notNull: true },
        property_type: { type: "text", notNull: true },
        bedrooms: { type: "smallint", notNull: true, check: "bedrooms >= 0" },
        bathrooms: { type: "smallint", notNull: true, check: "bathrooms >= 0" },
        area_square_metres: {
            type: "numeric(8,2)",
            notNull: true,
            check: "area_square_metres > 0",
        },
        badges: { type: "text[]", notNull: true, default: "{}" },
        media_key: { type: "text", notNull: true, unique: true },
        latitude: {
            type: "numeric(9,6)",
            notNull: true,
            check: "latitude BETWEEN -90 AND 90",
        },
        longitude: {
            type: "numeric(9,6)",
            notNull: true,
            check: "longitude BETWEEN -180 AND 180",
        },
        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });
}

export function down(pgm: MigrationBuilder): void {
    pgm.dropTable("properties");
}
