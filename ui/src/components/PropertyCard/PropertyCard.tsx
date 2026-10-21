import { Link } from "react-router-dom";
import "./PropertyCard.css";
import "./PropertyCard.css";

type PropertyCardProps = {
    id: number;
    imageUrl: string;

    price: string;
    address: string;
    city: string;

    type: string;

    bedrooms: number;
    bathrooms: number;
    area: string;

    badges: string[];
};

function PropertyCard({
    id,
    imageUrl,
    price,
    address,
    city,
    type,
    area,
    badges,
}: PropertyCardProps) {
    return (
        <Link to={`/property/${id}`} className="property-card__link">
            <article className="property-card">
                <img
                    className="property-card__image"
                    src={imageUrl}
                    alt={address}
                />

                <div className="property-card__content">
                    <div className="property-card__badges">
                        {badges.map((badge) => (
                            <span key={badge} className="property-card__badge">
                                {badge}
                            </span>
                        ))}
                    </div>

                    <p className="property-card__address">
                        {address}, {city}
                    </p>

                    <p className="property-card__details">
                        {type} | {area} | {price}
                    </p>
                </div>
            </article>
        </Link>
    );
}

export default PropertyCard;
