// ServiceDetailsSidebar.tsx
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "../assets/css/service-details-sidebar.css";
import { Link } from "react-router-dom";

import { strings } from "../lang/service-details";
import { serviceLinks, ServiceId } from "../config/services";

// Map service IDs to localized names
const getLocalizedServiceLinks = () => {
  return serviceLinks.map(service => ({
    ...service,
    name: getLocalizedServiceName(service.id)
  }));
};

const getLocalizedServiceName = (serviceId: ServiceId): string => {
  switch (serviceId) {
    case "airport-transfer":
      return strings.AIRPORT_LINK;
    case "economy-services":
      return strings.ECONOMY_LINK;
    case "business-transfers":
      return strings.BUSINESS_LINK;
    case "vip-transfer":
      return strings.VIP_LINK;
    case "private-transfer":
      return strings.PRIVATE_LINK;
    case "flexible-payment-options":
      return strings.FLEXIBLE_LINK;
    case "live-rides":
      return strings.LIVE_LINK;
    case "roadside-assistance":
      return strings.ROADSIE_LINK;
    case "chauffeur-services":
      return strings.CHAUFFEUR_LINK;
    default:
      return serviceId;
  }
};

interface ServiceDetailsSidebarProps {
  selectedService: ServiceId;
  setSelectedService: (service: ServiceId) => void;
}

const ServiceDetailsSidebar: React.FC<ServiceDetailsSidebarProps> = ({
  selectedService,
  setSelectedService,
}) => {
  const [ref1, inView1] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });
  const [ref2, inView2] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const localizedServiceLinks = getLocalizedServiceLinks();

  return (
    <div className="col-lg-4">
      {/* Service Sidebar Start */}
      <div className="service-sidebar">
        {/* Service Categories List Start */}
        <motion.div
          className="service-catagery-list"
          ref={ref1}
          initial={{ opacity: 0, y: 50 }}
          animate={inView1 ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
          }}
        >
          <h3>Our Services</h3>
          <ul>
            {localizedServiceLinks.map((service) => (
              <li key={service.id}>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedService(service.id);
                  }}
                  className={selectedService === service.id ? "active" : ""}
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
        {/* Service Categories List End */}

        {/* Sidebar CTA Start */}
        <motion.div
          className="sidebar-cta-box"
          ref={ref2}
          initial={{ opacity: 0, y: 50 }}
          animate={inView2 ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
          }}
        >
          {/* CTA Contact Item Start */}
          <div className="cta-contact-item">
            <div className="cta-contact-content">
              <h2>{strings.HELP}</h2>
              <p>{strings.EVERYTIME}</p>
            </div>
            <div className="cta-contact-btn">
              <Link to="/contact" className="btn-default">
                {strings.CONTACT}
              </Link>
            </div>
          </div>
          {/* CTA Contact Item End */}
        </motion.div>
        {/* Sidebar CTA End */}
      </div>
      {/* Service Sidebar End */}
    </div>
  );
};

export default ServiceDetailsSidebar;
