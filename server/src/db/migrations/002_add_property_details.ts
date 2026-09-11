import type { MigrationBuilder } from "node-pg-migrate";

export function up(pgm: MigrationBuilder): void {
    pgm.addColumns("properties", {
        description: { type: "text", notNull: true, default: "" },
        gallery_media_keys: { type: "text[]", notNull: true, default: "{}" },
    });
}

export function down(pgm: MigrationBuilder): void {
    pgm.dropColumns("properties", ["description", "gallery_media_keys"]);
}
