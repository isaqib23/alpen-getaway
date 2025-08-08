import React from "react";
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
    <div className="exclusive-partners bg-section">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            <div className="section-title">
              <h3>{strings.PARTNERS_HEADING}</h3>
              <h2>{strings.PARTNERS_DESCRIPTION}</h2>
              <p>{strings.FLEXIBILITY}</p>
              <p>{strings.FREE_CANCELLATION}</p>
            </div>
          </div>
        </div>

        <div className="row">
          {logosFirst.map((src, index) => (
            <div className="col-lg-3 col-6" key={index}>
              <div className="partners-logo">
                <img
                  src={bookcarsHelper.joinURL(env.CDN_USERS, src)}
                  alt="logo"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="row">
          {logosLast.map((src, index) => (
            <div className="col-lg-3 col-6" key={index}>
              <div className="partners-logo">
                <img
                  src={bookcarsHelper.joinURL(env.CDN_USERS, src)}
                  alt="logo"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;
