import type { PropertyRecord, PropertyResponse } from "../models/property.js";
import type { PropertyRepository } from "../repositories/propertyRepository.js";

const safeMediaKey = /^properties\/[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

export class PropertyService {
    public constructor(private readonly repository: PropertyRepository) {}

    public async getAll(): Promise<PropertyResponse[]> {
        return Promise.all((await this.repository.findAll()).map(mapProperty));
    }

    public async getById(id: number): Promise<PropertyResponse | null> {
        const property = await this.repository.findById(id);
        return property ? mapProperty(property) : null;
    }
}

export function mapProperty(property: PropertyRecord): PropertyResponse {
    if (!safeMediaKey.test(property.mediaKey)) {
        throw new Error("Property has an invalid media key");
    }

    const area = Number.isInteger(property.areaSquareMetres)
        ? property.areaSquareMetres.toString()
        : property.areaSquareMetres
              .toFixed(2)
              .replace(/0+$/, "")
              .replace(/\.$/, "");

    return {
        id: property.id,
        imageUrl: `/media/${property.mediaKey}`,
        price: `${new Intl.NumberFormat("en-US").format(property.priceAmount)} ${property.currency}`,
        address: property.address,
        city: property.city,
        type: property.propertyType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: `${area} m²`,
        badges: property.badges,
        latitude: property.latitude,
        longitude: property.longitude,
    };
}
