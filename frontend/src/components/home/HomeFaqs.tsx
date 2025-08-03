import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "../../assets/css/home-faqs.css";
import TextAnime from "../animations/TextAnime";

import { strings } from "../../lang/faqs";

const fadeInUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const HomeFAQs: React.FC = () => {
  // Create refs and inView states for each section
  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0.85,
  });

  const { ref: ref2, inView: inView2 } = useInView({
    triggerOnce: true,
    threshold: 0.85,
  });

  const { ref: ref3, inView: inView3 } = useInView({
    triggerOnce: true,
    threshold: 0.85,
  });

  return (
    <div className="our-faqs bg-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 order-lg-1 order-md-2 order-2">
            {/* Our Faqs Image Start */}
            <div className="our-faqs-image">
              <div className="faqs-img-1">
                <figure className="image-anime">
                  <img
                    src="/img/b2b_partner/1.jpg"
                    alt="FAQ Image 1"
                  />
                </figure>
              </div>

              <div className="faqs-img-2">
                <figure className="image-anime">
                  <img
                    src="/img/b2b_partner/2.jpg"
                    alt="FAQ Image 2"
                  />
                </figure>
              </div>
            </div>
            {/* Our Faqs Image End */}
          </div>

          <div className="col-lg-6 order-lg-2 order-md-1 order-1">
            {/* Our Faqs Content Start */}
            <div className="our-faqs-content">
              {/* Section Title Start */}
              <div className="section-title">
                <motion.h3
                  ref={ref1}
                  className="fadeInUp"
                  variants={fadeInUpVariants}
                  initial="initial"
                  animate={inView1 ? "animate" : "initial"}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {strings.HEADING}
                </motion.h3>
                <TextAnime className="text-anime-style-3" tag="h2">
                  {strings.DESCRIPTION}
                </TextAnime>
              </div>
              {/* Section Title End */}

              {/* Our Faqs Accordion Start */}
              <div className="our-faqs-accordion" id="faqsaccordion">
                {/* FAQ Item Start */}
                <motion.div
                  ref={ref2}
                  className="accordion-item"
                  variants={fadeInUpVariants}
                  initial="initial"
                  animate={inView2 ? "animate" : "initial"}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
                >
                  <h2 className="accordion-header" id="faqheading1">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faqcollapse1"
                      aria-expanded="true"
                      aria-controls="faqcollapse1"
                    >
                      {strings.WHAT}
                    </button>
                  </h2>
                  <div
                    id="faqcollapse1"
                    className="accordion-collapse collapse show"
                    aria-labelledby="faqheading1"
                    data-bs-parent="#faqsaccordion"
                  >
                    <div className="accordion-body">
                      <p>{strings.WHAT_DESCRIPTION}</p>
                    </div>
                  </div>
                </motion.div>
                {/* FAQ Item End */}

                {/* FAQ Item Start */}
                <motion.div
                  ref={ref3}
                  className="accordion-item"
                  variants={fadeInUpVariants}
                  initial="initial"
                  animate={inView3 ? "animate" : "initial"}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                >
                  <h2 className="accordion-header" id="faqheading2">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faqcollapse2"
                      aria-expanded="false"
                      aria-controls="faqcollapse2"
                    >
                      {strings.AGE}
                    </button>
                  </h2>
                  <div
                    id="faqcollapse2"
                    className="accordion-collapse collapse"
                    aria-labelledby="faqheading2"
                    data-bs-parent="#faqsaccordion"
                  >
                    <div className="accordion-body">
                      <p>{strings.AGE_DESCRIPTION}</p>
                    </div>
                  </div>
                </motion.div>
                {/* FAQ Item End */}

                {/* FAQ Item Start */}
                <motion.div
                  ref={ref3}
                  className="accordion-item"
                  variants={fadeInUpVariants}
                  initial="initial"
                  animate={inView3 ? "animate" : "initial"}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.75 }}
                >
                  <h2 className="accordion-header" id="faqheading3">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faqcollapse3"
                      aria-expanded="false"
                      aria-controls="faqcollapse3"
                    >
                      {strings.CARD}
                    </button>
                  </h2>
                  <div
                    id="faqcollapse3"
                    className="accordion-collapse collapse"
                    aria-labelledby="faqheading3"
                    data-bs-parent="#faqsaccordion"
                  >
                    <div className="accordion-body">
                      <p>{strings.CARD_DESCRIPTION}</p>
                    </div>
                  </div>
                </motion.div>
                {/* FAQ Item End */}
              </div>
              {/* Our Faqs Accordion End */}
            </div>
            {/* Our Faqs Content End */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeFAQs;
