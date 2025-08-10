import React from "react";
import { Link } from "react-router-dom";
import { strings } from "../lang/brief-about";

const BriefAbout: React.FC = () => {
  const navData = [
    {
      id: "B2B",
      title: strings.B2B_TITLE,
      content: strings.B2B_CONTENT,
      buttonLink: "/b2b",
      active: true,
    },
    {
      id: "Affiliate",
      title: strings.AFFILIATE_TITLE,
      content: strings.AFFILIATE_CONTENT,
      buttonLink: "/affiliate",
      active: false,
    },
  ];

  return (
    <>
      <style>{`
        /* Reset and override any global styles affecting this section */
        .brief-about-section * {
          box-sizing: border-box;
        }
        
        .brief-about-section .vision-mission-box {
          max-width: 100%;
          margin: 0 auto;
        }
        
        .brief-about-section .tab-pane {
          text-align: center;
          padding: 40px 0;
          width: 100%;
        }
        
        .brief-about-section .vision-mission-content {
          width: 100%;
          margin-bottom: 40px;
        }
        
        /* Strong override for paragraph content to ensure it appears as body text */
        .brief-about-section .vision-mission-content p {
          text-align: center !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 auto 30px auto !important;
          font-size: 18px !important;
          line-height: 1.8 !important;
          color: #555 !important;
          padding: 0 20px !important;
          font-weight: 400 !important;
          text-transform: none !important;
          letter-spacing: normal !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          display: block !important;
        }
        
        /* Ensure no heading styles leak through */
        .brief-about-section .vision-mission-content p,
        .brief-about-section .vision-mission-content p *,
        .brief-about-section .tab-pane p,
        .brief-about-section .tab-pane p * {
          font-size: 18px !important;
          font-weight: 400 !important;
          line-height: 1.8 !important;
          color: #555 !important;
          text-transform: none !important;
          letter-spacing: normal !important;
          text-decoration: none !important;
        }
        
        /* Override any section-title global styles that might affect content */
        .brief-about-section .section-title h2,
        .brief-about-section h1,
        .brief-about-section h2,
        .brief-about-section h3,
        .brief-about-section h4,
        .brief-about-section h5,
        .brief-about-section h6 {
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
        }
        
        .brief-about-section .btn-default {
          background-color: var(--accent-color);
          color: white;
          padding: 15px 40px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          transition: all 0.3s ease;
          border: none;
          font-size: 16px;
        }
        
        .brief-about-section .btn-default:hover {
          background-color: var(--primary-color);
          color: white;
          text-decoration: none;
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .brief-about-section .tab-pane {
            padding: 30px 0;
          }
          
          .brief-about-section .vision-mission-content p,
          .brief-about-section .vision-mission-content p *,
          .brief-about-section .tab-pane p,
          .brief-about-section .tab-pane p * {
            font-size: 16px !important;
            margin-bottom: 25px !important;
            padding: 0 15px !important;
          }
          
          .brief-about-section .btn-default {
            padding: 12px 30px;
            font-size: 15px;
          }
        }
        
        @media (max-width: 480px) {
          .brief-about-section .vision-mission-content p,
          .brief-about-section .vision-mission-content p *,
          .brief-about-section .tab-pane p,
          .brief-about-section .tab-pane p * {
            font-size: 15px !important;
            padding: 0 10px !important;
          }
        }
      `}</style>
      <div className="our-video bg-section brief-about-section" style={{ paddingTop: '80px' }}>
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <div className="section-title" style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '28px', fontWeight: '700' }}>{strings.HEADING}</h3>
                <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#333', margin: '0 auto', maxWidth: '800px' }}>{strings.SUBTITLE}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="our-projects-nav">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  {navData.map((item, index) => (
                    <li className="nav-item" role="presentation" key={index}>
                      <button
                        className={`nav-link ${item.active ? "active" : ""}`}
                        id={`${item.id}-tab`}
                        data-bs-toggle="tab"
                        data-bs-target={`#${item.id}`}
                        type="button"
                        role="tab"
                        aria-selected={item.active}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="vision-mission-box tab-content" id="myTabContent">
                {navData.map((item, index) => (
                  <div
                    className={`tab-pane fade ${
                      item.active ? "show active" : ""
                    }`}
                    id={item.id}
                    role="tabpanel"
                    key={index}
                  >
                    <div className="vision-mission-content">
                      <p>{item.content}</p>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                      <Link 
                        to={item.buttonLink} 
                        className="btn-default"
                      >
                        {strings.BUTTON}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BriefAbout;
