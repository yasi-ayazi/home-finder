import "./PropertyFilters.css";

type PropertyFiltersProps = {
  isOpen: boolean;
  onToggle: () => void;
};

function PropertyFilters({
  isOpen,
  onToggle,
}: PropertyFiltersProps) {
  return (
    <button
      type="button"
      className="property-filters"
      onClick={onToggle}
    >
      Filters {isOpen ? "▲" : "▼"}
    </button>
  );
}

export default PropertyFilters;