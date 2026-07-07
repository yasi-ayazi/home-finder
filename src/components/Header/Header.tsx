import './Header.css'

function Header() {
  return (

    <header className="site-header">
      <a href="/" className="site-logo">
        HomeFinder
      </a>
    
    <nav className="header-nav">
      <ul className="header-menu">
        <li><a href="/home">Home</a></li>
        <li><a href="/buy">Buy</a></li>
        <li><a href="/rent">Rent</a></li>
        <li><a href="/favorites">Favorites</a></li>
        <li><a href="/contact">Contact Us</a></li>
      </ul>
    </nav>
    </header>    
  )
}

export default Header