import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/vision-mission.css";
import { strings } from "../lang/brief-about";

const BriefAbout: React.FC = () => {
  const navData = [
    {
      id: "B2B",
      title: strings.B2B_TITLE,
      content: strings.B2B_CONTENT,
      buttonLink: "#",
      active: true,
    },
    {
      id: "Affiliate",
      title: strings.AFFILIATE_TITLE,
      content: strings.AFFILIATE_CONTENT,
      buttonLink: "#",
      active: false,
    },
  ];

  return (
    <div className="our-video bg-section">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            <div className="section-title">
              <h3>{strings.HEADING}</h3>
              <h2>{strings.SUBTITLE}</h2>
            </div>
          </div>
        </div>

        <div className="row">
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
                <Link to={item.buttonLink} className="btn-default">
                  {strings.BUTTON}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefAbout;
