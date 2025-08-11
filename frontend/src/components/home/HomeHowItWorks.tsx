import React from "react";
import RevealImage from "../animations/RevealImage";
import TextAnime from "../animations/TextAnime";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

import { strings } from "../../lang/works";
import { Link } from "react-router-dom";
import aboutImg from "@assets/images/about_us/about.jpg";
import driver1Img from "@assets/images/about_us/driver_1.jpg";
import about1Img from "@assets/images/about_us/1.jpg";
import about2Img from "@assets/images/about_us/2.png";
import driver2Img from "@assets/images/about_us/driver_2.jpg";

const HomeHowItWorks = () => {
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="how-it-work">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            {/* How Work Content Start */}
            <div className="how-work-content">
              {/* Section Title Start */}
              <div className="section-title">
                {/* <motion.h3
                  ref={ref1}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView1 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  {strings.HEADING}
                </motion.h3> */}
                <TextAnime className="text-anime-style-3" tag="h2">
                  {strings.DESCRIPTION}
                </TextAnime>
              </div>
              <motion.p
                ref={ref1}
                initial={{ opacity: 0, y: 20 }}
                animate={inView1 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.75 }}
                style={{ color: "black !important" }}
              >
                {strings.STREAMLINED}
              </motion.p>
              {/* Section Title End */}

              {/* How Work Accordion Start */}
              {/* <div className="how-work-accordion" id="workaccordion">
                <motion.div
                  ref={ref2}
                  className="accordion-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView2 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="icon-box">
                    <img
                      src={about1Img}
                      alt="Browse and Select"
                      style={{width: "40px", height: "40px", objectFit: "cover"}}
                    />
                  </div>
                  <h2 className="accordion-header" id="workheading1">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#workcollapse1"
                      aria-expanded="true"
                      aria-controls="workcollapse1"
                    >
                      {strings.BROWSE}
                    </button>
                  </h2>
                  <div
                    id="workcollapse1"
                    className="accordion-collapse collapse show"
                    aria-labelledby="workheading1"
                    data-bs-parent="#workaccordion"
                  >
                    <div className="accordion-body">
                      <p>{strings.BROWSE_DESCRIPTION}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="accordion-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView2 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="icon-box">
                    <img
                      src={about2Img}
                      alt="Book and Confirm"
                      style={{width: "40px", height: "40px", objectFit: "cover"}}
                    />
                  </div>
                  <h2 className="accordion-header" id="workheading2">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#workcollapse2"
                      aria-expanded="false"
                      aria-controls="workcollapse2"
                    >
                      {strings.CONFIRM}
                    </button>
                  </h2>
                  <div
                    id="workcollapse2"
                    className="accordion-collapse collapse"
                    aria-labelledby="workheading2"
                    data-bs-parent="#workaccordion"
                  >
                    <div className="accordion-body">
                      <p>{strings.CONFIRM_DESCRIPTION}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  ref={ref3}
                  className="accordion-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView3 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="icon-box">
                    <img
                      src={driver2Img}
                      alt="Book and Enjoy"
                      style={{width: "40px", height: "40px", objectFit: "cover"}}
                    />
                  </div>
                  <h2 className="accordion-header" id="workheading3">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#workcollapse3"
                      aria-expanded="false"
                      aria-controls="workcollapse3"
                    >
                      {strings.ENJOY}
                    </button>
                  </h2>
                  <div
                    id="workcollapse3"
                    className="accordion-collapse collapse"
                    aria-labelledby="workheading3"
                    data-bs-parent="#workaccordion"
                  >
                    <div className="accordion-body">
                      <p>{strings.ENJOY_DESCRIPTION}</p>
                    </div>
                  </div>
                </motion.div>
              </div> */}
              {/* How Work Accordion End */}
              <Link to="/cars" className="btn-default ">
                View Details
              </Link>
            </div>
            {/* How Work Content End */}
          </div>

          <div className="col-lg-6">
            {/* How Work Image Start */}
            <div className="how-work-image">
              {/* How Work Image Start */}
              <div className="how-work-img">
                <RevealImage
                  className="reveal custom-figure"
                  src={aboutImg}
                  alt="How It Works"
                />
              </div>
              {/* How Work Image End */}

              {/* Trusted Client Start */}
              <div className="trusted-client">
                <div className="trusted-client-content">
                  <h3>
                    <span className="counter">5</span>
                    {strings.TRUSTED}
                  </h3>
                </div>
                <div className="trusted-client--image">
                  <img
                    src={driver1Img}
                    alt="Trusted Clients"
                  />
                </div>
              </div>
              {/* Trusted Client End */}
            </div>
            {/* How It Work Image End */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHowItWorks;
