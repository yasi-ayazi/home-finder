import { useEffect, useState } from "react";
import "./FeaturedProperties.css";
import PropertyCard from "../PropertyCard/PropertyCard";
import type { Property } from "../../types/property";
import { fetchProperties } from "../../api/properties";

function FeaturedProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadFeaturedProperties() {
            try {
                const data = await fetchProperties(controller.signal);
                const featuredProperties = data.filter((property) =>
                    property.badges.includes("Featured"),
                );

                setProperties(featuredProperties);
                setError("");
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                setError("Failed to load featured properties.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        loadFeaturedProperties();

        return () => controller.abort();
    }, []);

    return (
        <section className="featured-properties">
            <h2 className="featured-properties__title">Featured Properties</h2>

            <p className="featured-properties__description">
                Discover our hand-picked homes across Denmark.
            </p>

            <div className="featured-properties__cards">
                {isLoading ? (
                    <p className="featured-properties__status">
                        Loading featured properties...
                    </p>
                ) : error ? (
                    <p className="featured-properties__status featured-properties__status--error">
                        {error}
                    </p>
                ) : properties.length === 0 ? (
                    <p className="featured-properties__status">
                        No featured properties are available right now.
                    </p>
                ) : (
                    properties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            id={property.id}
                            imageUrl={property.imageUrl}
                            price={property.price}
                            address={property.address}
                            city={property.city}
                            type={property.type}
                            bedrooms={property.bedrooms}
                            bathrooms={property.bathrooms}
                            area={property.area}
                            badges={property.badges}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

export default FeaturedProperties;
