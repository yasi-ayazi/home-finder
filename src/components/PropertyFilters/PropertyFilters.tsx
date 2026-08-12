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
        Filters {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <div className="property-filters__panel">
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
      )}

    </div>
  );
}

export default PropertyFilters;