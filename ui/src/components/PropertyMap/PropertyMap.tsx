import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "./PropertyMap.css";
import L from "leaflet";

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

const propertyIcon = L.divIcon({
    className: "property-marker",
    html: '<div class="property-marker__pin"></div>',
    iconSize: [36, 42],
    iconAnchor: [18, 42],
});

function PropertyMap({ properties }: PropertyMapProps) {
    return (
        <aside className="buy-page__map">
            <MapContainer center={[56.1, 10.5]} zoom={7}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MarkerClusterGroup>
                    {properties.map((property) => (
                        <Marker
                            key={property.id}
                            position={[property.latitude, property.longitude]}
                            icon={propertyIcon}
                        />
                    ))}
                </MarkerClusterGroup>
                <MapResizeHandler />
            </MapContainer>
        </aside>
    );
}

export default PropertyMap;
