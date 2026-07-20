import './Header.css'
import { Link } from "react-router-dom";

function Header() {
  return (

    <header className="site-header">
      <div className="container">
        <Link to="/" className="site-logo">
          HomeFinder
        </Link>

        <nav className="header-nav">
          <ul className="header-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/buy">Buy</Link></li>
            <li><Link to="/rent">Rent</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header