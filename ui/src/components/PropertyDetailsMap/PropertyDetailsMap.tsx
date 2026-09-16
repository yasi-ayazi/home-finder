import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./PropertyDetailsMap.css";

type PropertyDetailsMapProps = {
    latitude: number;
    longitude: number;
};

function PropertyDetailsMap({
    latitude,
    longitude,
}: PropertyDetailsMapProps) {
    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            className="property-details-map"
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[latitude, longitude]} />
        </MapContainer>
    );
}

export default PropertyDetailsMap;