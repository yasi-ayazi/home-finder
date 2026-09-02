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

    return (data as Property[]).map((property) => ({
        ...property,
        imageUrl: resolveApiResource(property.imageUrl),
    }));
}
