import { useState } from "react";
import SearchBox from "../components/SearchBox/SearchBox";
import PropertyCard from "../components/PropertyCard/PropertyCard";
import { properties } from "../data/properties";

function Buy() {
  const [query, setQuery] = useState("");

  function handleSearch() {
    console.log(query);
  }

  // Filter properties by city + address + type
  const q = query.trim().toLowerCase();   //q is a part of the query for example city like "cope"

  const filteredProperties = properties.filter((property) =>
    property.city.toLowerCase().includes(q) ||
    property.address.toLowerCase().includes(q) ||
    property.type.toLowerCase().includes(q)
  );

  return (
    <main className="buy-page">
      <h1>Properties for Sale</h1>

      <section>
        <SearchBox
          activeTab="buy"
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
        />
      </section>

      <section>Filters</section>

      <section>Map</section>

      <section>
        {filteredProperties.map((property) => (
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

      <section>Load More</section>
    </main>
  );
}

export default Buy;