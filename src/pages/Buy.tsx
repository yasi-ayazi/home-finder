import { useEffect, useState } from "react";
import "./Buy.css";
import SearchBox from "../components/SearchBox/SearchBox";
import PropertyList from "../components/PropertyList/PropertyList";
import PropertyMap from "../components/PropertyMap/PropertyMap";
import PropertyFilters from "../components/PropertyFilters/PropertyFilters";
import PropertySort from "../components/PropertySort/PropertySort";
import { properties } from "../data/properties";

function getNumericPrice(price: string) {
  return Number(price.replace(/[^\d]/g, ""));
}

function Buy() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  useEffect(() => { setVisibleCount(4); }, [query, selectedTypes, minPrice, maxPrice]);

  function handleSearch() {
  }

  function handleLoadMore() {
    setVisibleCount((prev) => prev + 4);
  }

  function handleRemoveType(type: string) {
    setSelectedTypes(
      selectedTypes.filter(
        (selectedType) => selectedType !== type
      )
    );
  }

  // Filter properties by search, property type, and price
  const q = query.trim().toLowerCase(); // q is a part of the query for example city like "cope"

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.city.toLowerCase().includes(q) ||
      property.address.toLowerCase().includes(q) ||
      property.type.toLowerCase().includes(q);

    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.includes(property.type);

    const propertyPrice = getNumericPrice(property.price);

    const matchesPrice =
      (minPrice === "" || propertyPrice >= Number(minPrice)) &&
      (maxPrice === "" || propertyPrice <= Number(maxPrice));

    return matchesSearch && matchesType && matchesPrice;
  });
  // Sorting
  const sortedProperties = [...filteredProperties];
  if (sortBy === "newest") {
    sortedProperties.sort((a, b) => b.id - a.id);
  }
  if (sortBy === "price-low") {
    sortedProperties.sort((a, b) =>
      getNumericPrice(a.price) - getNumericPrice(b.price)
    );
  }

  if (sortBy === "price-high") {
    sortedProperties.sort((a, b) =>
      getNumericPrice(b.price) - getNumericPrice(a.price)
    );
  }

  const visibleProperties = sortedProperties.slice(0, visibleCount);

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

      <div className="buy-page__main">
        <section className="buy-page__controls">
          <PropertyFilters
            isOpen={isFiltersOpen}
            onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
          />
          <PropertySort
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </section>

        <section className="buy-page__active-filters">
          {selectedTypes.map((selectedType) => (
            <button
              key={selectedType}
              onClick={() => handleRemoveType(selectedType)}
              className="buy-page__filter-tag">
              <span>×</span>
              {selectedType}
            </button>
          ))}
        </section>

        <section className="buy-page__content">
          <PropertyList properties={visibleProperties} />
          <PropertyMap />
        </section>
      </div>

      <section className="buy-page__pagination">
        {visibleCount < sortedProperties.length && (
          <button onClick={handleLoadMore} className="buy-page__load-more">
            Load More
          </button>
        )}
      </section>


    </main >
  );
}

export default Buy;