import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import driver1Img from "../assets/images/about_us/driver_1.jpg";
import driver2Img from "../assets/images/about_us/driver_2.jpg";
import driver3Img from "../assets/images/about_us/driver_3.jpg";
import driver4Img from "../assets/images/about_us/driver_4.jpg";

const teamMembers = [
  {
    name: "john smith",
    role: "senior chauffeur",
    imageSrc: driver1Img,
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
    delay: 0,
  },
  {
    name: "taylor smith",
    role: "city tour guide",
    imageSrc: driver2Img,
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
    delay: 0.25,
  },
  {
    name: "jordan brown",
    role: "distance driver",
    imageSrc: driver3Img,
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
    delay: 0.5,
  },
  {
    name: "davis casey",
    role: "travel specialist",
    imageSrc: driver4Img,
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
    delay: 0.75,
  },
  {
    name: "morgan lee",
    role: "travel consultant",
    imageSrc: driver1Img,
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
    delay: 0,
  },
  {
    name: "carlos mendes",
    role: "airport transfer",
    imageSrc: driver2Img,
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
    delay: 0.25,
  },
  {
    name: "riley walker",
    role: "executive chauffeur",
    imageSrc: driver3Img,
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
    delay: 0.5,
  },
  {
    name: "avery hall",
    role: "shuttle driver",
    imageSrc: driver4Img,
    social: [
      { icon: "fa-brands fa-facebook-f", link: "#" },
      { icon: "fa-brands fa-youtube", link: "#" },
      { icon: "fa-brands fa-instagram", link: "#" },
      { icon: "fa-brands fa-x-twitter", link: "#" },
    ],
    delay: 0.75,
  },
];

const DestinationsContent: React.FC = () => {
  const isLaptop = useMediaQuery({ query: "(min-width: 992px)" });

  return (
    <div className="our-team bg-section">
      <div className="container">
        {/* Driver Section - Commented Out */}
        {/*
        <div className="row">
          {teamMembers.map((member, index) => {
            const [ref, inView] = useInView({
              triggerOnce: true,
              threshold: isLaptop ? 0.05 : 0.1,
            });

            return (
              <div className="col-lg-3 col-md-6" key={index}>
                <motion.div
                  ref={ref}
                  className="team-member-item"
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: isLaptop ? member.delay : 0,
                  }}
                >
                  <div className="team-image">
                    <figure className="image-anime">
                      <img src={member.imageSrc} alt={member.name} />
                    </figure>

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
                </motion.div>
              </div>
            );
          })}
        </div>
        */}
      </div>
    </div>
  );
};

export default DestinationsContent;
