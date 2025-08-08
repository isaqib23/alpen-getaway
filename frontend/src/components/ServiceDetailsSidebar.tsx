// ServiceDetailsSidebar.tsx
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "../assets/css/service-details-sidebar.css";
import { Link } from "react-router-dom";

import { strings } from "../lang/service-details";

const serviceLinks: ServiceLink[] = [
  {
    id: "airport-transfer",
    name: strings.AIRPORT_LINK,
    icon: "icon-service-3.svg",
  },
  {
    id: "economy-services",
    name: strings.ECONOMY_LINK,
    icon: "icon-about-trusted-2.svg",
  },
  {
    id: "business-transfers",
    name: strings.BUSINESS_LINK,
    icon: "icon-service-2.svg",
  },
  {
    id: "vip-transfer",
    name: strings.VIP_LINK,
    icon: "icon-service-1.svg",
  },
  {
    id: "private-transfer",
    name: strings.PRIVATE_LINK,
    icon: "icon-service-5.svg",
  },
  {
    id: "flexible-payment-options",
    name: strings.FLEXIBLE_LINK,
    icon: "icon-service-6.svg",
  },
  {
    id: "live-rides",
    name: strings.LIVE_LINK,
    icon: "icon-location.svg",
    iconStyle: {
      filter:
        "invert(95%) sepia(96%) saturate(2441%) hue-rotate(163deg) brightness(97%) contrast(101%)",
    },
  },
  {
    id: "roadside-assistance",
    name: strings.ROADSIE_LINK,
    icon: "icon-service-7.svg",
  },
  {
    id: "chauffeur-services",
    name: strings.CHAUFFEUR_LINK,
    icon: "icon-service-4.svg",
  },
];

type ServiceId =
  | "airport-transfer"
  | "economy-services"
  | "business-transfers"
  | "vip-transfer"
  | "private-transfer"
  | "flexible-payment-options"
  | "live-rides"
  | "roadside-assistance"
  | "chauffeur-services";

interface ServiceLink {
  id: ServiceId;
  name: string;
  icon: string;
  iconStyle?: React.CSSProperties;
}

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
            {serviceLinks.map((service) => (
              <li key={service.id}>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedService(service.id);
                  }}
                  className={selectedService === service.id ? "active" : ""}
                >
                  <img
                    src={`src/assets/images/${service.icon}`}
                    alt={service.name}
                    style={service.iconStyle || {}}
                  />
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
            <div className="icon-box">
              <img
                src="src/assets/images/icon-sidebar-cta.svg"
                alt="Contact Icon"
              />
            </div>
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
