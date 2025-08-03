import React from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

import { useMediaQuery } from "react-responsive";

import "../assets/css/home-services.css"; // Ensure you have a CSS file for styles
import { Link } from "react-router-dom";

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
                      src={`/assets/images/icons/${service.icon}`}
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
                        src="/assets/images/icons/arrow-white.svg"
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
