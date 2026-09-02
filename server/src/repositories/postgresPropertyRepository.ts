import type { Pool } from "pg";
import type { PropertyRecord } from "../models/property.js";
import type { PropertyRepository } from "./propertyRepository.js";

type PropertyRow = {
    id: number;
    price_amount: number;
    currency: string;
    address: string;
    city: string;
    property_type: string;
    bedrooms: number;
    bathrooms: number;
    area_square_metres: string;
    badges: string[];
    media_key: string;
    latitude: string;
    longitude: string;
    created_at: Date;
    updated_at: Date;
};

const selectColumns = `
    id, price_amount, currency, address, city, property_type, bedrooms,
    bathrooms, area_square_metres, badges, media_key, latitude, longitude,
    created_at, updated_at
`;

function mapRow(row: PropertyRow): PropertyRecord {
    return {
        id: row.id,
        priceAmount: row.price_amount,
        currency: row.currency,
        address: row.address,
        city: row.city,
        propertyType: row.property_type,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        areaSquareMetres: Number(row.area_square_metres),
        badges: row.badges,
        mediaKey: row.media_key,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export class PostgresPropertyRepository implements PropertyRepository {
    public constructor(private readonly pool: Pool) {}

    public async findAll(): Promise<PropertyRecord[]> {
        const result = await this.pool.query<PropertyRow>(
            `SELECT ${selectColumns} FROM properties ORDER BY id`,
        );
        return result.rows.map(mapRow);
    }

    public async findById(id: number): Promise<PropertyRecord | null> {
        const result = await this.pool.query<PropertyRow>(
            `SELECT ${selectColumns} FROM properties WHERE id = $1`,
            [id],
        );
        return result.rows[0] ? mapRow(result.rows[0]) : null;
    }
}
