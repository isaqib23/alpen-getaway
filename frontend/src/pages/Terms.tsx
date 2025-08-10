import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";

const Terms: React.FC = () => {
  const sections = [
    "Service Agreement",
    "Booking & Reservations",
    "Payment Terms",
    "Cancellation Policy",
    "User Responsibilities",
    "Service Limitations",
    "Liability & Insurance",
    "Dispute Resolution",
    "Modifications to Terms",
    "Contact Information"
  ];

  return (
    <>
      <Header />
      <PageHeader 
        title="Terms of Service"
        breadcrumb={["Home", "Terms"]}
      />
      
      <div className="legal-content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="legal-document">
                <div className="legal-header">
                  <h1 className="legal-title">Terms of Service</h1>
                  <p className="legal-subtitle">
                    Please read these terms and conditions carefully before using our transportation services.
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
                  <h3>1. Service Agreement</h3>
                  <p>
                    By using Alpen Getaway's transportation services, you agree to be bound by these Terms of Service. 
                    Our services include private transfers, airport shuttles, and customized transportation solutions 
                    throughout Austria and neighboring regions.
                  </p>
                  <p>
                    These terms constitute a legally binding agreement between you and Alpen Getaway GmbH. 
                    If you do not agree to these terms, please do not use our services.
                  </p>
                </div>
                
                <div className="legal-section">
                  <h3>2. Booking & Reservations</h3>
                  <p>
                    All bookings must be made through our official website, mobile app, or authorized booking partners.
                  </p>
                  <ul>
                    <li>Advance booking is recommended, especially during peak seasons</li>
                    <li>All booking details must be accurate and complete</li>
                    <li>Confirmation will be sent via email within 24 hours</li>
                    <li>Special requirements should be communicated at the time of booking</li>
                    <li>Group bookings (8+ passengers) require 48-hour advance notice</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>3. Payment Terms</h3>
                  <p>
                    Payment is required to confirm your booking and secure your transportation service.
                  </p>
                  <ul>
                    <li>We accept major credit cards, bank transfers, and digital payment methods</li>
                    <li>Payment is processed securely through encrypted channels</li>
                    <li>Full payment is due at the time of booking unless otherwise arranged</li>
                    <li>Corporate accounts may be eligible for invoicing arrangements</li>
                    <li>All prices include applicable taxes unless stated otherwise</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>4. Cancellation Policy</h3>
                  <p>
                    We understand that travel plans can change. Our cancellation policy is designed to be fair while 
                    allowing us to manage our fleet efficiently.
                  </p>
                  <ul>
                    <li><strong>Free cancellation:</strong> Up to 24 hours before departure</li>
                    <li><strong>50% refund:</strong> 12-24 hours before departure</li>
                    <li><strong>25% refund:</strong> 6-12 hours before departure</li>
                    <li><strong>No refund:</strong> Less than 6 hours before departure or no-show</li>
                    <li>Emergency situations will be evaluated on a case-by-case basis</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>5. User Responsibilities</h3>
                  <p>
                    As a passenger, you agree to:
                  </p>
                  <ul>
                    <li>Be ready at the designated pickup location at the scheduled time</li>
                    <li>Provide accurate contact information and respond to driver communications</li>
                    <li>Treat our vehicles and drivers with respect</li>
                    <li>Follow all safety instructions and wear seatbelts</li>
                    <li>Not consume alcohol or use illegal substances in our vehicles</li>
                    <li>Inform us of any special needs or medical conditions that may affect the journey</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>6. Service Limitations</h3>
                  <p>
                    While we strive to provide excellent service, certain limitations apply:
                  </p>
                  <ul>
                    <li>Services may be affected by weather conditions, traffic, or unforeseen circumstances</li>
                    <li>We cannot guarantee exact arrival times due to traffic variables</li>
                    <li>Vehicle substitution may occur for operational reasons</li>
                    <li>Services are subject to driver availability and vehicle capacity</li>
                    <li>We reserve the right to refuse service for safety or operational reasons</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>7. Liability & Insurance</h3>
                  <p>
                    Alpen Getaway maintains comprehensive insurance coverage for all our vehicles and operations.
                  </p>
                  <ul>
                    <li>All vehicles are fully insured for passenger transportation</li>
                    <li>Our liability is limited to direct damages as defined by Austrian law</li>
                    <li>Personal belongings are the responsibility of the passenger</li>
                    <li>We recommend travel insurance for international journeys</li>
                    <li>Claims must be reported within 48 hours of the incident</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>8. Dispute Resolution</h3>
                  <p>
                    We are committed to resolving any disputes fairly and efficiently:
                  </p>
                  <ul>
                    <li>Contact our customer service team first for immediate resolution</li>
                    <li>Formal complaints should be submitted in writing within 30 days</li>
                    <li>Mediation services are available for unresolved disputes</li>
                    <li>Austrian law governs all disputes and legal proceedings</li>
                    <li>Courts in Salzburg, Austria have exclusive jurisdiction</li>
                  </ul>
                </div>
                
                <div className="legal-section">
                  <h3>9. Modifications to Terms</h3>
                  <p>
                    These terms may be updated periodically to reflect changes in our services or legal requirements.
                  </p>
                  <ul>
                    <li>Updates will be posted on our website with the effective date</li>
                    <li>Significant changes will be communicated via email to registered users</li>
                    <li>Continued use of our services constitutes acceptance of updated terms</li>
                    <li>Previous versions are archived and available upon request</li>
                  </ul>
                </div>
                
                <div className="legal-contact-box">
                  <h4>10. Contact Information</h4>
                  <p><strong>Customer Service:</strong> support@alpengetaway.com</p>
                  <p><strong>Phone:</strong> +43 123 456 789</p>
                  <p><strong>Address:</strong> Alpen Getaway GmbH, [Company Address], Austria</p>
                  <p><strong>Business Hours:</strong> Monday - Sunday, 6:00 AM - 11:00 PM</p>
                  <p><strong>Emergency Line:</strong> +43 123 456 700 (24/7)</p>
                </div>
                
                <div className="legal-disclaimer">
                  <p>
                    These terms and conditions are subject to Austrian law. Please consult with legal 
                    professionals if you have questions about your rights and obligations.
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

export default Terms;
