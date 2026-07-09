import "./Hero.css";
import SearchPanel from "../SearchPanel/SearchPanel";

function Hero() {
    return (
        <section className="hero">
            <div className="hero__content">
                <SearchPanel />

            </div>
        </section>
    );
}

export default Hero;