import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { strings } from "../lang/testiomonials";
import { getApprovedReviews } from "../services/PublicContentService";

interface Review {
  id: string;
  rating: number;
  comment: string;
  customerName: string;
  status: string;
  createdAt: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      rating: 5,
      text: strings.TEXT,
      author: "floyd miles",
      position: strings.MANAGER,
      image: "/assets/images/about_us/driver_1.jpg",
    },
    {
      id: 2,
      rating: 4,
      text: strings.TEXT,
      author: "annette black",
      position: strings.MANAGER,
      image: "/assets/images/about_us/driver_2.jpg",
    },
    {
      id: 3,
      rating: 3,
      text: strings.TEXT,
      author: "leslie alexander",
      position: strings.MANAGER,
      image: "/assets/images/about_us/driver_3.jpg",
    },
    {
      id: 4,
      rating: 5,
      text: strings.TEXT,
      author: "alis white",
      position: strings.MANAGER,
      image: "/assets/images/about_us/driver_4.jpg",
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [serverReviews, setServerReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const reviewData = await getApprovedReviews(1, 8); // Get up to 8 reviews
        if (reviewData?.items && reviewData.items.length > 0) {
          setServerReviews(reviewData.items);
          
          // Transform server reviews to testimonial format
          const transformedReviews = reviewData.items.map((review: Review, index: number) => ({
            id: review.id || `server-${index}`,
            rating: review.rating || 5,
            text: review.comment || strings.TEXT,
            author: review.customerName || "Customer",
            position: "Verified Customer",
            image: `/assets/images/about_us/driver_${(index % 4) + 1}.jpg`, // Cycle through available images
            isServerData: true,
          }));
          
          // Use server data if available, otherwise keep static data
          if (transformedReviews.length > 0) {
            setTestimonials(transformedReviews);
          }
        }
      } catch (error) {
        console.warn('Failed to load reviews for testimonials:', error);
        // Keep static testimonials as fallback
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  return (
    <div className="our-testimonial">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            <div className="section-title" style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '28px', fontWeight: '700' }}>{strings.HEADING}</h3>
              <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#333', margin: '0 auto', maxWidth: '800px' }}>{strings.DESCRIPTION}</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="testimonial-slider">
              <Swiper
                modules={[Navigation, Scrollbar, Autoplay]}
                navigation={{
                  prevEl: ".testimonial-button-prev",
                  nextEl: ".testimonial-button-next",
                }}
                scrollbar={{ draggable: true }}
                loop={true}
                effect="slide"
                speed={1500}
                autoplay={{ delay: 3000 }}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                  },
                  991: {
                    slidesPerView: 3,
                  },
                }}
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="testimonial-item">
                      <div className="testimonial-header">
                        <div className="testimonial-rating">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <i
                              key={index}
                              className={`fa${
                                testimonial.rating > index
                                  ? "-solid"
                                  : "-regular"
                              } fa-star`}
                            ></i>
                          ))}
                        </div>
                        <div className="testimonial-content">
                          <p>{testimonial.text}</p>
                        </div>
                      </div>
                      <div className="testimonial-body">
                        <div className="author-image">
                          <img
                            src={testimonial.image}
                            alt={testimonial.author}
                          />
                        </div>
                        <div className="author-content">
                          <h3>{testimonial.author}</h3>
                          <p>{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="testimonial-btn">
                <div className="testimonial-button-prev"></div>
                <div className="testimonial-button-next"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
