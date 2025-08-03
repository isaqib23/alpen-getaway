import React from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import "../assets/css/contact-info.css"; // Ensure you have a CSS file for styles
import "../assets/css/unified-forms.css";
import { Link } from "react-router-dom";
import TextAnime from "./animations/TextAnime";

import { strings } from "../lang/contact-page";

const ContactInfo: React.FC = () => {
  const iconRefs = Array(3)
    .fill(0)
    .map(() => useInView({ triggerOnce: true, threshold: 0.25 }));

  const formFieldRefs = Array(5)
    .fill(0)
    .map(() => useInView({ triggerOnce: true, threshold: 0.25 }));

  const { ref: socialRef, inView: socialInView } = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="page-contact-us">
      <div className="contact-info-form">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="contact-information">
                <div className="section-title">
                  <TextAnime className="text-anime-style-3" tag="h2">
                    {strings.HEADING}
                  </TextAnime>
                  <p>{strings.DESCRIPTION}</p>
                </div>

                <div className="contact-info-list">
                  {[
                    { icon: "icon-phone.svg", content: "(+01) 789 854 856" },
                    { icon: "icon-mail.svg", content: "info@domain.com" },
                    {
                      icon: "icon-location.svg",
                      content:
                        "1234 Elm Street, Suite 567 Springfield, United States",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="contact-info-item"
                      ref={iconRefs[index].ref}
                      variants={itemVariants}
                      initial="hidden"
                      animate={iconRefs[index].inView ? "visible" : "hidden"}
                    >
                      <div className="icon-box">
                        <img src={`/img/icons/${item.icon}`} alt="" />
                      </div>
                      <div className="contact-info-content">
                        <p>{item.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="unified-form-container" style={{ maxWidth: 'none', width: '100%', padding: '40px' }}>
                <div className="unified-form-header" style={{ marginBottom: '30px', textAlign: 'left' }}>
                  <h3 className="unified-form-title" style={{ fontSize: '28px', marginBottom: '8px' }}>
                    Send us a Message
                  </h3>
                  <p className="unified-form-subtitle">
                    We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                  </p>
                </div>
                
                <form
                  id="contactForm"
                  className="unified-form-body"
                  action="#"
                  method="POST"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="unified-form-group">
                        <label className="unified-form-label">First Name</label>
                        <motion.input
                          ref={formFieldRefs[0].ref}
                          type="text"
                          name="fname"
                          className="unified-form-input"
                          id="fname"
                          placeholder="Your first name"
                          required
                          variants={itemVariants}
                          initial="hidden"
                          animate={formFieldRefs[0].inView ? "visible" : "hidden"}
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="unified-form-group">
                        <label className="unified-form-label">{strings.LAST_NAME}</label>
                        <motion.input
                          ref={formFieldRefs[1].ref}
                          type="text"
                          name="lname"
                          className="unified-form-input"
                          id="lname"
                          placeholder={strings.LAST_NAME_PLACEHOLDER}
                          required
                          variants={itemVariants}
                          initial="hidden"
                          animate={formFieldRefs[1].inView ? "visible" : "hidden"}
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="unified-form-group">
                        <label className="unified-form-label">{strings.EMAIL}</label>
                        <motion.input
                          ref={formFieldRefs[2].ref}
                          type="email"
                          name="email"
                          className="unified-form-input"
                          id="email"
                          placeholder={strings.EMAIL_PLACEHOLDER}
                          required
                          variants={itemVariants}
                          initial="hidden"
                          animate={formFieldRefs[2].inView ? "visible" : "hidden"}
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="unified-form-group">
                        <label className="unified-form-label">{strings.PHONE}</label>
                        <motion.input
                          ref={formFieldRefs[3].ref}
                          type="tel"
                          name="phone"
                          className="unified-form-input"
                          id="phone"
                          placeholder={strings.PHONE_PLACEHOLDER}
                          required
                          variants={itemVariants}
                          initial="hidden"
                          animate={formFieldRefs[3].inView ? "visible" : "hidden"}
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-12">
                      <div className="unified-form-group">
                        <label className="unified-form-label">{strings.MESSAGE}</label>
                        <motion.textarea
                          ref={formFieldRefs[4].ref}
                          name="msg"
                          className="unified-form-input"
                          id="msg"
                          rows={5}
                          placeholder={strings.MESSAGE_PLACEHOLDER}
                          required
                          variants={itemVariants}
                          initial="hidden"
                          animate={formFieldRefs[4].inView ? "visible" : "hidden"}
                          style={{ resize: 'vertical', minHeight: '120px' }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button type="submit" className="unified-form-button primary">
                    {strings.SEND}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <motion.div
            ref={socialRef}
            className="contact-info-social"
            variants={itemVariants}
            initial="hidden"
            animate={socialInView ? "visible" : "hidden"}
          >
            <ul>
              <li>
                <Link to="#">
                  <i className="fa-brands fa-facebook-f"></i>
                </Link>
              </li>
              <li>
                <Link to="#">
                  <i className="fa-brands fa-twitter"></i>
                </Link>
              </li>
              <li>
                <Link to="#">
                  <i className="fa-brands fa-linkedin-in"></i>
                </Link>
              </li>
              <li>
                <Link to="#">
                  <i className="fa-brands fa-instagram"></i>
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
