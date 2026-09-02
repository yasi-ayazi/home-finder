export type SeedProperty = {
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
};

export const seedProperties: SeedProperty[] = [
    {
        id: 1,
        priceAmount: 2450000,
        currency: "DKK",
        address: "Strandvejen 45",
        city: "Copenhagen",
        propertyType: "Villa",
        bedrooms: 3,
        bathrooms: 2,
        areaSquareMetres: 145,
        badges: ["Featured", "New"],
        mediaKey: "properties/property-1.jpg",
        latitude: 55.6761,
        longitude: 12.5683,
    },
    {
        id: 2,
        priceAmount: 1850000,
        currency: "DKK",
        address: "Nørrebrogade 210",
        city: "Copenhagen",
        propertyType: "Apartment",
        bedrooms: 2,
        bathrooms: 1,
        areaSquareMetres: 95,
        badges: ["Open House"],
        mediaKey: "properties/property-2.jpg",
        latitude: 55.6995,
        longitude: 12.5537,
    },
    {
        id: 3,
        priceAmount: 3200000,
        currency: "DKK",
        address: "Havnevej 12",
        city: "Aarhus",
        propertyType: "Townhouse",
        bedrooms: 4,
        bathrooms: 3,
        areaSquareMetres: 180,
        badges: ["Featured", "Reduced Price"],
        mediaKey: "properties/property-3.jpg",
        latitude: 56.1629,
        longitude: 10.2039,
    },
    {
        id: 4,
        priceAmount: 2750000,
        currency: "DKK",
        address: "Frederiksberg Allé 82",
        city: "Frederiksberg",
        propertyType: "Apartment",
        bedrooms: 3,
        bathrooms: 2,
        areaSquareMetres: 118,
        badges: ["New"],
        mediaKey: "properties/property-4.jpg",
        latitude: 55.6759,
        longitude: 12.5321,
    },
    {
        id: 5,
        priceAmount: 4150000,
        currency: "DKK",
        address: "Skovvej 28",
        city: "Aarhus",
        propertyType: "Villa",
        bedrooms: 4,
        bathrooms: 2,
        areaSquareMetres: 175,
        badges: ["Featured"],
        mediaKey: "properties/property-5.jpg",
        latitude: 56.1702,
        longitude: 10.2137,
    },
    {
        id: 6,
        priceAmount: 2150000,
        currency: "DKK",
        address: "Havneparken 16",
        city: "Odense",
        propertyType: "Townhouse",
        bedrooms: 3,
        bathrooms: 2,
        areaSquareMetres: 132,
        badges: ["Open House"],
        mediaKey: "properties/property-6.jpg",
        latitude: 55.4038,
        longitude: 10.4024,
    },
];
