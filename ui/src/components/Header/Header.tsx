import { useEffect, useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        const updateHeaderState = () => {
            setIsScrolled(window.scrollY > 80);

            if (window.innerWidth > 1024) {
                setIsMenuOpen(false);
            }
        };

        updateHeaderState();

        window.addEventListener("scroll", updateHeaderState, { passive: true });
        window.addEventListener("resize", updateHeaderState);

        return () => {
            window.removeEventListener("scroll", updateHeaderState);
            window.removeEventListener("resize", updateHeaderState);
        };
    }, []);
    return (
        <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
            <div className="container">
                <Link to="/" className="site-logo">
                    HomeFinder
                </Link>
                <button
                    type="button"
                    className="menu-toggle"
                    onClick={() => setIsMenuOpen((current) => !current)}
                    aria-expanded={isMenuOpen}
                    aria-controls="header-navigation"
                >
                    ☰ Menu
                </button>

                <nav
                    id="header-navigation"
                    className={`header-nav ${isMenuOpen ? "is-open" : ""}`}
                >
                    <ul className="header-menu">
                        <li>
                            <Link to="/" onClick={closeMenu}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/buy" onClick={closeMenu}>
                                Buy
                            </Link>
                        </li>
                        <li>
                            <Link to="/rent" onClick={closeMenu}>
                                Rent
                            </Link>
                        </li>
                        <li>
                            <Link to="/favorites" onClick={closeMenu}>
                                Favorites
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" onClick={closeMenu}>
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
