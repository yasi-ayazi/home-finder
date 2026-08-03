import "./PropertySort.css";


type PropertySortProps = {
  sortBy: string;
  onSortChange: (value: string) => void;
};
function PropertySort({
  sortBy,
  onSortChange,
}: PropertySortProps) {
  return (
    <select
      className="property-sort"
      value={sortBy}
      onChange={(event) => onSortChange(event.target.value)}
    >
      <option value="newest">Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
    </select>
  );
}

export default PropertySort;