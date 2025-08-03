import React from "react";
import { Link } from "react-router-dom";
import { Plane, UserCheck, Car, Crown, ArrowRight } from "lucide-react";

import "../../assets/css/home-services.css";

import { strings } from "../../lang/services";

const services = [
  {
    icon: <Plane size={32} />,
    title: strings.AIRPORT,
    description: strings.AIRPORT_DESCRIPTION,
  },
  {
    icon: <UserCheck size={32} />,
    title: strings.DRIVER,
    description: strings.DRIVER_DESCRIPTION,
  },
  {
    icon: <Car size={32} />,
    title: strings.RENTAL,
    description: strings.RENTAL_DESCRIPTION,
  },
  {
    icon: <Crown size={32} />,
    title: strings.CHAUFFEUR,
    description: strings.CHAUFFEUR_DESCRIPTION,
  },
];

const HomeServices: React.FC = () => {
  return (
    <div className="our-services">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            <div className="section-title">
              <h3>{strings.HEADING}</h3>
              <h2>{strings.DESCRIPTION}</h2>
            </div>
          </div>
        </div>

        <div className="row">
          {services.map((service, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
              <div className="service-item">
                <div className="icon-box">
                  {service.icon}
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <div className="service-footer">
                  <Link to="/service-details" className="section-icon-btn">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-12">
          <div className="services-box-footer">
            <p>{strings.FOOTER}</p>
            <Link to="#" className="btn-default">
              {strings.BUTTON}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeServices;
