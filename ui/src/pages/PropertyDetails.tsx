import { useParams } from "react-router-dom";
import "./PropertyDetails.css";

function PropertyDetails() {
    const { id } = useParams();

    return (
        <main>
            <h1>Property Details</h1>
            <p>Property ID: {id}</p>
        </main>
    );
}
export default PropertyDetails;