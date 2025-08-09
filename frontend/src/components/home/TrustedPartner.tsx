import React from "react";
import { CheckCircle, Smartphone, Clock, Gift, Car } from "lucide-react";
import "../../assets/css/trusted-partner.css";

const TrustedPartner: React.FC = () => {
  return (
    <section className="trusted-partner-section">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Side - Images */}
          <div className="col-lg-6">
            <div className="trusted-partner-images">
              <div className="main-image-circle">
                <img 
                  src="/assets/images/about_us/driver_1.jpg" 
                  alt="Professional Driver" 
                  className="img-fluid" 
                />
              </div>
              <div className="secondary-image-circle">
                <img 
                  src="/assets/images/about_us/driver_2.jpg" 
                  alt="Happy Customer" 
                  className="img-fluid" 
                />
              </div>
              <div className="star-decoration">
                ✦
              </div>
              <div className="red-asterisk">*</div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="col-lg-6">
            <div className="trusted-partner-content">
              <div className="section-title">
                <h3>Easy & Reliable Services in the Booking Industry</h3>
                <h2>
                  Your trusted partner in 
                  <span className="highlight-box">reliable car rental</span>
                </h2>
              </div>

              <div className="features-list">
                {/* Simple Booking System */}
                <div className="feature-item">
                  <div className="feature-icon">
                    <Smartphone size={20} />
                  </div>
                  <div className="feature-content">
                    <p className="feature-description">We have a very simple, comfortable & accessible Transfer Booking system in the Market</p>
                  </div>
                </div>

                {/* Optimized System */}
                <div className="feature-item">
                  <div className="feature-icon">
                    <Clock size={20} />
                  </div>
                  <div className="feature-content">
                    <p className="feature-description">We have Optimized the booking system to mobile, tablet & Pcs so that our clients can experience the easiest and the safest way</p>
                  </div>
                </div>

                {/* Simplified Process */}
                <div className="feature-item">
                  <div className="feature-icon">
                    <Car size={20} />
                  </div>
                  <div className="feature-content">
                    <p className="feature-description">We have simplified the booking process so that our client can pick their chosen destinations easily</p>
                  </div>
                </div>

                {/* Additional Services */}
                <div className="feature-item">
                  <div className="feature-icon">
                    <Gift size={20} />
                  </div>
                  <div className="feature-content">
                    <p className="feature-description">We offer free child seats, Special person Equipments, Ski Equipments, free cancelation, free booking management services & much more...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartner;
