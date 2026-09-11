import { apiUrl, resolveApiResource } from "../config";
import type { Property } from "../types/property";

export async function fetchProperties(
    signal?: AbortSignal,
): Promise<Property[]> {
    const response = await fetch(`${apiUrl}/api/properties`, { signal });
    if (!response.ok) {
        throw new Error("Failed to load properties");
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
        throw new Error("Invalid properties response");
    }

    return (data as Property[]).map(mapPropertyResources);
}

export async function fetchProperty(
    id: string,
    signal?: AbortSignal,
): Promise<Property> {
    const response = await fetch(`${apiUrl}/api/properties/${id}`, { signal });

    if (!response.ok) {
        throw new Error("Failed to load property");
    }

    const data: unknown = await response.json();

    if (typeof data !== "object" || data === null) {
        throw new Error("Invalid property response");
    }

    const property = data as Property;

    return mapPropertyResources(property);
}

function mapPropertyResources(property: Property): Property {
    return {
        ...property,
        imageUrl: resolveApiResource(property.imageUrl),
        imageUrls: property.imageUrls.map(resolveApiResource),
    };
}
