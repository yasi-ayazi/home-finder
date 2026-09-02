import type { RequestHandler } from "express";
import { z } from "zod";
import { HttpError } from "../middleware/errors.js";
import type { PropertyService } from "../services/propertyService.js";

const idSchema = z.coerce.number().int().positive();

export class PropertyController {
    public constructor(private readonly service: PropertyService) {}

    public list: RequestHandler = async (_request, response) => {
        response.json(await this.service.getAll());
    };

    public detail: RequestHandler = async (request, response) => {
        const result = idSchema.safeParse(request.params.id);
        if (!result.success) {
            throw new HttpError(
                400,
                "INVALID_PROPERTY_ID",
                "Property ID must be a positive integer",
            );
        }

        const property = await this.service.getById(result.data);
        if (!property) {
            throw new HttpError(
                404,
                "PROPERTY_NOT_FOUND",
                "Property was not found",
            );
        }

        response.json(property);
    };
}
