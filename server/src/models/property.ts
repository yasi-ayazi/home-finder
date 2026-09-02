export type PropertyRecord = {
    id: number;
    priceAmount: number;
    currency: string;
    address: string;
    city: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    areaSquareMetres: number;
    badges: string[];
    mediaKey: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
};

export type PropertyResponse = {
    id: number;
    imageUrl: string;
    price: string;
    address: string;
    city: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    badges: string[];
    latitude: number;
    longitude: number;
};
