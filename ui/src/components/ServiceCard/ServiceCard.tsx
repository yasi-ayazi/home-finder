import "./ServiceCard.css";

type ServiceCardProps = {
    title: string;
    description: string;
};

function ServiceCard({
    title,
    description,
}: ServiceCardProps) {
    return (
        <article className="service-card">

            <h3 className="service-card__title">
                {title}
            </h3>

            <p className="service-card__description">
                {description}
            </p>
            <a href="#" className="service-card__link">
                Explore →
            </a>
        </article>
    );
}

export default ServiceCard;