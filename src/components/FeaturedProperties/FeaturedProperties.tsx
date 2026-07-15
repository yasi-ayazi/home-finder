import "./FeaturedProperties.css";
import PropertyCard from "../PropertyCard/PropertyCard";

import { properties } from "../../data/properties";

function FeaturedProperties() {
    return (
        <section className="featured-properties">

            <h2 className="featured-properties__title">
                Featured Properties
            </h2>

            <p className="featured-properties__description">
                Discover our hand-picked homes across Denmark.
            </p>

            <div className="featured-properties__cards">

                {/* Render one card for each property */}
                {properties.map((property) => (
                    <PropertyCard
                        key={property.id}
                        id={property.id}
                        image={property.image}
                        price={property.price}
                        address={property.address}
                        city={property.city}
                        type={property.type}
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        area={property.area}
                        badges={property.badges}
                    />
                ))}

            </div>

        </section>
    );
}

export default FeaturedProperties;