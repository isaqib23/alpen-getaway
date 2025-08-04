import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import "../assets/css/legal-pages.css";

const DSGVO: React.FC = () => {
  const sections = [
    "Data Controller Information",
    "Legal Basis for Processing",
    "Categories of Personal Data",
    "Purpose of Data Processing",
    "Data Recipients & Sharing",
    "Data Retention Periods",
    "Your Rights under GDPR",
    "International Data Transfers",
    "Data Security Measures",
    "Cookies & Tracking Technologies",
    "Automated Decision Making",
    "Data Breach Procedures",
    "Children's Privacy",
    "Contact & Complaints"
  ];

  return (
    <>
      <Header />
      <PageHeader 
        title="DSGVO - Data Protection Policy"
        breadcrumb={["Home", "DSGVO"]}
      />
      
      <div className="legal-content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="legal-document">
                <div className="legal-header">
                  <h1 className="legal-title">DSGVO - Datenschutz-Grundverordnung</h1>
                  <h2 className="legal-subtitle" style={{fontSize: '1.3rem', marginBottom: '20px'}}>
                    Data Protection Policy (GDPR Compliance)
                  </h2>
                  <p className="legal-subtitle">
                    Comprehensive data protection information in accordance with EU General Data Protection Regulation (GDPR).
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
                  <h4>Inhaltsverzeichnis / Table of Contents</h4>
                  <ul>
                    {sections.map((section, index) => (
                      <li key={index}>{index + 1}. {section}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="legal-contact-box">
                  <h4>1. Data Controller Information / Verantwortlicher</h4>
                  <p><strong>Company:</strong> Alpen Getaway GmbH</p>
                  <p><strong>Address:</strong> [Company Address], Austria</p>
                  <p><strong>Phone:</strong> +43 123 456 789</p>
                  <p><strong>Email:</strong> datenschutz@alpengetaway.com</p>
                  <p><strong>Data Protection Officer:</strong> [DPO Name]</p>
                  <p><strong>DPO Contact:</strong> dpo@alpengetaway.com</p>
                  <p><strong>Commercial Register:</strong> [Registration Number]</p>
                </div>
                
                <div className="legal-section">
                  <h3>2. Legal Basis for Processing / Rechtsgrundlagen</h3>
                  <p>
                    We process your personal data based on the following legal grounds under GDPR Article 6:
                  </p>
                  <ul>
                    <li><strong>Contract Performance (Art. 6(1)(b) GDPR):</strong> Processing necessary for providing transportation services and fulfilling our contractual obligations</li>
                    <li><strong>Legitimate Interests (Art. 6(1)(f) GDPR):</strong> Business operations, service improvement, fraud prevention, and direct marketing</li>
                    <li><strong>Legal Obligations (Art. 6(1)(c) GDPR):</strong> Compliance with tax, accounting, and regulatory requirements</li>
                    <li><strong>Consent (Art. 6(1)(a) GDPR):</strong> Newsletter subscriptions, marketing communications, and optional services</li>
                    <li><strong>Vital Interests (Art. 6(1)(d) GDPR):</strong> Emergency situations requiring immediate medical or safety assistance</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>3. Categories of Personal Data / Kategorien personenbezogener Daten</h3>
                  <p>We collect and process the following categories of personal data:</p>
                  
                  <div className="legal-highlight">
                    <p><strong>Identity & Contact Data:</strong></p>
                  </div>
                  <ul>
                    <li>Full name, title, date of birth</li>
                    <li>Email address, phone number, postal address</li>
                    <li>Emergency contact information</li>
                    <li>Government ID numbers (when required by law)</li>
                  </ul>
                  
                  <div className="legal-highlight">
                    <p><strong>Service & Booking Data:</strong></p>
                  </div>
                  <ul>
                    <li>Pickup and drop-off locations</li>
                    <li>Travel dates, times, and duration</li>
                    <li>Number of passengers and special requirements</li>
                    <li>Service preferences and vehicle selection</li>
                  </ul>
                  
                  <div className="legal-highlight">
                    <p><strong>Financial & Payment Data:</strong></p>
                  </div>
                  <ul>
                    <li>Payment method and billing information</li>
                    <li>Transaction history and receipts</li>
                    <li>Credit card details (processed by secure payment partners)</li>
                    <li>Refund and dispute information</li>
                  </ul>
                  
                  <div className="legal-highlight">
                    <p><strong>Technical & Usage Data:</strong></p>
                  </div>
                  <ul>
                    <li>IP address, browser type, and device information</li>
                    <li>Website usage patterns and click behavior</li>
                    <li>Cookies and tracking technologies data</li>
                    <li>App usage and location data (with consent)</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>4. Purpose of Data Processing / Zwecke der Datenverarbeitung</h3>
                  <p>We process your personal data for the following specific purposes:</p>
                  <ul>
                    <li><strong>Service Delivery:</strong> Booking management, driver coordination, route planning</li>
                    <li><strong>Customer Support:</strong> Inquiry handling, complaint resolution, feedback processing</li>
                    <li><strong>Financial Management:</strong> Payment processing, invoicing, accounting, tax compliance</li>
                    <li><strong>Marketing & Communication:</strong> Service updates, promotional offers, newsletters</li>
                    <li><strong>Quality Assurance:</strong> Service improvement, driver training, safety monitoring</li>
                    <li><strong>Legal Compliance:</strong> Regulatory reporting, audit requirements, dispute resolution</li>
                    <li><strong>Security & Fraud Prevention:</strong> Account protection, transaction monitoring</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>5. Data Recipients & Sharing / Datenempfänger</h3>
                  <p>Your personal data may be shared with the following categories of recipients:</p>
                  <ul>
                    <li><strong>Service Partners:</strong> Professional drivers, vehicle maintenance providers</li>
                    <li><strong>Payment Processors:</strong> Stripe, PayPal, and other secure payment gateways</li>
                    <li><strong>Technology Providers:</strong> Cloud hosting, IT support, and software vendors</li>
                    <li><strong>Business Partners:</strong> Hotels, travel agencies, corporate clients (with consent)</li>
                    <li><strong>Legal Authorities:</strong> Police, courts, tax authorities (when legally required)</li>
                    <li><strong>Professional Advisors:</strong> Lawyers, accountants, consultants (under confidentiality)</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>6. Data Retention Periods / Aufbewahrungsfristen</h3>
                  <p>We retain personal data for different periods based on legal requirements and business needs:</p>
                  <ul>
                    <li><strong>Booking & Service Records:</strong> 3 years after service completion (warranty claims)</li>
                    <li><strong>Financial & Tax Records:</strong> 7 years (Austrian tax law requirements)</li>
                    <li><strong>Marketing Consents:</strong> Until withdrawn or 3 years of inactivity</li>
                    <li><strong>Technical Logs:</strong> 12 months (security and troubleshooting)</li>
                    <li><strong>Customer Support:</strong> 2 years after case closure</li>
                    <li><strong>Legal Disputes:</strong> Until final resolution plus applicable limitation periods</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>7. Your Rights under GDPR / Ihre Rechte</h3>
                  <p>Under the GDPR, you have the following rights regarding your personal data:</p>
                  
                  <div className="legal-highlight">
                    <p><strong>Information Rights:</strong></p>
                  </div>
                  <ul>
                    <li><strong>Right of Access (Art. 15):</strong> Obtain confirmation and copies of your personal data</li>
                    <li><strong>Right to Information:</strong> Be informed about data processing activities</li>
                  </ul>
                  
                  <div className="legal-highlight">
                    <p><strong>Control Rights:</strong></p>
                  </div>
                  <ul>
                    <li><strong>Right to Rectification (Art. 16):</strong> Correct inaccurate or incomplete data</li>
                    <li><strong>Right to Erasure (Art. 17):</strong> Request deletion of personal data ("Right to be Forgotten")</li>
                    <li><strong>Right to Restrict Processing (Art. 18):</strong> Limit how we process your data</li>
                    <li><strong>Right to Data Portability (Art. 20):</strong> Receive data in a structured, machine-readable format</li>
                    <li><strong>Right to Object (Art. 21):</strong> Object to processing based on legitimate interests or direct marketing</li>
                    <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for consent-based processing at any time</li>
                  </ul>
                  
                  <p><strong>How to Exercise Your Rights:</strong> Contact us at datenschutz@alpengetaway.com or use our online privacy center. We will respond within 30 days.</p>
                </div>
                
                <div className="legal-section">
                  <h3>8. International Data Transfers / Internationale Datenübermittlungen</h3>
                  <p>When transferring data outside the EU/EEA, we ensure adequate protection through:</p>
                  <ul>
                    <li><strong>Adequacy Decisions:</strong> Countries with EU-recognized adequate protection levels</li>
                    <li><strong>Standard Contractual Clauses (SCCs):</strong> EU-approved contract templates</li>
                    <li><strong>Binding Corporate Rules:</strong> Internal data protection rules for multinational groups</li>
                    <li><strong>Certification Schemes:</strong> Industry-specific data protection certifications</li>
                    <li><strong>Codes of Conduct:</strong> Industry-wide data protection standards</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>9. Data Security Measures / Datensicherheitsmaßnahmen</h3>
                  <p>We implement comprehensive technical and organizational measures:</p>
                  
                  <div className="legal-highlight">
                    <p><strong>Technical Safeguards:</strong></p>
                  </div>
                  <ul>
                    <li>End-to-end encryption for data transmission (TLS 1.3)</li>
                    <li>AES-256 encryption for data at rest</li>
                    <li>Multi-factor authentication for administrative access</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Secure cloud infrastructure with ISO 27001 certification</li>
                  </ul>
                  
                  <div className="legal-highlight">
                    <p><strong>Organizational Measures:</strong></p>
                  </div>
                  <ul>
                    <li>Regular employee data protection training</li>
                    <li>Strict access controls and need-to-know principles</li>
                    <li>Data processing agreements with all service providers</li>
                    <li>Incident response and breach notification procedures</li>
                    <li>Regular data protection impact assessments</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>10. Cookies & Tracking Technologies / Cookies & Tracking</h3>
                  <p>Our website uses various cookies and tracking technologies:</p>
                  <ul>
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality (no consent needed)</li>
                    <li><strong>Performance Cookies:</strong> Analytics and website optimization (Google Analytics)</li>
                    <li><strong>Marketing Cookies:</strong> Personalized advertising and remarketing (requires consent)</li>
                    <li><strong>Social Media Cookies:</strong> Social sharing and embedded content integration</li>
                  </ul>
                  <p>You can manage cookie preferences through our cookie banner or browser settings.</p>
                </div>
                
                <div className="legal-section">
                  <h3>11. Automated Decision Making / Automatisierte Entscheidungsfindung</h3>
                  <p>We may use automated processing for:</p>
                  <ul>
                    <li><strong>Pricing Algorithms:</strong> Dynamic pricing based on demand and availability</li>
                    <li><strong>Fraud Detection:</strong> Automated risk assessment for payment security</li>
                    <li><strong>Service Matching:</strong> Optimal driver and vehicle assignment</li>
                  </ul>
                  <p>You have the right to request human intervention and challenge automated decisions.</p>
                </div>
                
                <div className="legal-section">
                  <h3>12. Data Breach Procedures / Datenschutzverletzungen</h3>
                  <p>In case of a data breach, we will:</p>
                  <ul>
                    <li>Notify the Austrian Data Protection Authority within 72 hours</li>
                    <li>Inform affected individuals if there's high risk to their rights</li>
                    <li>Document all breaches and remedial actions taken</li>
                    <li>Implement additional safeguards to prevent future incidents</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>13. Children's Privacy / Datenschutz für Kinder</h3>
                  <p>
                    Our services are not directed to children under 16. We do not knowingly collect personal data from children. 
                    If we become aware of such collection, we will delete the data immediately and notify parents/guardians.
                  </p>
                </div>
                
                <div className="legal-contact-box">
                  <h4>14. Contact & Complaints / Kontakt & Beschwerden</h4>
                  <p><strong>Data Protection Officer:</strong> dpo@alpengetaway.com</p>
                  <p><strong>Privacy Team:</strong> datenschutz@alpengetaway.com</p>
                  <p><strong>Phone:</strong> +43 123 456 789 (Privacy Hotline)</p>
                  <p><strong>Postal Address:</strong> Alpen Getaway GmbH, Data Protection, [Address], Austria</p>
                  <p><strong>Response Time:</strong> 30 days maximum (usually within 5 business days)</p>
                  
                  <h4 style={{marginTop: '20px'}}>Supervisory Authority / Aufsichtsbehörde:</h4>
                  <p><strong>Austrian Data Protection Authority (Datenschutzbehörde)</strong></p>
                  <p><strong>Website:</strong> <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer">www.dsb.gv.at</a></p>
                  <p><strong>Address:</strong> Barichgasse 40-42, 1030 Wien, Austria</p>
                  <p><strong>Phone:</strong> +43 1 52 152-0</p>
                </div>
                
                <div className="legal-disclaimer">
                  <p>
                    <strong>Disclaimer:</strong> This GDPR compliance document provides comprehensive data protection information. 
                    Please consult with qualified data protection professionals and legal experts to ensure full compliance 
                    with GDPR and applicable Austrian data protection laws. This document should be regularly reviewed and 
                    updated to reflect changes in data processing activities and legal requirements.
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

export default DSGVO;