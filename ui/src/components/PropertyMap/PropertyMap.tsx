import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
                        >
                            <Popup>
                                <div className="property-popup">
                                    <img
                                        className="property-popup__image"
                                        src={property.imageUrl}
                                        alt={property.address}
                                    />
                                    <div className="property-popup__content">
                                        <p className="property-popup__address">
                                            {property.address}, {property.city}
                                        </p>
                                        <p className="property-popup__details">
                                            {property.type} | {property.area} |{" "}
                                            {property.price}
                                        </p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
                <MapResizeHandler />
            </MapContainer>
        </aside>
    );
}

export default PropertyMap;
