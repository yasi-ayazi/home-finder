export type Property = {
    id: number;
    image: string;
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

export const properties: Property[] = [
    {
        id: 1,
        image: "/images/property-1.jpg",
        price: "2,450,000 DKK",
        address: "Strandvejen 45",
        city: "Copenhagen",
        type: "Villa",
        bedrooms: 3,
        bathrooms: 2,
        area: "145 m²",
        badges: ["Featured", "New"],
        latitude: 55.6761,
        longitude: 12.5683,
    },
    {
        id: 2,
        image: "/images/property-2.jpg",
        price: "1,850,000 DKK",
        address: "Nørrebrogade 210",
        city: "Copenhagen",
        type: "Apartment",
        bedrooms: 2,
        bathrooms: 1,
        area: "95 m²",
        badges: ["Open House"],
        latitude: 55.6995,
        longitude: 12.5537,
    },
    {
        id: 3,
        image: "/images/property-3.jpg",
        price: "3,200,000 DKK",
        address: "Havnevej 12",
        city: "Aarhus",
        type: "Townhouse",
        bedrooms: 4,
        bathrooms: 3,
        area: "180 m²",
        badges: ["Featured", "Reduced Price"],
        latitude: 56.1629,
        longitude: 10.2039,
    },
    {
        id: 4,
        image: "/images/property-4.jpg",
        price: "2,750,000 DKK",
        address: "Frederiksberg Allé 82",
        city: "Frederiksberg",
        type: "Apartment",
        bedrooms: 3,
        bathrooms: 2,
        area: "118 m²",
        badges: ["New"],
        latitude: 55.6759,
        longitude: 12.5321,
    },
    {
        id: 5,
        image: "/images/property-5.jpg",
        price: "4,150,000 DKK",
        address: "Skovvej 28",
        city: "Aarhus",
        type: "Villa",
        bedrooms: 4,
        bathrooms: 2,
        area: "175 m²",
        badges: ["Featured"],
        latitude: 56.1702,
        longitude: 10.2137,
    },
    {
        id: 6,
        image: "/images/property-6.jpg",
        price: "2,150,000 DKK",
        address: "Havneparken 16",
        city: "Odense",
        type: "Townhouse",
        bedrooms: 3,
        bathrooms: 2,
        area: "132 m²",
        badges: ["Open House"],
        latitude: 55.4038,
        longitude: 10.4024,
    },
];
