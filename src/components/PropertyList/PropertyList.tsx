import PropertyCard from "../PropertyCard/PropertyCard";
import type { Property } from "../../data/properties";
import "./PropertyList.css";

type PropertyListProps = {
  properties: Property[];
};

function PropertyList({ properties }: PropertyListProps) {
  return (
    <section className="buy-page__properties">
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
    </section>
  );
}

export default PropertyList;