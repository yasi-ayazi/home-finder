import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./PropertyMap.css";

function PropertyMap() {
  return (
    <aside className="buy-page__map">
      <MapContainer center={[56.2639, 9.5018]} zoom={7}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </aside>
  );
}

export default PropertyMap;