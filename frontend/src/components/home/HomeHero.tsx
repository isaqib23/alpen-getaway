import React from "react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import TextAnime from "../animations/TextAnime";

import "../../assets/css/home-hero.css"; // Import your CSS file
import HomeRentDetailsForm from "./HomeRentDetailsForm";
import { strings } from "../../lang/home-hero";

interface HeroHomeProps {
  language: string;
}

const HeroHome: React.FC<HeroHomeProps> = ({ language }) => {
  const { ref: upperRef, inView: upperView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const heroContent = (
    <>
      <div className="section-title">
        <motion.h3
          ref={upperRef}
          initial={{ opacity: 0, y: 30 }}
          animate={upperView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {strings.WELCOME}
        </motion.h3>
        <TextAnime className="text-anime-style-3" tag="h1">
          {strings.HEADING}
        </TextAnime>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={upperView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          {strings.PARAGRAPH}
        </motion.p>
      </div>

      <motion.div
        className="hero-content-body"
        initial={{ opacity: 0, y: 30 }}
        animate={upperView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Link to="/booking-management" className="btn-default">
          {strings.BOOK}
        </Link>
        <Link to="/affiliate" className="btn-default btn-highlighted">
          {strings.LEARN}
        </Link>
      </motion.div>
    </>
  );

  return (
    <div className="hero">
      <div className="hero-section bg-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="hero-content">
                {/* Hero Content Starts */}
                {heroContent}
                {/* Hero Content Ends */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rent Details Section Start */}
      <HomeRentDetailsForm language={language} />
      {/* Rent Details Section Ends */}
    </div>
  );
};

export default HeroHome;
