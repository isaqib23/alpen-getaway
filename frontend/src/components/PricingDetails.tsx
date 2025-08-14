import React from "react";
import { Link } from "react-router-dom";
import eClassImg from "../assets/images/our_fleet/transparent_car_images/e_class.png";
import sClassImg from "../assets/images/our_fleet/transparent_car_images/s_class.png";
import vClassImg from "../assets/images/our_fleet/transparent_car_images/v_class.png";


const pricingItems = [
  {
    image: eClassImg,
    title: "Luxury Car",
    description: "Premium comfort and elegance for your special occasions and business trips.",
    price: 29,
    delay: 0,
  },
  {
    image: sClassImg,
    title: "Convertible Car",
    description: "Experience the thrill of open-air driving with our premium convertible fleet.",
    price: 49,
    delay: 0.25,
    highlighted: true,
  },
  {
    image: vClassImg,
    title: "Sport Car",
    description: "High-performance vehicles designed for adrenaline seekers and speed enthusiasts.",
    price: 79,
    delay: 0.5,
  },
];

const PricingDetails: React.FC = () => {
  return (
    <div className="page-pricing">
      <div className="container">
        <div className="row">
          {pricingItems.map((item, index) => {
            return (
              <div className="col-lg-4" key={index}>
                <div
                  className={`pricing-item ${
                    item.highlighted ? "highlighted-box" : ""
                  }`}
                >
                  <div className="pricing-item-image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="pricing-item-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <h2>
                      ${item.price}
                      <sub>/hour</sub>
                    </h2>
                  </div>

                  <div className="pricing-item-btn">
                    <Link
                      to="#"
                      className={`btn-default ${
                        item.highlighted ? "btn-highlighted" : ""
                      }`}
                    >
                      Book Rental
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PricingDetails;
