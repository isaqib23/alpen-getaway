import React from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import RevealImage from "./animations/RevealImage";
import TextAnime from "./animations/TextAnime";
import { useMediaQuery } from "react-responsive";

import { strings } from "../lang/why-choose-us";
import iconWhyChoose1 from "@assets/images/icons/icon-why-choose-1.svg";
import iconWhyChoose2 from "@assets/images/icons/icon-why-choose-2.svg";
import iconWhyChoose3 from "@assets/images/icons/icon-why-choose-3.svg";
import iconWhyChoose4 from "@assets/images/icons/icon-why-choose-4.svg";

const HomeWhyChooseUs: React.FC = () => {
  const isLaptop = useMediaQuery({ query: "(min-width: 992px)" });

  // Intersection Observer for the title
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Array of "Why Choose Us" items
  const whyChooseItems = [
    {
      icon: iconWhyChoose1,
      title: strings.FLEET,
      description: strings.FLEET_DESCRIPTION,
    },
    {
      icon: iconWhyChoose2,
      title: strings.CUSTOMER_SERVICE,
      description: strings.CUSTOMER_SERVICE_DESCRIPTION,
    },
    {
      icon: iconWhyChoose3,
      title: strings.LOCATIONS,
      description: strings.LOCATIONS_DESCRIPTION,
    },
    {
      icon: iconWhyChoose4,
      title: strings.RELIALBILITY,
      description: strings.RELIALBILITY_DESCRIPTION,
    },
  ];

  return (
    <div className="why-choose-us">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            {/* Section Title Start */}
            <motion.div
              className="section-title"
              ref={titleRef}
              initial={{ opacity: 0, y: 20 }}
              animate={
                titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6 }}
            >
              <h3>{strings.HEADING}</h3>
              <TextAnime className="text-anime-style-3" tag="h2">
                {strings.DESCRIPTION}
              </TextAnime>
            </motion.div>
            {/* Section Title End */}
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="row">
              {whyChooseItems.map((item, index) => {
                // Create individual useInView hook for each item
                const { ref: itemRef, inView: itemInView } = useInView({
                  triggerOnce: true,
                  threshold: 0.1,
                });

                return (
                  <div key={index} className="col-lg-3 col-md-6 col-sm-6">
                    <motion.div
                      className="why-choose-item why-choose-item-compact why-choose-item-vertical"
                      ref={itemRef}
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        itemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={
                        isLaptop
                          ? { duration: 0.6, delay: index * 0.15 }
                          : { duration: 0.6, delay: 0.1 }
                      }
                    >
                      <div className="icon-box">
                        <img src={item.icon} alt={item.title} />
                      </div>
                      <div className="why-choose-content">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeWhyChooseUs;
