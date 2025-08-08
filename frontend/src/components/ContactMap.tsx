import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "../assets/css/contact-map.css"; // Ensure you have a CSS file for styles
import TextAnime from "./animations/TextAnime";

import { strings } from "../lang/contact-page";

const ContactMap: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  return (
    <div className="google-map" ref={ref}>
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            {/* Section Title Start */}
            <div className="section-title" ref={ref}>
              {inView && (
                <motion.h3
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {strings.MAP_HEADING}
                </motion.h3>
              )}
              <TextAnime className="text-anime-style-3" tag="h2">
                {strings.MAP_DESCRIPTION}
              </TextAnime>
            </div>
            {/* Section Title End */}
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            {/* Google Map Iframe Start */}
            <div className="google-map-iframe">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96737.10562045308!2d-74.08535042841811!3d40.739265258395164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1703158537552!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            {/* Google Map Iframe End */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;
