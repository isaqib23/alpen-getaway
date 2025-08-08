import React from "react";
import "../assets/css/experienced-drivers.css";
import { Link } from "react-router-dom";
import { strings } from "../lang/about-page";

const teamMembers = [
  {
    name: "john smith",
    role: strings.SENIOR,
    imageSrc: "/img/about_us/driver_1.jpg",
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
  },
  {
    name: "taylor smith",
    role: strings.GUIDE,
    imageSrc: "/img/about_us/driver_2.jpg",
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
  },
  {
    name: "jordan brown",
    role: strings.DISTANCE,
    imageSrc: "/img/about_us/driver_3.jpg",
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
  },
  {
    name: "davis casey",
    role: strings.SPECIALIST,
    imageSrc: "/img/about_us/driver_4.jpg",
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
  },
];

const ExperiencedDrivers: React.FC = () => {
  return (
    <div className="our-team bg-section">
      <div className="container">
        <div className="row align-items-center section-row">
          <div className="col-lg-12">
            <div className="section-title">
              <h3>{strings.DRIVERS_HEADING}</h3>
              <h2>{strings.DRIVERS_DESCRIPTION}</h2>
            </div>
          </div>
        </div>

        <div className="row">
          {teamMembers.map((member, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
              <div className="team-member-item">
                <div className="team-image">
                  <img src={member.imageSrc} alt={member.name} />
                  
                  <div className="team-social-icon">
                    <ul>
                      {member.social.map((social, i) => (
                        <li key={i}>
                          <Link to={social.link} className="social-icon">
                            <i className={social.icon}></i>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="team-content">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperiencedDrivers;
