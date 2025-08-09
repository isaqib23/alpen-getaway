import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Parallax } from "react-parallax";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import TextAnime from "./animations/TextAnime";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../assets/css/home-hero.css"; // Import your CSS file
import HomeRentDetailsForm from "./home/HomeRentDetailsForm";
import { strings } from "../lang/affiliate";

interface HeroHomeProps {
  type: string; // or another appropriate type if 'type' can be something else
  language: string;
}

const AffiliateHero: React.FC<HeroHomeProps> = ({ type, language }) => {
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
    </>
  );

  // Function to render the appropriate section based on the prop value
  const renderHeroSection = () => {
    switch (type) {
      case "video":
        return (
          <div className="hero">
            <div className="hero-section bg-section hero-video">
              <div className="hero-bg-video">
                <video autoPlay muted loop id="myVideo">
                  <source
                    src="https://demo.awaikenthemes.com/assets/videos/novaride-video.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="container">
                {/* Content goes here */}
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <div className="hero-content">
                      {" "}
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

      case "slider":
        return (
          <div className="hero hero-slider">
            <div
              className="hero-section bg-section hero-slider-layout"
              ref={upperRef}
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay, A11y]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                effect="slide"
                speed={1000}
                autoplay={{ delay: 4000 }}
                pagination={{
                  el: ".hero-pagination",
                  clickable: true,
                }}
                onSlideChange={() => {}}
              >
                <SwiperSlide>
                  <div className="hero-slide">
                    <div className="container">
                      <div className="row align-items-center">
                        <div className="col-lg-12">
                          <div className="hero-content" ref={upperRef}>
                            {/* Hero Content Starts */}
                            {heroContent}
                            {/* Hero Content Ends */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="hero-slide">
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
                </SwiperSlide>
                <SwiperSlide>
                  <div className="hero-slide">
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
                </SwiperSlide>
                <div className="swiper-pagination hero-pagination"></div>
              </Swiper>
            </div>

            {/* Rent Details Section Start */}
            <HomeRentDetailsForm language={language} />
            {/* Rent Details Section Ends */}
          </div>
        );

      case "image":
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

      default:
        return null;
    }
  };

  return renderHeroSection();
};

AffiliateHero.propTypes = {
  type: PropTypes.oneOf(["video", "slider", "image"]).isRequired,
};

export default AffiliateHero;
