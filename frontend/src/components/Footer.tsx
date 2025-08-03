import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/footer.css"; // Assuming you have some styles for the footer

import { strings } from "../lang/footer";

const Footer: React.FC = () => {
  return (
    <footer className="main-footer bg-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            {/* About Footer Start */}
            <div className="about-footer">
              {/* Footer Logo Start */}
              <div className="footer-logo">
                <img
                  src="/assets/images/logo_black.png"
                  alt="Novaride Logo"
                />
              </div>
              {/* Footer Logo End */}

              {/* About Footer Content Start */}
              <div className="about-footer-content">
                <p>{strings.EASE}</p>
              </div>
              {/* About Footer Content End */}
            </div>
            {/* About Footer End */}
          </div>

          <div className="col-lg-3 col-md-4">
            {/* Footer Quick Links Start */}
            <div className="footer-links footer-quick-links">
              <h3>{strings.LEGAL}</h3>
              <ul>
                <li>
                  <Link to="#">{strings.TERMS}</Link>
                </li>
                <li>
                  <Link to="#">{strings.PRIVACY}</Link>
                </li>
                <li>
                  <Link to="#">{strings.LEGAL_NOTICE}</Link>
                </li>
                <li>
                  <Link to="#">{strings.ACCESSIBILITY}</Link>
                </li>
              </ul>
            </div>
            {/* Footer Quick Links End */}
          </div>

          <div className="col-lg-3 col-md-4">
            {/* Footer Menu Start */}
            <div className="footer-links footer-menu">
              <h3>{strings.QUICK}</h3>
              <ul>
                <li>
                  <Link to="/">{strings.HOME}</Link>
                </li>
                <li>
                  <Link to="/about">{strings.ABOUT}</Link>
                </li>
                <li>
                  <Link to="/cars">{strings.CARS}</Link>
                </li>
                <li>
                  <Link to="/services">{strings.SERVICES}</Link>
                </li>
              </ul>
            </div>
            {/* Footer Menu End */}
          </div>

          <div className="col-lg-3 col-md-4">
            {/* Footer Newsletter Start */}
            <div className="footer-newsletter">
              <h3>{strings.SUBSCRIBE}</h3>
              {/* Footer Newsletter Form Start */}
              <div className="footer-newsletter-form">
                <form id="newslettersForm" action="#" method="POST">
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="mail"
                      placeholder="Email ..."
                      required
                    />
                    <button type="submit" className="section-icon-btn">
                      <img
                        src="/assets/images/icons/arrow-white.svg"
                        alt="Submit"
                      />
                    </button>
                  </div>
                </form>
              </div>
              {/* Footer Newsletter Form End */}
            </div>
            {/* Footer Newsletter End */}
          </div>
        </div>

        {/* Footer Copyright Section Start */}
        <div className="footer-copyright">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-7">
              {/* Footer Copyright Start */}
              <div className="footer-copyright-text">
                <p>{strings.COPYRIGHT}</p>
              </div>
              {/* Footer Copyright End */}
            </div>

            <div className="col-lg-6 col-md-5">
              {/* Footer Social Link Start */}
              <div className="footer-social-links">
                <ul>
                  <li>
                    <Link to="#">
                      <i className="fa-brands fa-youtube"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="fa-brands fa-facebook-f"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="fa-brands fa-x-twitter"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Footer Social Link End */}
            </div>
          </div>
        </div>
        {/* Footer Copyright Section End */}
      </div>
    </footer>
  );
};

export default Footer;
