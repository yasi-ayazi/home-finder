import "./PropertyFilters.css";

type PropertyFiltersProps = {
  isOpen: boolean;
  onToggle: () => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
};

function PropertyFilters({
  isOpen,
  onToggle,
  selectedTypes,
  onTypesChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange
}: PropertyFiltersProps) {

  function handleTypeChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const type = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      onTypesChange([...selectedTypes, type]);
    } else {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    }
  }

  return (
    <div className="property-filters-wrapper">

      <button
        type="button"
        className="property-filters"
        onClick={onToggle}
      >
        <span>Filters</span>
        <span className="property-filters__arrow">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="property-filters__panel">
          <div className="property-filters__group">
            <h3 className="property-filters__title">Property Type</h3>
            <label>
              <input
                type="checkbox"
                value="Villa"
                checked={selectedTypes.includes("Villa")}
                onChange={handleTypeChange}
              />
              Villa
            </label>
            <label>
              <input
                type="checkbox"
                value="Apartment"
                checked={selectedTypes.includes("Apartment")}
                onChange={handleTypeChange}
              />
              Apartment
            </label>
            <label>
              <input
                type="checkbox"
                value="Townhouse"
                checked={selectedTypes.includes("Townhouse")}
                onChange={handleTypeChange}
              />
              Townhouse
            </label>
          </div>

          <div className="property-filters__group">
            <h3 className="property-filters__title">Price Range</h3>
            <div className="property-filters__price-inputs">
              <label>
                Min Price
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => onMinPriceChange(e.target.value)}
                />
              </label>
              <label>
                Max Price
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PropertyFilters;