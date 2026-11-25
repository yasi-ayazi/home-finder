import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./PropertyDetailsMap.css";

type PropertyDetailsMapProps = {
    latitude: number;
    longitude: number;
};

function ResizeMap() {
    const map = useMap();

    useEffect(() => {
        const observer = new ResizeObserver(() => map.invalidateSize());
        observer.observe(map.getContainer());
        return () => observer.disconnect();
    }, [map]);

    return null;
}

function PropertyDetailsMap({ latitude, longitude }: PropertyDetailsMapProps) {
    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            className="property-details-map"
            trackResize={false}
        >
            <ResizeMap />
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[latitude, longitude]} />
        </MapContainer>
    );
}

export default PropertyDetailsMap;
