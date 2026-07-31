import "./PropertySort.css";

function PropertySort() {
  return (
    <select className="property-sort">
      <option>Newest</option>
      <option>Price: Low to High</option>
      <option>Price: High to Low</option>
    </select>
  );
}

export default PropertySort;