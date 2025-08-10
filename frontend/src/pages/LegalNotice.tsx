import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";

const LegalNotice: React.FC = () => {
  const sections = [
    "Company Information",
    "Service Description",
    "Booking Terms & Conditions",
    "Cancellation & Refund Policy",
    "Liability & Limitations",
    "Force Majeure",
    "Intellectual Property",
    "Applicable Law & Jurisdiction",
    "Website Disclaimer",
    "Contact Information"
  ];

  return (
    <>
      <Header />
      <PageHeader 
        title="Legal Notice & General Terms"
        breadcrumb={["Home", "Legal Notice"]}
      />
      
      <div className="legal-content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="legal-document">
                <div className="legal-header">
                  <h1 className="legal-title">Legal Notice & General Terms</h1>
                  <p className="legal-subtitle">
                    Important legal information and terms of service for using Alpen Getaway's transportation services.
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
                
                <div className="legal-contact-box">
                  <h4>1. Company Information</h4>
                  <p><strong>Company Name:</strong> Alpen Getaway GmbH</p>
                  <p><strong>Address:</strong> [Company Address], Austria</p>
                  <p><strong>Phone:</strong> +43 123 456 789</p>
                  <p><strong>Email:</strong> info@alpengetaway.com</p>
                  <p><strong>Commercial Register:</strong> [Registration Number]</p>
                  <p><strong>VAT ID:</strong> [VAT Number]</p>
                  <p><strong>Managing Director:</strong> [Director Name]</p>
                </div>
                
                <div className="legal-section">
                  <h3>2. Service Description</h3>
                  <p>
                    Alpen Getaway provides premium transportation services throughout Austria and neighboring regions. 
                    Our services include:
                  </p>
                  <ul>
                    <li><strong>Airport Transfers:</strong> Professional pickup and drop-off services to/from major airports</li>
                    <li><strong>City Tours:</strong> Guided sightseeing tours with experienced local drivers</li>
                    <li><strong>Business Transportation:</strong> Corporate travel solutions for meetings and events</li>
                    <li><strong>Luxury Vehicle Rentals:</strong> Premium fleet of vehicles with professional chauffeurs</li>
                    <li><strong>Special Events:</strong> Transportation for weddings, celebrations, and special occasions</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>3. Booking Terms & Conditions</h3>
                  <p>By making a booking with Alpen Getaway, you agree to the following conditions:</p>
                  <ul>
                    <li><strong>Availability:</strong> All bookings are subject to vehicle and driver availability</li>
                    <li><strong>Confirmation:</strong> Bookings are confirmed via email or SMS within 24 hours</li>
                    <li><strong>Pricing:</strong> All prices are quoted in Euros and include applicable taxes</li>
                    <li><strong>Payment:</strong> Payment is required at time of booking or as specified in confirmation</li>
                    <li><strong>Changes:</strong> Modifications to bookings must be made at least 6 hours in advance</li>
                    <li><strong>Passenger Limits:</strong> Vehicle capacity must not be exceeded for safety reasons</li>
                  </ul>
                </div>
                
                <div className="legal-highlight">
                  <p>
                    <strong>Important:</strong> Please arrive at the designated pickup location 5 minutes before 
                    your scheduled time. Late arrivals may result in additional waiting charges.
                  </p>
                </div>
                
                <div className="legal-section">
                  <h3>4. Cancellation & Refund Policy</h3>
                  <p>Our cancellation policy is designed to be fair to both customers and service providers:</p>
                  <ul>
                    <li><strong>Free Cancellation:</strong> Cancel up to 24 hours in advance for a full refund</li>
                    <li><strong>Late Cancellation:</strong> Cancellations within 24-6 hours incur a 50% charge</li>
                    <li><strong>Last-Minute Cancellation:</strong> Cancellations within 6 hours incur a 75% charge</li>
                    <li><strong>No-Show:</strong> Failure to appear will result in full charge</li>
                    <li><strong>Emergency Cancellations:</strong> Documented emergencies will be considered case-by-case</li>
                    <li><strong>Weather Conditions:</strong> Severe weather cancellations are refunded in full</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>5. Liability & Limitations</h3>
                  <p>
                    While we maintain comprehensive insurance and safety standards, please note the following liability limitations:
                  </p>
                  <ul>
                    <li><strong>Service Liability:</strong> Our liability is limited to the value of the transportation service provided</li>
                    <li><strong>Personal Property:</strong> We are not responsible for lost, damaged, or stolen personal items</li>
                    <li><strong>Indirect Damages:</strong> We are not liable for consequential, indirect, or punitive damages</li>
                    <li><strong>Flight Delays:</strong> We monitor flights but are not responsible for airline schedule changes</li>
                    <li><strong>Traffic Conditions:</strong> We account for normal traffic but cannot guarantee specific arrival times</li>
                    <li><strong>Insurance Coverage:</strong> All vehicles carry comprehensive commercial insurance</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>6. Force Majeure</h3>
                  <p>
                    We are not liable for any failure to perform our obligations due to events beyond our reasonable control, including:
                  </p>
                  <ul>
                    <li>Natural disasters (earthquakes, floods, severe weather)</li>
                    <li>Government actions, regulations, or travel restrictions</li>
                    <li>Labor strikes or work stoppages</li>
                    <li>Acts of terrorism or civil unrest</li>
                    <li>Technical failures or cyber attacks</li>
                    <li>Pandemic-related restrictions or lockdowns</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>7. Intellectual Property</h3>
                  <p>All content on our website and mobile applications is protected by intellectual property laws:</p>
                  <ul>
                    <li><strong>Trademarks:</strong> "Alpen Getaway" and our logo are registered trademarks</li>
                    <li><strong>Content:</strong> Website content, images, and text are copyrighted material</li>
                    <li><strong>Usage Rights:</strong> Personal use only; commercial use requires written permission</li>
                    <li><strong>Third-Party Content:</strong> Some images and content may be licensed from third parties</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>8. Applicable Law & Jurisdiction</h3>
                  <p>
                    These terms and any disputes arising from our services are governed by Austrian law. 
                    Key jurisdictional points include:
                  </p>
                  <ul>
                    <li><strong>Governing Law:</strong> Austrian federal and state law applies to all services</li>
                    <li><strong>Court Jurisdiction:</strong> Austrian courts have exclusive jurisdiction over disputes</li>
                    <li><strong>EU Consumer Rights:</strong> EU consumer protection laws apply where applicable</li>
                    <li><strong>Mediation:</strong> We encourage alternative dispute resolution before litigation</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>9. Website Disclaimer</h3>
                  <p>
                    Information on our website is provided for general information purposes. Please note:
                  </p>
                  <ul>
                    <li><strong>Accuracy:</strong> We strive for accuracy but cannot guarantee all information is current</li>
                    <li><strong>Third-Party Links:</strong> External links are provided for convenience; we don't control their content</li>
                    <li><strong>Technical Issues:</strong> Website availability may be affected by maintenance or technical problems</li>
                    <li><strong>Updates:</strong> Terms and information may be updated without prior notice</li>
                  </ul>
                </div>
                
                <div className="legal-contact-box">
                  <h4>10. Contact Information</h4>
                  <p><strong>Legal Inquiries:</strong> legal@alpengetaway.com</p>
                  <p><strong>General Support:</strong> support@alpengetaway.com</p>
                  <p><strong>Phone Support:</strong> +43 123 456 789 (24/7)</p>
                  <p><strong>Emergency Line:</strong> +43 123 456 790 (After hours)</p>
                  <p><strong>Postal Address:</strong> Alpen Getaway GmbH, [Company Address], Austria</p>
                  <p><strong>Business Hours:</strong> Monday - Sunday, 24/7 operations</p>
                </div>
                
                <div className="legal-disclaimer">
                  <p>
                    This legal notice serves as a comprehensive overview of our terms and conditions. 
                    Please consult with legal professionals to ensure full compliance with applicable 
                    laws and regulations in your jurisdiction.
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

export default LegalNotice;