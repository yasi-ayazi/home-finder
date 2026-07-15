import "./PropertyCard.css";

type PropertyCardProps = {
    id: number;
    image: string;

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
    image,

    price,
    address,
    city,
    type,
    area,
    badges,
}: PropertyCardProps) {
    return (
        <article className="property-card">

            <img
                className="property-card__image"
                src={image}
                alt={address}
            />

            <div className="property-card__content">

                {/* Property badges */}
                <div className="property-card__badges">
                    {badges.map((badge) => (
                        <span
                            key={badge}
                            className="property-card__badge"
                        >
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
    );
}

export default PropertyCard;