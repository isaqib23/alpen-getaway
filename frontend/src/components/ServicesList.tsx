import React from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

import { useMediaQuery } from "react-responsive";

import { Link } from "react-router-dom";
import arrowWhiteImg from "../assets/images/icons/arrow-white.svg";
import iconService1 from "../assets/images/icons/icon-service-1.svg";
import iconService2 from "../assets/images/icons/icon-service-2.svg";
import iconService3 from "../assets/images/icons/icon-service-3.svg";
import iconService4 from "../assets/images/icons/icon-service-4.svg";
import iconService5 from "../assets/images/icons/icon-service-5.svg";
import iconService6 from "../assets/images/icons/icon-service-6.svg";
import iconService7 from "../assets/images/icons/icon-service-7.svg";
import iconService8 from "../assets/images/icons/icon-service-8.svg";

// Create service icon mapping
const SERVICE_ICONS: Record<string, string> = {
  'icon-service-1.svg': iconService1,
  'icon-service-2.svg': iconService2,
  'icon-service-3.svg': iconService3,
  'icon-service-4.svg': iconService4,
  'icon-service-5.svg': iconService5,
  'icon-service-6.svg': iconService6,
  'icon-service-7.svg': iconService7,
  'icon-service-8.svg': iconService8,
};

const services = [
  {
    icon: "icon-service-1.svg",
    title: "Car Rental with Driver",
    description: "Enhance your rental experience with additional options.",
    delay: 0,
  },
  {
    icon: "icon-service-2.svg",
    title: "Business Car Rental",
    description: "Enhance your rental experience with additional options.",
    delay: 0.2,
  },
  {
    icon: "icon-service-3.svg",
    title: "Airport Transfer",
    description: "Enhance your rental experience with additional options.",
    delay: 0.4,
  },
  {
    icon: "icon-service-4.svg",
    title: "Chauffeur Services",
    description: "Enhance your rental experience with additional options.",
    delay: 0.6,
  },
  {
    icon: "icon-service-5.svg",
    title: "Private Transfer",
    description: "Enhance your rental experience with additional options.",
    delay: 0,
  },
  {
    icon: "icon-service-6.svg",
    title: "VIP Transfer",
    description: "Enhance your rental experience with additional options.",
    delay: 0.2,
  },
  {
    icon: "icon-service-7.svg",
    title: "Roadside Assistance",
    description: "Enhance your rental experience with additional options.",
    delay: 0.4,
  },
  {
    icon: "icon-service-8.svg",
    title: "Event Transportation",
    description: "Enhance your rental experience with additional options.",
    delay: 0.6,
  },
];

const ServicesList: React.FC = () => {
  const isDesktop = useMediaQuery({ query: "(min-width: 1025px)" });
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: isDesktop ? services[index].delay : 0.2, // Stagger delay
        duration: 0.4,
      },
    }),
  };

  return (
    <div className="page-services">
      <div className="container">
        <div className="row">
          {services.map((service, index) => {
            const { ref, inView } = useInView({
              triggerOnce: true,
              threshold: isDesktop ? 0.1 : 0.2,
            });

            return (
              <div className="col-lg-3 col-md-6" key={index} ref={ref}>
                {/* Service Item Start */}
                <motion.div
                  className="service-item"
                  variants={itemVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  custom={index}
                >
                  <div className="icon-box">
                    <img
                      src={SERVICE_ICONS[service.icon] || iconService1}
                      alt={service.title}
                    />
                  </div>
                  <div className="service-content">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                  <div className="service-footer">
                    <Link to="/service-details" className="section-icon-btn">
                      <img
                        src={arrowWhiteImg}
                        alt="Arrow"
                      />
                    </Link>
                  </div>
                </motion.div>
                {/* Service Item End */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesList;
