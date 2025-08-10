import React from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { strings } from "../../lang/cta";

const HomeCTA: React.FC = () => {
  return (
    <section className="home-cta-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="cta-content">
              <h2>{strings.HEADING}</h2>
              <p>{strings.DESCRIPTION}</p>
              <Link to="/contact" className="btn-cta">
                <Phone size={20} />
                {strings.CONTACT}
              </Link>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="cta-image">
              <img src="/img/our_fleet/transparent_car_images/s_class.png" alt="Luxury Car" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
