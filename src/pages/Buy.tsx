import { useState } from "react";
import "./Buy.css";
import SearchBox from "../components/SearchBox/SearchBox";
import PropertyCard from "../components/PropertyCard/PropertyCard";
import { properties } from "../data/properties";

function Buy() {
  const [query, setQuery] = useState("");

  function handleSearch() {
    console.log(query);
  }

  // Filter properties by city + address + type
  const q = query.trim().toLowerCase(); // q is a part of the query for example city like "cope"

  const filteredProperties = properties.filter((property) =>
    property.city.toLowerCase().includes(q) ||
    property.address.toLowerCase().includes(q) ||
    property.type.toLowerCase().includes(q)
  );

  return (
    <main className="buy-page">

      <section className="buy-page__header">
        <h1 className="buy-page__title">
          Properties for Sale
        </h1>

        <div className="buy-page__search">
          <SearchBox
            activeTab="buy"
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
          />
        </div>
      </section>

      <section className="buy-page__controls">
        <button
          type="button"
          className="buy-page__control-button"
        >
          Filters
        </button>

        <button
          type="button"
          className="buy-page__control-button"
        >
          Sort
        </button>
      </section>

      <section className="buy-page__active-filters">
        {/* Active filter tags */}
      </section>

      <section className="buy-page__content">
        <section className="buy-page__properties">
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

        <aside className="buy-page__map">
          {/* Map will be added later */}
        </aside>
      </section>

      <section className="buy-page__pagination">
        {/* Load More / Pagination */}
      </section>

    </main>
  );
}

export default Buy;