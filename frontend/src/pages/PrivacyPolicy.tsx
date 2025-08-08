import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import "../assets/css/legal-pages.css";

const PrivacyPolicy: React.FC = () => {
  const sections = [
    "Information We Collect",
    "How We Use Your Information", 
    "Information Sharing",
    "Data Security",
    "Cookies & Tracking",
    "Your Rights",
    "Data Retention",
    "International Transfers",
    "Contact Us"
  ];

  return (
    <>
      <Header />
      <PageHeader 
        title="Privacy Policy"
        breadcrumb={["Home", "Privacy Policy"]}
      />
      
      <div className="legal-content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="legal-document">
                <div className="legal-header">
                  <h1 className="legal-title">Privacy Policy</h1>
                  <p className="legal-subtitle">
                    Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                  </p>
                  <span className="legal-last-updated">
                    Last updated: {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                <div className="legal-toc">
                  <h4>Table of Contents</h4>
                  <ul>
                    {sections.map((section, index) => (
                      <li key={index}>{index + 1}. {section}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>1. Information We Collect</h3>
                  <p>
                    At Alpen Getaway, we collect information to provide you with exceptional transportation services. 
                    The types of information we collect include:
                  </p>
                  <ul>
                    <li><strong>Personal Information:</strong> Name, email address, phone number, and address</li>
                    <li><strong>Booking Details:</strong> Pickup/drop-off locations, travel dates and times, passenger count</li>
                    <li><strong>Payment Information:</strong> Credit card details (processed securely through our payment partners)</li>
                    <li><strong>Communication Data:</strong> Messages, emails, and support ticket conversations</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage analytics</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>2. How We Use Your Information</h3>
                  <p>
                    We use your information for legitimate business purposes to enhance your experience:
                  </p>
                  <ul>
                    <li>Process and manage your transportation bookings</li>
                    <li>Communicate with you about your reservations and service updates</li>
                    <li>Provide customer support and resolve any issues</li>
                    <li>Improve our services based on feedback and usage patterns</li>
                    <li>Send promotional offers and newsletters (with your consent)</li>
                    <li>Comply with legal obligations and prevent fraud</li>
                  </ul>
                </div>
                
                <div className="legal-highlight">
                  <p>
                    <strong>Important:</strong> We never sell your personal information to third parties. 
                    Your data is only shared as described in this policy or with your explicit consent.
                  </p>
                </div>
                
                <div className="legal-section">
                  <h3>3. Information Sharing</h3>
                  <p>
                    We may share your information in the following limited circumstances:
                  </p>
                  <ul>
                    <li><strong>Service Providers:</strong> Trusted partners who help us operate our business (payment processors, IT support)</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                    <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of our business</li>
                    <li><strong>Safety & Security:</strong> To protect our users, employees, and the public from harm</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>4. Data Security</h3>
                  <p>
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <ul>
                    <li>SSL encryption for all data transmission</li>
                    <li>Secure data centers with 24/7 monitoring</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Access controls and employee training programs</li>
                    <li>Incident response procedures for data breaches</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>5. Cookies & Tracking</h3>
                  <p>
                    Our website uses cookies and similar technologies to improve your browsing experience:
                  </p>
                  <ul>
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                    <li><strong>Marketing Cookies:</strong> Enable personalized advertising (with your consent)</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                  <p>You can manage cookie preferences through your browser settings or our cookie consent banner.</p>
                </div>
                
                <div className="legal-section">
                  <h3>6. Your Rights</h3>
                  <p>
                    Under applicable privacy laws, you have the following rights regarding your personal data:
                  </p>
                  <ul>
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Rectification:</strong> Correct any inaccurate or incomplete data</li>
                    <li><strong>Erasure:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Receive your data in a portable format</li>
                    <li><strong>Restriction:</strong> Limit how we process your information</li>
                    <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                    <li><strong>Consent Withdrawal:</strong> Withdraw consent for consent-based processing</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>7. Data Retention</h3>
                  <p>We retain your personal information for different periods based on the purpose:</p>
                  <ul>
                    <li><strong>Booking Records:</strong> 3 years after service completion</li>
                    <li><strong>Financial Records:</strong> 7 years (as required by tax law)</li>
                    <li><strong>Marketing Data:</strong> Until consent is withdrawn</li>
                    <li><strong>Technical Logs:</strong> 12 months for security purposes</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>8. International Transfers</h3>
                  <p>
                    When we transfer your data outside the EU/EEA, we ensure adequate protection through:
                  </p>
                  <ul>
                    <li>EU Commission adequacy decisions</li>
                    <li>Standard Contractual Clauses (SCCs)</li>
                    <li>Certification schemes and binding corporate rules</li>
                  </ul>
                </div>
                
                <div className="legal-contact-box">
                  <h4>9. Contact Us</h4>
                  <p><strong>Data Protection Officer:</strong> privacy@alpengetaway.com</p>
                  <p><strong>Phone:</strong> +43 123 456 789</p>
                  <p><strong>Address:</strong> Alpen Getaway GmbH, [Company Address], Austria</p>
                  <p><strong>Response Time:</strong> We respond to privacy requests within 30 days</p>
                </div>
                
                <div className="legal-disclaimer">
                  <p>
                    This is a comprehensive privacy policy template. Please consult with legal professionals 
                    to ensure full compliance with applicable privacy laws and regulations in your jurisdiction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default PrivacyPolicy;