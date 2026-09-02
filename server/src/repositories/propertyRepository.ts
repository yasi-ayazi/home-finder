import type { PropertyRecord } from "../models/property.js";

export interface PropertyRepository {
    findAll(): Promise<PropertyRecord[]>;
    findById(id: number): Promise<PropertyRecord | null>;
}
