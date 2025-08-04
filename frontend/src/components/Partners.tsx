import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/services-partners.css";
import * as bookcarsHelper from "../utils/bookcars-helper";
import env from "../config/env.config";
import { strings } from "../lang/about-page";

const logosFirst = [
  "628a51a1572a010c6b5d1a10_1653234381569.png",
  "628a52a7572a010c6b5d1ae3_1653232295181.gif",
  "628a51b9572a010c6b5d1a2b_1653232057718.gif",
  "628a5222572a010c6b5d1a5c_1653232162168.png",
];

const logosLast = [
  "628a527e572a010c6b5d1aad_1656843212134.png",
  "628a5244572a010c6b5d1a79_1653232196322.png",
  "628a5255572a010c6b5d1a92_1653232213486.png",
  "628a52a7572a010c6b5d1ae3_1653232295181.gif",
];

const Partners: React.FC = () => {
  return (
    <>
      <style>{`
        .manage-booking-btn {
          background-color: var(--accent-color);
          color: white;
          padding: 12px 30px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          transition: all 0.3s ease;
          border: none;
          font-size: 16px;
          margin-top: 20px;
        }
        
        .manage-booking-btn:hover {
          background-color: var(--primary-color);
          color: white;
          text-decoration: none;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .flexibility-section {
          background-color: #f8f9fa;
          padding: 30px;
          border-radius: 10px;
          margin: 20px 0;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .manage-booking-btn {
            padding: 10px 25px;
            font-size: 15px;
          }
          
          .flexibility-section {
            padding: 20px;
            margin: 15px 0;
          }
        }
      `}</style>
      <div className="exclusive-partners bg-section">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <div className="section-title">
                <h3>{strings.PARTNERS_HEADING}</h3>
                <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#333', margin: '10px 0' }}>{strings.PARTNERS_DESCRIPTION}</p>
                
                {/* Flexibility Section with Manage My Booking Button */}
                <div className="flexibility-section">
                  <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', margin: '0 0 20px 0', fontWeight: '400' }}>
                    {strings.FLEXIBILITY}
                  </p>
                  <Link 
                    to="/booking-management" 
                    className="manage-booking-btn"
                  >
                    Manage My Booking
                  </Link>
                </div>
                
                <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', margin: '10px 0', fontWeight: '400' }}>{strings.FREE_CANCELLATION}</p>
              </div>
            </div>
          </div>

          {/* Logos removed as requested */}
        </div>
      </div>
    </>
  );
};

export default Partners;
