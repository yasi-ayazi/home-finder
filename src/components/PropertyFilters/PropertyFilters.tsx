import "./PropertyFilters.css";

type PropertyFiltersProps = {
  isOpen: boolean;
  onToggle: () => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
};

function PropertyFilters({
  isOpen,
  onToggle,
  selectedTypes,
  onTypesChange,
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
        </div>
      )}

    </div>
  );
}

export default PropertyFilters;