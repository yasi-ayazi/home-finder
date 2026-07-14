import "./Services.css";
import ServiceCard from "../ServiceCard/ServiceCard";

const services = [
  {
    id: 1,
    title: "Find Your Dream Home",
    description: "Browse thousands of homes across Denmark.",
  },
  {
    id: 2,
    title: "Fast Search",
    description: "Find the right property in just a few clicks.",
  },
  {
    id: 3,
    title: "Save Favorites",
    description: "Keep track of the homes you love.",
  },
];

function Services() {
  return (
    <section className="services">
      <h2 className="services__title">
        Our Services
      </h2>

      <p className="services__description">
        Everything you need to find your next home in one place.
      </p>

      <div className="services__cards">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
}

export default Services;