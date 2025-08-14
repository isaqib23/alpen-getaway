import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";
import driver1Img from "../assets/images/about_us/driver_1.jpg";
import driver2Img from "../assets/images/about_us/driver_2.jpg";
import driver3Img from "../assets/images/about_us/driver_3.jpg";
import driver4Img from "../assets/images/about_us/driver_4.jpg";


interface Testimonial {
  name: string;
  position: string;
  rating: number;
  content: string;
  image: string;
  delay: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Floyd Miles",
    position: "Rental Sales Agent",
    rating: 5,
    content:
      "The quality and reliability are top-notch, and the team behind it is always ready to assist with any questions or issues. Highly recommended!",
    image: driver1Img,
    delay: 0,
  },
  {
    name: "Annette Black",
    position: "Service Representative",
    rating: 4,
    content:
      "The quality and reliability are top-notch, and the team behind it is always ready to assist with any questions or issues. Highly recommended!",
    image: driver2Img,
    delay: 0.2,
  },
  {
    name: "Leslie Alexander",
    position: "Reservation Agent",
    rating: 5,
    content:
      "The quality and reliability are top-notch, and the team behind it is always ready to assist with any questions or issues. Highly recommended!",
    image: driver3Img,
    delay: 0.4,
  },
  {
    name: "Alis White",
    position: "Counter Agent",
    rating: 3,
    content:
      "The quality and reliability are top-notch, and the team behind it is always ready to assist with any questions or issues. Highly recommended!",
    image: driver4Img,
    delay: 0,
  },
  {
    name: "Sophia Thompson",
    position: "Service Representative",
    rating: 5,
    content:
      "The quality and reliability are top-notch, and the team behind it is always ready to assist with any questions or issues. Highly recommended!",
    image: driver1Img,
    delay: 0.2,
  },
  {
    name: "Luna Vega",
    position: "Branch Representative",
    rating: 5,
    content:
      "The quality and reliability are top-notch, and the team behind it is always ready to assist with any questions or issues. Highly recommended!",
    image: driver2Img,
    delay: 0.4,
  },
  {
    name: "Aurora Wynn",
    position: "Relations Coordinator",
    rating: 4,
    content:
      "The quality and reliability are top-notch, and the team behind it is always ready to assist with any questions or issues. Highly recommended!",
    image: driver3Img,
    delay: 0,
  },
  {
    name: "Juniper Monroe",
    position: "Experience Manager",
    rating: 5,
    content:
      "The quality and reliability are top-notch, and the team behind it is always ready to assist with any questions or issues. Highly recommended!",
    image: driver4Img,
    delay: 0.2,
  },
  {
    name: "Daisy Meadows",
    position: "Service Desk Associate",
    rating: 3,
    content:
      "The quality and reliability are top-notch, and the team behind it is always ready to assist with any questions or issues. Highly recommended!",
    image: driver1Img,
    delay: 0.4,
  },
];

const TestimonialItems: React.FC = () => {
  const isLaptop = useMediaQuery({ query: "(min-width : 992px)" });

  return (
    <div className="page-testimonials">
      <div className="container">
        <div className="row">
          {testimonials.map((testimonial, index) => {
            const { ref, inView } = useInView({
              triggerOnce: true,
              threshold: 0.05,
            });

            return (
              <div className="col-lg-4 col-md-6" key={index}>
                <motion.div
                  ref={ref}
                  className="testimonial-item page-testimonial-box"
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={
                    isLaptop
                      ? { delay: testimonial.delay, duration: 0.5 }
                      : { delay: 0.2, duration: 0.5 }
                  }
                >
                  <div className="testimonial-header">
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-${
                            i < testimonial.rating ? "solid" : "regular"
                          } fa-star`}
                        />
                      ))}
                    </div>
                    <div className="testimonial-content">
                      <p>{testimonial.content}</p>
                    </div>
                  </div>
                  <div className="testimonial-body">
                    <div className="author-image">
                      <figure className="image-anime">
                        <img src={testimonial.image} alt={testimonial.name} />
                      </figure>
                    </div>
                    <div className="author-content">
                      <h3>{testimonial.name}</h3>
                      <p>{testimonial.position}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestimonialItems;
