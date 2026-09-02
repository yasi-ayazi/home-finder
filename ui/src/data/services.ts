export type Service = {
    id: number;
    title: string;
    description: string;
};

export const services: Service[] = [
    {
        id: 1,
        title: "Find Your Dream Home",
        description: "Browse thousands of homes across Denmark.",
    },
    {
        id: 2,
        title: "Fast Search",
        description: "Find the right property in just a few clicks.",
    },
    {
        id: 3,
        title: "Save Favorites",
        description: "Keep track of the homes you love.",
    },
];