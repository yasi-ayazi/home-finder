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
  },
];