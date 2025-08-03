// ServiceDetailsContent.tsx
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";
import "../assets/css/service-details-content.css";
import RevealImage from "./animations/RevealImage";
import TextAnime from "./animations/TextAnime";
import { Link } from "react-router-dom";

interface ServiceDetailsContentProps {
  serviceData: {
    title: string;
    paragraphs: string[];
  };
}

const ServiceDetailsContent: React.FC<ServiceDetailsContentProps> = ({
  serviceData,
}) => {
  const isLaptop = useMediaQuery({ query: "(min-width: 992px)" });
  const [ref1, inView1] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ref2, inView2] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ref3, inView3] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ref4, inView4] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ref5, inView5] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="col-lg-8">
      {/* Service Single Content Start */}
      <div className="service-single-content h-100">
        {/* Service Featured Image Start */}
        <div className="service-featured-image">
          <RevealImage
            className="image-anime"
            src="/assets/images/our_service_details/airport_transfer/1.png"
            alt="Service Featured"
          ></RevealImage>
        </div>
        {/* Service Featured Image End */}

        {/* Service Entry Content Start */}
        <div className="service-entry">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={inView1 ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
            }}
            data-cursor="-opaque"
          >
            {serviceData.title}
          </motion.h2>

          {serviceData.paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              ref={index === 0 ? ref1 : index === 1 ? ref2 : ref3}
              initial={{ opacity: 0, y: 50 }}
              animate={
                (index === 0 && inView1) ||
                (index === 1 && inView2) ||
                (index === 2 && inView3)
                  ? { opacity: 1, y: 0 }
                  : {}
              }
              transition={{
                duration: 0.6,
              }}
            >
              {paragraph}
            </motion.p>
          ))}

          {/* <motion.ul
            ref={ref4}
            initial={{ opacity: 0, y: 50 }}
            animate={inView4 ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
            }}
          >
            <li>24/7 Roadside Assistance</li>
            <li>Free Cancellation & Return</li>
            <li>Rent Now Pay When You Arrive</li>
            <li>24/7 Roadside Assistance</li>
            <li>Free Cancellation & Return</li>
            <li>Rent Now Pay When You Arrive</li>
          </motion.ul> */}

          {/* Service Entry Gallery Start */}
          <div className="service-entry-gallery">
            <div className="row gallery-items">
              {[1, 2, 3, 4].map((num, index) => {
                const [ref, inView] = useInView({
                  triggerOnce: true,
                  threshold: 0.1,
                });
                return (
                  <div key={num} className="col-lg-3 col-6">
                    <motion.div
                      className="service-gallery"
                      data-cursor-text="View"
                      ref={ref}
                      initial={{ opacity: 0, y: 50 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.6,
                        delay: isLaptop ? index * 0.2 : (index % 2) * 0.2,
                      }}
                    >
                      <a href={`/assets/images/our_service_details/airport_transfer/${num}${num === 4 ? '.jpg' : '.png'}`}>
                        <figure className="image-anime">
                          <img
                            src={`/assets/images/our_service_details/airport_transfer/${num}${num === 4 ? '.jpg' : '.png'}`}
                            alt={`Airport Transfer Service ${num}`}
                          />
                        </figure>
                      </a>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Service Entry Gallery End */}
        </div>
        {/* Service Entry Content End */}

        {/* Rental Conditions FAQs Start */}
        {/* <div className="rental-conditions-faqs">
          <motion.div
            className="section-title"
            ref={ref5}
            initial={{ opacity: 0, y: 50 }}
            animate={inView5 ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
            }}
          >
            <h3>Frequently Asked Questions</h3>
            <TextAnime className="text-anime-style-3" tag="h2">
              You Need to Know About Service
            </TextAnime>
          </motion.div>

          <div className="rental-condition-accordion" id="rentalaccordion">
            {[
              {
                id: 1,
                title: "Driver's License Requirements",
                content:
                  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
              },
              {
                id: 2,
                title: "Insurance and Coverage Policy",
                content:
                  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
              },
              {
                id: 3,
                title: "Available Payment Methods",
                content:
                  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
              },
              {
                id: 4,
                title: "Cancellation and Modification Policy",
                content:
                  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
              },
            ].map((faq, index) => {
              const [ref, inView] = useInView({
                triggerOnce: true,
                threshold: 0.1,
              });
              return (
                <motion.div
                  key={faq.id}
                  className="accordion-item"
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{
                    duration: 0.6,
                  }}
                >
                  <h2
                    className="accordion-header"
                    id={`rentalheading${faq.id}`}
                  >
                    <button
                      className={`accordion-button ${
                        index === 0 ? "" : "collapsed"
                      }`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#rentalcollapse${faq.id}`}
                      aria-expanded={index === 0 ? "true" : "false"}
                      aria-controls={`rentalcollapse${faq.id}`}
                    >
                      {faq.title}
                    </button>
                  </h2>
                  <div
                    id={`rentalcollapse${faq.id}`}
                    className={`accordion-collapse collapse ${
                      index === 0 ? "show" : ""
                    }`}
                    aria-labelledby={`rentalheading${faq.id}`}
                    data-bs-parent="#rentalaccordion"
                  >
                    <div className="accordion-body">
                      <p>{faq.content}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div> */}
      </div>
      {/* Service Single Content End */}
    </div>
  );
};

export default ServiceDetailsContent;
