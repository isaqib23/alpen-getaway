import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "../assets/css/b2b-body.css";
import "../assets/css/unified-forms.css";
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
    <div className="about-us">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4">
            {/* About Us Image Start */}
            <div className="about-image">
              <div className="about-img-1">
                <RevealImage
                  className="reveal custom-figure h-100"
                  src="/img/b2b_partner/1.jpg"
                  alt="About Us 1"
                />
              </div>
              <div className="about-img-2">
                <RevealImage
                  className="reveal custom-figure h-100"
                  src="/img/b2b_partner/2.jpg"
                  alt="About Us 2"
                />
              </div>
            </div>
            {/* About Us Image End */}
          </div>

          <div className="col-lg-4">
            {/* About Us Content Start */}
            <div className="about-content">
              <div className="section-title">
                <motion.h3
                  ref={ref1}
                  className="fadeInUp"
                  variants={fadeInUpVariants}
                  initial="initial"
                  animate={inView1 ? "animate" : "initial"}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {strings.ABOUT}
                </motion.h3>

                <TextAnime className="text-anime-style-3" tag="h4">
                  {strings.HEADING}
                </TextAnime>
                <motion.p
                  ref={ref2}
                  className="fadeInUp"
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
                  className="fadeInUp"
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
                className="about-content-footer fadeInUp"
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
            {/* About Us Content End */}
          </div>
          <div className="col-lg-4">
            <motion.div
              className="unified-form-container"
              style={{ maxWidth: 'none', width: '100%' }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="unified-form-header" style={{ textAlign: 'center' }}>
                <h3 className="unified-form-title" style={{ fontSize: '28px' }}>
                  {strings.JOIN}
                </h3>
                <p className="unified-form-subtitle">
                  Join our network and start earning with your transportation services
                </p>
              </div>

              <form onSubmit={handleSubmit} className="unified-form-body">
                {/* Error Messages */}
                {errors.length > 0 && (
                  <div style={{ 
                    background: '#ffebee', 
                    border: '1px solid #f44336', 
                    borderRadius: '4px', 
                    padding: '12px', 
                    marginBottom: '20px',
                    color: '#c62828'
                  }}>
                    {errors.map((error, index) => (
                      <div key={index} style={{ marginBottom: index < errors.length - 1 ? '4px' : '0' }}>
                        • {error}
                      </div>
                    ))}
                  </div>
                )}

                {/* Success/Error Message */}
                {submitMessage && (
                  <div style={{ 
                    background: submitMessage.type === 'success' ? '#e8f5e8' : '#ffebee', 
                    border: `1px solid ${submitMessage.type === 'success' ? '#4caf50' : '#f44336'}`, 
                    borderRadius: '4px', 
                    padding: '12px', 
                    marginBottom: '20px',
                    color: submitMessage.type === 'success' ? '#2e7d32' : '#c62828'
                  }}>
                    {submitMessage.text}
                  </div>
                )}

                {/* Company Information */}
                <div>
                  
                  <div className="unified-form-group">
                    <label className="unified-form-label">{strings.COMPANY}</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName || ''}
                      onChange={handleInputChange}
                      className="unified-form-input"
                      placeholder="Enter company name"
                      required
                    />
                  </div>

                  <div className="unified-form-group">
                    <label className="unified-form-label">{strings.EMAIL}</label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail || ''}
                      onChange={handleInputChange}
                      className="unified-form-input"
                      placeholder="company@example.com"
                      required
                    />
                  </div>

                  <div className="unified-form-group">
                    <label className="unified-form-label">{strings.CONTACT_NO}</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber || ''}
                      onChange={handleInputChange}
                      className="unified-form-input"
                      placeholder="Company phone number"
                      required
                    />
                  </div>

                  <div className="unified-form-group">
                    <label className="unified-form-label">{strings.COUNTRY}</label>
                    <select
                      name="registrationCountry"
                      value={formData.registrationCountry || ''}
                      onChange={handleInputChange}
                      className="unified-form-select"
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

                  <div className="unified-form-group">
                    <label className="unified-form-label">{strings.SERVICE}</label>
                    <input
                      type="text"
                      name="serviceArea"
                      value={formData.serviceArea || ''}
                      onChange={handleInputChange}
                      className="unified-form-input"
                      placeholder="e.g., Toronto Metro Area, Ontario"
                      required
                    />
                  </div>

                  <div className="unified-form-group">
                    <label className="unified-form-label">{strings.REGISTERATION}</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber || ''}
                      onChange={handleInputChange}
                      className="unified-form-input"
                      placeholder="Business registration number"
                      required
                    />
                  </div>

                  <div className="unified-form-group">
                    <label className="unified-form-label">{strings.REP}</label>
                    <input
                      type="text"
                      name="companyRepresentative"
                      value={formData.companyRepresentative || ''}
                      onChange={handleInputChange}
                      className="unified-form-input"
                      placeholder="Representative full name"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="unified-form-button primary"
                  disabled={isSubmitting}
                  style={{ 
                    opacity: isSubmitting ? 0.7 : 1, 
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : strings.SUBMIT}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BBody;
