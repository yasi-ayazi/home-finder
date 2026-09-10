import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProperty } from "../api/properties";
import type { Property } from "../types/property";
import "./PropertyDetails.css";


function PropertyDetails() {
    const { id } = useParams();

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
    async function loadProperty() {
        if (!id) {
            return;
        }
        try {
            const data = await fetchProperty(id);
            setProperty(data);
            setError("");
        } catch {
            setError("Failed to load property");
        } finally {
            setLoading(false);
        }
    }
    loadProperty();
}, [id]);

    return (
    <main>
        <h1>Property Details</h1>

        {loading && <p>Loading...</p>}

        {error && <p>{error}</p>}

        {property && (
            <>
                <p>{property.address}</p>
                <p>{property.city}</p>
                <p>{property.price}</p>
                <img src={property.imageUrl} alt={property.address} />
            </>
        )}
    </main>
);
}
export default PropertyDetails;