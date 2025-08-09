import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "../assets/css/b2b-body.css";
import "../assets/css/unified-forms.css";
import RevealImage from "./animations/RevealImage";
import TextAnime from "./animations/TextAnime";

import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

import { strings } from "../lang/affiliate";
import RegistrationService, { AffiliateRegistrationData } from "../services/RegistrationService";

const fadeInUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const AffiliateBody: React.FC = () => {
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

  const [formData, setFormData] = useState<Partial<AffiliateRegistrationData>>({
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
    const validationErrors = RegistrationService.validateAffiliateData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    setSubmitMessage(null);

    try {
      const response = await RegistrationService.registerAffiliate(formData as AffiliateRegistrationData);
      
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
    <div className="affiliate-section">
      <div className="container">
        <div className="row">
          {/* Left Column - Image and Content */}
          <div className="col-lg-8">
            <div className="affiliate-left-content">
              {/* Image Section */}
              <div className="affiliate-images-container">
                <div className="affiliate-main-image">
                  <RevealImage
                    className="reveal custom-figure h-100"
                    src="/assets/images/affiliate/1.jpg"
                    alt="Our Service"
                  />
                </div>
                <div className="affiliate-secondary-image">
                  <RevealImage
                    className="reveal custom-figure h-100"
                    src="/assets/images/affiliate/2.jpg"
                    alt="Why Choose Us"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="affiliate-content">
                <div className="affiliate-header">
                  <motion.h3
                    ref={ref1}
                    className="fadeInUp affiliate-subtitle"
                    variants={fadeInUpVariants}
                    initial="initial"
                    animate={inView1 ? "animate" : "initial"}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {strings.ABOUT}
                  </motion.h3>

                  <TextAnime className="affiliate-title" tag="h2">
                    {strings.HEADING_BODY}
                  </TextAnime>
                </div>
                
                <div className="affiliate-description">
                  <motion.p
                    ref={ref2}
                    className="fadeInUp affiliate-paragraph"
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
                    className="fadeInUp affiliate-paragraph"
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
                  className="affiliate-cta fadeInUp"
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
          <div className="col-lg-4">
            <div className="affiliate-form-container">
              <motion.div
                className="affiliate-form-body"
                initial={{ opacity: 0, y: 20 }}
                animate={inView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="affiliate-form-header">
                  <h3 className="affiliate-form-title">
                    {strings.JOIN}
                  </h3>
                </div>
                
                <form onSubmit={handleSubmit} className="affiliate-form">
                  {/* Error Messages */}
                  {errors.length > 0 && (
                    <div className="affiliate-error-messages">
                      {errors.map((error, index) => (
                        <div key={index} className="affiliate-error-item">
                          • {error}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Success/Error Message */}
                  {submitMessage && (
                    <div className={`affiliate-message affiliate-message-${submitMessage.type}`}>
                      {submitMessage.text}
                    </div>
                  )}

                  {/* Company Information */}
                  <div className="affiliate-form-fields">
                    <div className="affiliate-form-group">
                      <label className="affiliate-form-label">{strings.COMPANY}</label>
                      <input
                        type="text"
                        name="companyName"
                        className="affiliate-form-input"
                        value={formData.companyName || ''}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
                        required
                      />
                    </div>

                    <div className="affiliate-form-group">
                      <label className="affiliate-form-label">{strings.EMAIL}</label>
                      <input
                        type="email"
                        name="companyEmail"
                        className="affiliate-form-input"
                        value={formData.companyEmail || ''}
                        onChange={handleInputChange}
                        placeholder="company@example.com"
                        required
                      />
                    </div>

                    <div className="affiliate-form-group">
                      <label className="affiliate-form-label">{strings.CONTACT_NO}</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        className="affiliate-form-input"
                        value={formData.contactNumber || ''}
                        onChange={handleInputChange}
                        placeholder="Company phone number"
                        required
                      />
                    </div>

                    <div className="affiliate-form-group">
                      <label className="affiliate-form-label">{strings.COUNTRY}</label>
                      <select
                        name="registrationCountry"
                        className="affiliate-form-select"
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

                    <div className="affiliate-form-group">
                      <label className="affiliate-form-label">{strings.REP}</label>
                      <input
                        type="text"
                        name="companyRepresentative"
                        className="affiliate-form-input"
                        value={formData.companyRepresentative || ''}
                        onChange={handleInputChange}
                        placeholder="Representative name"
                        required
                      />
                    </div>

                    <div className="affiliate-form-group">
                      <label className="affiliate-form-label">Service Area (Optional)</label>
                      <input
                        type="text"
                        name="serviceArea"
                        className="affiliate-form-input"
                        value={formData.serviceArea || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., Ontario, Toronto Metro"
                      />
                    </div>

                    <div className="affiliate-form-group">
                      <label className="affiliate-form-label">Registration Number (Optional)</label>
                      <input
                        type="text"
                        name="registrationNumber"
                        className="affiliate-form-input"
                        value={formData.registrationNumber || ''}
                        onChange={handleInputChange}
                        placeholder="Business registration number"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="affiliate-form-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : strings.SUBMIT}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateBody;
