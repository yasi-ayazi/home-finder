import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer__container">

                <div className="footer__brand">
                    <h2 className="footer__logo">
                        HomeFinder
                    </h2>

                    <p className="footer__text">
                        Find your next home across Denmark.
                    </p>
                    <div className="footer__social">

                    </div>
                </div>

                <div className="footer__links">
                    <h3>Quick Links</h3>

                    <a href="#">Buy</a>
                    <a href="#">Rent</a>
                    <a href="#">Sell</a>
                    <a href="#">Contact</a>
                </div>

                <div className="footer__guides">
                    <h3>Guides</h3>

                    <a href="#">Buying Guide</a>
                    <a href="#">Selling Guide</a>
                    <a href="#">FAQ</a>
                    <a href="#">Mortgage Calculator</a>
                </div>

                <div className="footer__contact">
                    <h3>Contact</h3>

                    <p>hello@homefinder.dk</p>
                    <p>+45 12 34 56 78</p>
                </div>

            </div>

            <div className="footer__bottom">
                © 2026 HomeFinder. All rights reserved.
            </div>

        </footer>
    );
}

export default Footer;