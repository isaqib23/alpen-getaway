import React from "react";
import { strings } from "../../lang/airport-transfer";
import "../../assets/css/airport-transfer.css";

const airports = [
  {
    id: "salzburg",
    title: strings.SALZBURG_TITLE,
    location: "Salzburg, Austria",
    image: "/assets/images/airport_images/salzburg/salzburg_main_image.jpg"
  },
  {
    id: "munich",
    title: strings.MUNICH_TITLE,
    location: "Munich, Germany",
    image: "/assets/images/airport_images/munich/munich_main_image.jpg"
  },
  {
    id: "innsbruck",
    title: strings.INNSBRUCK_TITLE,
    location: "Innsbruck, Austria",
    image: "/assets/images/airport_images/innsbruck/main_image_innsbruck.jpg"
  },
  {
    id: "zurich",
    title: strings.ZURICH_TITLE,
    location: "Zurich, Switzerland",
    image: "/assets/images/airport_images/zurich/zurich_main_image.jpg"
  }
];

const AirportTransfer: React.FC = () => {
  return (
    <section className="airport-transfer-section">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            <div className="section-title text-center">
              <h3>{strings.SECTION_SUBTITLE}</h3>
              <h2>{strings.SECTION_TITLE}</h2>
              <p>{strings.SECTION_DESCRIPTION}</p>
            </div>
          </div>
        </div>

        <div className="row">
          {airports.map((airport, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
              <div className="airport-card">
                <div className="airport-image">
                  <img src={airport.image} alt={airport.title} />
                </div>
                <div className="airport-content">
                  <div className="airport-location">{airport.location}</div>
                  <h3>{airport.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AirportTransfer;
