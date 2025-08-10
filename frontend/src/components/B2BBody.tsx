import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import RevealImage from "./animations/RevealImage";
import TextAnime from "./animations/TextAnime";

import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

import { strings } from "../lang/b2b";
import RegistrationService, { B2BRegistrationData } from "../services/RegistrationService";

const fadeInUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const B2BBody: React.FC = () => {
  const isLaptop = useMediaQuery({ query: "(min-width: 992px)" });

  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: ref2, inView: inView2 } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: ref3, inView: inView3 } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: ref6, inView: inView6 } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState<Partial<B2BRegistrationData>>({
    companyName: "",
    companyEmail: "",
    contactNumber: "",
    registrationCountry: "",
    serviceArea: "",
    registrationNumber: "",
    companyRepresentative: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
    if (submitMessage) {
      setSubmitMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validationErrors = RegistrationService.validateB2BData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    setSubmitMessage(null);

    try {
      const response = await RegistrationService.registerB2B(formData as B2BRegistrationData);
      
      setSubmitMessage({
        type: 'success',
        text: response.message || 'Registration successful! Please check your email for verification instructions and your temporary password.'
      });

      // Clear form on success
      setFormData({
        companyName: "",
        companyEmail: "",
        contactNumber: "",
        registrationCountry: "",
        serviceArea: "",
        registrationNumber: "",
        companyRepresentative: "",
      });

    } catch (error: any) {
      setSubmitMessage({
        type: 'error',
        text: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="trusted-partner-section">
      <div className="container">
        <div className="trusted-partner-layout" style={{ 
          display: 'flex', 
          gap: '2rem', 
          alignItems: 'flex-start',
          flexDirection: isLaptop ? 'row' : 'column'
        }}>
          {/* Left Column - Image and Content */}
          <div className="col-lg-8" style={{ flex: '1' }}>
            <div className="b2b-left-content">
              {/* Image Section */}
              <div className="trusted-partner-images">
                <div className="main-image-circle">
                  <img 
                    src="/img/b2b_partner/1.jpg" 
                    alt="B2B Partner Service" 
                    className="img-fluid" 
                  />
                </div>
                <div className="secondary-image-circle">
                  <img 
                    src="/img/b2b_partner/2.jpg" 
                    alt="B2B Partnership" 
                    className="img-fluid" 
                  />
                </div>
                <div className="star-decoration">
                  ✦
                </div>
                <div className="red-asterisk">*</div>
              </div>

              {/* Content Section */}
              <div className="b2b-content">
                <div className="b2b-header">
                  <motion.h3
                    ref={ref1}
                    className="fadeInUp b2b-subtitle"
                    variants={fadeInUpVariants}
                    initial="initial"
                    animate={inView1 ? "animate" : "initial"}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {strings.ABOUT}
                  </motion.h3>

                  <TextAnime className="b2b-title" tag="h2">
                    {strings.HEADING}
                  </TextAnime>
                </div>
                
                <div className="b2b-description">
                  <motion.p
                    ref={ref2}
                    className="fadeInUp b2b-paragraph"
                    variants={fadeInUpVariants}
                    initial="initial"
                    animate={inView2 ? "animate" : "initial"}
                    transition={
                      isLaptop
                        ? { duration: 0.6, ease: "easeOut", delay: 0.25 }
                        : { duration: 0.6, ease: "easeOut" }
                    }
                  >
                    {strings.PARA_1}
                  </motion.p>
                  <motion.p
                    ref={ref3}
                    className="fadeInUp b2b-paragraph"
                    variants={fadeInUpVariants}
                    initial="initial"
                    animate={inView3 ? "animate" : "initial"}
                    transition={
                      isLaptop
                        ? { duration: 0.6, ease: "easeOut", delay: 0.25 }
                        : { duration: 0.6, ease: "easeOut" }
                    }
                  >
                    {strings.PARA_2}
                  </motion.p>
                </div>

                <motion.div
                  ref={ref6}
                  className="b2b-cta fadeInUp"
                  variants={fadeInUpVariants}
                  initial="initial"
                  animate={inView6 ? "animate" : "initial"}
                  transition={
                    isLaptop
                      ? { duration: 0.6, ease: "easeOut", delay: 0.25 }
                      : { duration: 0.6, ease: "easeOut" }
                  }
                >
                  <Link to="/contact" className="btn-default">
                    {strings.CONTACT}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="col-lg-4" style={{ 
            flex: isLaptop ? '0 0 400px' : '1', 
            minWidth: isLaptop ? '350px' : 'auto' 
          }}>
            <div className="b2b-form-header">
              <h3 className="b2b-form-title">
                {strings.JOIN}
              </h3>
              <p className="b2b-form-subtitle">
                Join our network and start earning with your transportation services
              </p>
            </div>

              
              <form onSubmit={handleSubmit} className="b2b-form"
                style={{
                  opacity: inView1 ? 1 : 0,
                  transform: inView1 ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s'
                }}
              >
                  {/* Error Messages */}
                  {errors.length > 0 && (
                    <div className="b2b-error-messages">
                      {errors.map((error, index) => (
                        <div key={index} className="b2b-error-item">
                          • {error}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Success/Error Message */}
                  {submitMessage && (
                    <div className={`b2b-message b2b-message-${submitMessage.type}`}>
                      {submitMessage.text}
                    </div>
                  )}

                  {/* Company Information */}
                  <div className="b2b-form-fields">
                    <div className="b2b-form-group">
                      <label className="b2b-form-label">{strings.COMPANY}</label>
                      <input
                        type="text"
                        name="companyName"
                        className="b2b-form-input"
                        value={formData.companyName || ''}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
                        required
                      />
                    </div>

                    <div className="b2b-form-group">
                      <label className="b2b-form-label">{strings.EMAIL}</label>
                      <input
                        type="email"
                        name="companyEmail"
                        className="b2b-form-input"
                        value={formData.companyEmail || ''}
                        onChange={handleInputChange}
                        placeholder="company@example.com"
                        required
                      />
                    </div>

                    <div className="b2b-form-group">
                      <label className="b2b-form-label">{strings.CONTACT_NO}</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        className="b2b-form-input"
                        value={formData.contactNumber || ''}
                        onChange={handleInputChange}
                        placeholder="Company phone number"
                        required
                      />
                    </div>

                    <div className="b2b-form-group">
                      <label className="b2b-form-label">{strings.COUNTRY}</label>
                      <select
                        name="registrationCountry"
                        className="b2b-form-select"
                        value={formData.registrationCountry || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="Canada">Canada</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="b2b-form-group">
                      <label className="b2b-form-label">{strings.SERVICE}</label>
                      <input
                        type="text"
                        name="serviceArea"
                        className="b2b-form-input"
                        value={formData.serviceArea || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., Toronto Metro Area, Ontario"
                        required
                      />
                    </div>

                    <div className="b2b-form-group">
                      <label className="b2b-form-label">{strings.REGISTERATION}</label>
                      <input
                        type="text"
                        name="registrationNumber"
                        className="b2b-form-input"
                        value={formData.registrationNumber || ''}
                        onChange={handleInputChange}
                        placeholder="Business registration number"
                        required
                      />
                    </div>

                    <div className="b2b-form-group">
                      <label className="b2b-form-label">{strings.REP}</label>
                      <input
                        type="text"
                        name="companyRepresentative"
                        className="b2b-form-input"
                        value={formData.companyRepresentative || ''}
                        onChange={handleInputChange}
                        placeholder="Representative full name"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="b2b-form-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : strings.SUBMIT}
                  </button>
                </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BBody;
