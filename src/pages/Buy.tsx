import { useState } from "react";
import "./Buy.css";
import SearchBox from "../components/SearchBox/SearchBox";
import PropertyList from "../components/PropertyList/PropertyList";
import PropertyMap from "../components/PropertyMap/PropertyMap";
import PropertyFilters from "../components/PropertyFilters/PropertyFilters";
import PropertySort from "../components/PropertySort/PropertySort";
import { properties } from "../data/properties";

function Buy() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  function handleSearch() {
  }

  // Filter properties by city + address + type
  const q = query.trim().toLowerCase(); // q is a part of the query for example city like "cope"

  const filteredProperties = properties.filter((property) =>
    property.city.toLowerCase().includes(q) ||
    property.address.toLowerCase().includes(q) ||
    property.type.toLowerCase().includes(q)
  );
  // Sortting
  const sortedProperties = [...filteredProperties]
  if (sortBy === "newest") {
    sortedProperties.sort((a, b) => b.id - a.id);
  }
  if (sortBy === "price-low") {
    sortedProperties.sort((a, b) =>
      Number(a.price.replace(/[^\d]/g, "")) -
      Number(b.price.replace(/[^\d]/g, ""))
    );
  }

  if (sortBy === "price-high") {
    sortedProperties.sort((a, b) =>
      Number(b.price.replace(/[^\d]/g, "")) -
      Number(a.price.replace(/[^\d]/g, ""))
    );
  }

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
        <PropertyFilters
          isOpen={isFiltersOpen}
          onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
        />
        <PropertySort
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </section>

      <section className="buy-page__active-filters">
        {/* Active filter tags */}
      </section>

      <section className="buy-page__content">
        <PropertyList properties={sortedProperties} />
        <PropertyMap />
      </section>

      <section className="buy-page__pagination">
        {/* Load More / Pagination */}
      </section>


    </main >
  );
}

export default Buy;