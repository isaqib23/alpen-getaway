import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../assets/css/fleet-single-content.css"; // Update the path to your CSS file
import TextAnime from "./animations/TextAnime";

import * as bookcarsTypes from "../types/bookcars-types";
import * as helper from "../common/helper";
import * as bookcarsHelper from "../utils/bookcars-helper";
import env from "../config/env.config";

import { strings } from "../lang/fleets-single-content";
import { strings as carStrings } from "../lang/cars";

interface FleetsSingleContentProps {
  car: bookcarsTypes.Car;
  days: number;
  language: string;
  clientSecret: string | null;
  onCancellationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAmendmentsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTheftProtectionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCollisionDamageWaiverChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onFullInsuranceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdditionalDriverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Dummy data for sliders, benefits, amenities, and rental conditions
const sliderImages = [
  "/img/our_fleet/Transperent Car Images/e_class.png",
  "/img/our_fleet/Transperent Car Images/s_class.png",
  "/img/our_fleet/Transperent Car Images/v_class.png",
  "/img/our_fleet/Transperent Car Images/vito.png",
];

const rentalConditions = [
  {
    title: strings.LICENSE,
    content: strings.CONTENT,
  },
  {
    title: strings.INSURANCE,
    content: strings.CONTENT,
  },
  {
    title: strings.METHODS,
    content: strings.CONTENT,
  },
  {
    title: strings.MODIFICATION,
    content: strings.CONTENT,
  },
  {
    title: strings.SMOKING,
    content: strings.CONTENT,
  },
  {
    title: strings.AGE,
    content: strings.CONTENT,
  },
];

const FleetSingleContent: React.FC<FleetsSingleContentProps> = ({
  car,
  language,
  days,
  clientSecret,
  onCancellationChange,
  onAmendmentsChange,
  onAdditionalDriverChange,
  onCollisionDamageWaiverChange,
  onFullInsuranceChange,
  onTheftProtectionChange,
}) => {
  // In-view hooks for sections
  const { ref: sliderRef, inView: sliderInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: infoRef, inView: infoInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: amenitiesRef, inView: amenitiesInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: conditionsRef, inView: conditionsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const amenities = [
    {
      label: carStrings.CANCELLATION,
      onChange: onCancellationChange,
      helper: car && helper.getCancellationOption(car.cancellation, language),
      included:
        car.cancellation === -1 || car.cancellation === 0 || !!clientSecret
          ? true
          : false,
    },
    {
      label: carStrings.AMENDMENTS,
      onChange: onAmendmentsChange,
      helper: car && helper.getAmendmentsOption(car.amendments, language),
      included:
        car.amendments === -1 || car.amendments === 0 || !!clientSecret
          ? true
          : false,
    },
    {
      label: carStrings.COLLISION_DAMAGE_WAVER,
      onChange: onCollisionDamageWaiverChange,
      helper:
        car &&
        helper.getCollisionDamageWaiverOption(
          car.collisionDamageWaiver,
          days,
          language
        ),
      included:
        car.collisionDamageWaiver === -1 ||
        car.collisionDamageWaiver === 0 ||
        !!clientSecret
          ? true
          : false,
    },
    {
      label: carStrings.THEFT_PROTECTION,
      onChange: onTheftProtectionChange,
      helper:
        car &&
        helper.getTheftProtectionOption(car.theftProtection, days, language),
      included:
        car.theftProtection === -1 ||
        car.theftProtection === 0 ||
        !!clientSecret
          ? true
          : false,
    },
    {
      label: carStrings.FULL_INSURANCE,
      onChange: onFullInsuranceChange,
      helper:
        car && helper.getFullInsuranceOption(car.fullInsurance, days, language),
      included:
        car.fullInsurance === -1 || car.fullInsurance === 0 || !!clientSecret
          ? true
          : false,
    },
    {
      label: carStrings.ADDITIONAL_DRIVER,
      onChange: onAdditionalDriverChange,
      helper:
        car &&
        helper.getAdditionalDriverOption(car.additionalDriver, days, language),
      included: car.additionalDriver === -1 || !!clientSecret ? true : false,
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const benefits = [
    {
      icon: "/img/icons/icon-fleets-benefits-1.svg",
      title: strings.MILEAGE,
      description: strings.MILEAGE_DESCRIPTION,
    },
    {
      icon: "/img/icons/icon-fleets-benefits-2.svg",
      title: strings.FUEL_POLICY,
      description:
        car?.fuelPolicy === "likeForlike"
          ? strings.LIKE_FOR_LIKE
          : strings.FREE_TANK,
    },
  ];

  return (
    <div className="fleets-single-content">
      {/* Feets Single Slider */}
      <motion.div
        className="fleets-single-slider"
        ref={sliderRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: sliderInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          effect="slide"
          speed={1500}
          autoplay={{ delay: 4000 }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
        >
          {sliderImages.map((_, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fleets-slider-image"
              >
                <figure className="image-anime">
                  <img
                    src={bookcarsHelper.joinURL(env.CDN_CARS, car.image)}
                    alt={`Slide ${index + 1}`}
                  />
                </figure>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination"></div>
      </motion.div>

      {/* Feets Benefits */}
      <motion.div
        className="fleets-benefits"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {benefits.map((benefit, index) => {
          const { ref: benefitRef, inView: benefitInView } = useInView({
            triggerOnce: true,
            threshold: 0.1,
          });

          return (
            <motion.div
              className="fleets-benefits-item"
              key={index}
              ref={benefitRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: benefitInView ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="icon-box">
                <img src={benefit.icon} alt={`Benefit ${index + 1}`} />
              </div>
              <div className="fleets-benefits-content">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Feets Information */}
      <motion.div
        className="fleets-information"
        ref={infoRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: infoInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-title">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={infoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {strings.INFO_HEADING}
          </motion.h3>
          <h2>
            <TextAnime className="text-anime-style-3" tag="h2">
              {strings.INFO_DESCRIPTION}
            </TextAnime>
          </h2>
          <p>{strings.INFO_PARAGRAPH}</p>
        </div>
        <div className="fleets-information-list">
          <ul>
            <li>{strings.ASSISTANCE}</li>
            <li>{strings.CANCELLATION}</li>
            <li>{strings.RENT}</li>
          </ul>
        </div>
      </motion.div>

      {/* Feets Amenities */}
      <motion.div
        className="fleets-amenities"
        ref={amenitiesRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: amenitiesInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-title">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={
              amenitiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5 }}
          >
            {strings.AMENITIES_HEADING}
          </motion.h3>
          <TextAnime className="text-anime-style-3" tag="h2">
            {strings.AMENITIES_DESCRIPTION}
          </TextAnime>
        </div>
        <div className="fleets-amenities-list">
          <ul>
            {car &&
              amenities.map((amenity, index) => {
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <label
                      className={`form-check-label switch ${
                        amenity.included && "included"
                      }`}
                      htmlFor={`checkbox${index}`}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        disabled={amenity.included}
                        defaultChecked={amenity.included}
                        onChange={
                          amenity.onChange ? amenity.onChange : () => {}
                        }
                        id={`checkbox${index}`}
                      />
                      <span className="slider"></span>
                    </label>
                    <span>
                      <span>{` ${amenity.label}`}</span>
                      <span className="text-muted fs-6 m-2">
                        {amenity.included
                          ? strings.INCLUDED
                          : `✚ ${amenity.helper?.slice(1)}`}
                      </span>
                    </span>
                  </motion.li>
                );
              })}
          </ul>
        </div>
      </motion.div>

      {/* Rental Conditions Faqs */}
      <motion.div
        className="rental-conditions-faqs"
        ref={conditionsRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: conditionsInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-title">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={
              conditionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5 }}
          >
            {strings.RENTAL_CONDITIONS}
          </motion.h3>
          <h2>
            <TextAnime className="text-anime-style-3" tag="h2">
              {strings.POLICIES}
            </TextAnime>
          </h2>
        </div>
        <div className="rental-condition-accordion" id="rentalaccordion">
          {rentalConditions.map((condition, index) => {
            const { ref: conditionRef, inView: conditionInView } = useInView({
              triggerOnce: true,
              threshold: 0.1,
            });

            return (
              <div className="accordion-item" key={index} ref={conditionRef}>
                <motion.h2
                  className="accordion-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: conditionInView ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <button
                    className={`accordion-button ${
                      index === openIndex ? "" : "collapsed"
                    }`}
                    type="button"
                    data-bs-toggle={"collapse"}
                    data-bs-target={`#rentalcollapse${index + 1}`}
                    aria-expanded={index === openIndex}
                    aria-controls={`rentalcollapse${index + 1}`}
                    onClick={() =>
                      setOpenIndex(index === openIndex ? -1 : index)
                    }
                  >
                    {condition.title}
                  </button>
                </motion.h2>
                <div
                  id={`rentalcollapse${index + 1}`}
                  className={`accordion-collapse collapse ${
                    index === openIndex ? "show" : ""
                  }`}
                  aria-labelledby={`rentalheading${index + 1}`}
                  data-bs-parent="#rentalaccordion"
                >
                  <div className="accordion-body">
                    <p>{condition.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default FleetSingleContent;
