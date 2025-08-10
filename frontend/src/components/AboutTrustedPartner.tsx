import React from "react";
import { CheckCircle, Smartphone, Clock, Gift, Car } from "lucide-react";
import { strings } from "../lang/about";

const AboutTrustedPartner: React.FC = () => {
  return (
    <section className="trusted-partner-section">
      <style>
        {`
          .about-description-text p {
            font-size: 16px !important;
            line-height: 1.6 !important;
            color: #666 !important;
            font-weight: 400 !important;
            text-transform: none !important;
            margin-bottom: 16px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            display: block !important;
          }
          .about-description-text {
            font-size: 16px !important;
          }
          .trusted-partner-content .description-text p {
            font-size: 16px !important;
            line-height: 1.6 !important;
            color: #666 !important;
            font-weight: 400 !important;
            margin-bottom: 16px !important;
          }
          /* Global fixes for About page body text - ONLY p tags */
          .exclusive-partners .section-title p,
          .vision-mission .section-title p,
          .our-team .section-title p,
          .testimonials .section-title p,
          .vision-mission-content p {
            font-size: 16px !important;
            line-height: 1.6 !important;
            color: #666 !important;
            font-weight: 400 !important;
            margin: 10px 0 !important;
          }
          .vision-mission-list ul li {
            font-size: 16px !important;
            font-weight: 400 !important;
            line-height: 1.6 !important;
          }
          /* Ensure headings remain large and properly styled */
          .section-title h1,
          .section-title h2,
          .section-title h3 {
            font-size: inherit !important;
            font-weight: 700 !important;
            color: #1a1a1a !important;
            margin-bottom: 15px !important;
          }
          .exclusive-partners .section-title h3,
          .vision-mission .section-title h3,
          .our-team .section-title h3,
          .testimonials .section-title h3 {
            font-size: 28px !important;
            font-weight: 700 !important;
            color: #1a1a1a !important;
            padding-left: 0 !important;
            margin-left: 0 !important;
          }
          /* Fix section title alignment and spacing */
          .section-title {
            text-align: center !important;
            margin-bottom: 40px !important;
            padding: 0 !important;
          }
          /* Vision content should be left-aligned */
          .vision-mission-content .section-title {
            text-align: left !important;
          }
          .section-title h3 {
            margin-bottom: 20px !important;
          }
          /* Remove any unwanted left padding/margin */
          .our-projects-nav,
          .vision-mission-box {
            padding-left: 0 !important;
            margin-left: 0 !important;
          }
          /* Add extra spacing for BriefAbout section */
          .our-video.bg-section {
            margin-top: 60px !important;
          }
        `}
      </style>
      <div className="container">
        <div className="row align-items-center">
          {/* Left Side - Images */}
          <div className="col-lg-6">
            <div className="trusted-partner-images">
              <div className="main-image-circle">
                <img 
                  src="/img/about_us/driver_1.jpg" 
                  alt="Professional Driver" 
                  className="img-fluid" 
                />
              </div>
              <div className="secondary-image-circle">
                <img 
                  src="/img/about_us/driver_2.jpg" 
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
              <div className="section-header">
                <span className="subtitle">{strings.ABOUT}</span>
                <h2 className="section-title">
                  {strings.HEADING}
                </h2>
              </div>

              {/* Description Text - Body Content */}
              <div className="description-text about-description-text" style={{ marginBottom: '30px' }}>
                <p>
                  {strings.DESCRIPTION}
                </p>
                <p>
                  {strings.PARA1}
                </p>
                <p>
                  {strings.PARA2}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTrustedPartner;
