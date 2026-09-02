import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PostgresPropertyRepository } from "../repositories/postgresPropertyRepository.js";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const describeDatabase = testDatabaseUrl ? describe : describe.skip;

describeDatabase("PostgresPropertyRepository", () => {
    const pool = new Pool({ connectionString: testDatabaseUrl });
    const repository = new PostgresPropertyRepository(pool);

    beforeAll(async () => {
        await pool.query("SELECT 1");
    });

    afterAll(async () => pool.end());

    it("reads seeded property metadata", async () => {
        const properties = await repository.findAll();
        expect(properties).toHaveLength(6);
        expect(properties[0]).toMatchObject({
            id: 1,
            mediaKey: "properties/property-1.jpg",
        });
    });

    it("uses a parameterized lookup and returns null for missing IDs", async () => {
        await expect(repository.findById(1)).resolves.toMatchObject({ id: 1 });
        await expect(repository.findById(999999)).resolves.toBeNull();
    });
});
