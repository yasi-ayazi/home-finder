import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./PropertyMap.css";

import type { Property } from "../../types/property";

function MapResizeHandler() {
    const map = useMap();

    setTimeout(() => {
        map.invalidateSize();
    }, 0);

    return null;
}
type PropertyMapProps = {
    properties: Property[];
};

function PropertyMap({ properties }: PropertyMapProps) {
    return (
        <aside className="buy-page__map">
            <MapContainer center={[56.1, 10.5]} zoom={7}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {properties.map((property) => (
                    <Marker
                        key={property.id}
                        position={[property.latitude, property.longitude]}
                    />
                ))}
                <MapResizeHandler />
            </MapContainer>
        </aside>
    );
}

export default PropertyMap;
