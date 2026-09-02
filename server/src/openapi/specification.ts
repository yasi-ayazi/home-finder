export const openApiSpecification = {
    openapi: "3.1.0",
    info: { title: "Home Finder API", version: "1.0.0" },
    paths: {
        "/health": {
            get: {
                summary: "Process health",
                responses: {
                    "200": { description: "Server process is healthy" },
                },
            },
        },
        "/ready": {
            get: {
                summary: "Database readiness",
                responses: {
                    "200": { description: "Database is reachable" },
                    "503": {
                        description: "Database is unavailable",
                        content: errorContent(),
                    },
                },
            },
        },
        "/api/properties": {
            get: {
                summary: "List properties",
                responses: {
                    "200": {
                        description: "All properties",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Property",
                                    },
                                },
                            },
                        },
                    },
                    "500": {
                        description: "Internal error",
                        content: errorContent(),
                    },
                },
            },
        },
        "/api/properties/{id}": {
            get: {
                summary: "Get a property",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer", minimum: 1 },
                    },
                ],
                responses: {
                    "200": {
                        description: "Property",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Property",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Invalid ID",
                        content: errorContent(),
                    },
                    "404": {
                        description: "Property not found",
                        content: errorContent(),
                    },
                    "500": {
                        description: "Internal error",
                        content: errorContent(),
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Property: {
                type: "object",
                required: [
                    "id",
                    "imageUrl",
                    "price",
                    "address",
                    "city",
                    "type",
                    "bedrooms",
                    "bathrooms",
                    "area",
                    "badges",
                    "latitude",
                    "longitude",
                ],
                properties: {
                    id: { type: "integer" },
                    imageUrl: {
                        type: "string",
                        example: "/media/properties/property-1.jpg",
                    },
                    price: { type: "string", example: "2,450,000 DKK" },
                    address: { type: "string" },
                    city: { type: "string" },
                    type: { type: "string" },
                    bedrooms: { type: "integer" },
                    bathrooms: { type: "integer" },
                    area: { type: "string", example: "145 m²" },
                    badges: { type: "array", items: { type: "string" } },
                    latitude: { type: "number" },
                    longitude: { type: "number" },
                },
            },
            Error: {
                type: "object",
                required: ["error"],
                properties: {
                    error: {
                        type: "object",
                        required: ["code", "message"],
                        properties: {
                            code: { type: "string" },
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
    },
} as const;

function errorContent() {
    return {
        "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    };
}
