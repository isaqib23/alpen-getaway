import React from "react";
import { CheckCircle, Smartphone, Clock, Gift, Car } from "lucide-react";
import { strings } from "../../lang/trusted-partner";

const TrustedPartner: React.FC = () => {
  return (
    <section className="trusted-partner-section">
      <div className="container">
        <div className="trusted-partner-layout">
          {/* Title Section */}
          <div className="section-title">
            <h3>{strings.SUBTITLE}</h3>
            <h2>
              {strings.TITLE}
              <span className="highlight-box">{strings.TITLE_HIGHLIGHT}</span>
            </h2>
          </div>

          {/* Images Section */}
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

          {/* Features Grid */}
          <div className="trusted-partner-content">
            <div className="features-list">
              {/* Simple Booking System */}
              <div className="feature-item">
                <div className="feature-icon">
                  <Smartphone size={18} />
                </div>
                <div className="feature-content">
                  <p className="feature-description">{strings.EASY_BOOKING_STATUS}</p>
                </div>
              </div>

              {/* Optimized System */}
              <div className="feature-item">
                <div className="feature-icon">
                  <Clock size={18} />
                </div>
                <div className="feature-content">
                  <p className="feature-description">{strings.EASY_BOOKING_DESC}</p>
                </div>
              </div>

              {/* Simplified Process */}
              <div className="feature-item">
                <div className="feature-icon">
                  <Car size={18} />
                </div>
                <div className="feature-content">
                  <p className="feature-description">{strings.CONVENIENT_DESC}</p>
                </div>
              </div>

              {/* Additional Services */}
              <div className="feature-item">
                <div className="feature-icon">
                  <Gift size={18} />
                </div>
                <div className="feature-content">
                  <p className="feature-description">{strings.ADDITIONAL_SERVICES}</p>
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
