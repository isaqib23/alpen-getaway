import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation, Pagination, Scrollbar, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useInView } from "react-intersection-observer";
import { 
  HiOutlineUsers, 
  HiOutlineViewfinderCircle, 
  HiOutlineWifi, 
  HiOutlineCog6Tooth,
  HiOutlineArrowRight 
} from "react-icons/hi2";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../../assets/css/home-fleets.css";
import TextAnime from "../animations/TextAnime";
import { Link } from "react-router-dom";
import * as bookcarsTypes from "../../types/bookcars-types";
import * as CarService from '../../services/CarService';
import * as SupplierService from '../../services/SupplierService';
import * as helper from '../../common/helper';

import { strings } from "../../lang/fleets";

const HomeFleets: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [cars, setCars] = useState<bookcarsTypes.Car[]>([]);
  const [loading, setLoading] = useState(true);

  const getCarTypeLabel = (carType: bookcarsTypes.CarType) => {
    switch (carType) {
      case bookcarsTypes.CarType.Diesel:
        return 'Diesel';
      case bookcarsTypes.CarType.Gasoline:
        return 'Gasoline';
      case bookcarsTypes.CarType.Electric:
        return 'Electric';
      case bookcarsTypes.CarType.Hybrid:
        return 'Hybrid';
      case bookcarsTypes.CarType.PlugInHybrid:
        return 'Plug-in Hybrid';
      case bookcarsTypes.CarType.Unknown:
        return 'Unknown';
      default:
        return 'Car';
    }
  };

  const getGearboxLabel = (gearbox: bookcarsTypes.GearboxType) => {
    switch (gearbox) {
      case bookcarsTypes.GearboxType.Automatic:
        return strings.AUTOMATIC;
      case bookcarsTypes.GearboxType.Manual:
        return 'Manual';
      default:
        return strings.AUTOMATIC;
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchCars = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        console.log('Fetching cars for home page...');
        
        // First get all suppliers
        const suppliersData = await SupplierService.getAllSuppliers();
        console.log('Suppliers data:', suppliersData);
        
        if (!isMounted) return;
        
        if (suppliersData && suppliersData.length > 0) {
          const supplierIds = suppliersData.map(supplier => supplier._id!);
          console.log('Supplier IDs:', supplierIds);
          
          const payload: bookcarsTypes.GetCarsPayload = {
            suppliers: supplierIds,
          };
          
          console.log('Fetching cars with payload:', payload);
          
          // Fetch cars from the database
          const data = await CarService.getCars(payload, 1, 10);
          console.log('Cars data response:', data);
          
          if (!isMounted) return;
          
          const _data = data && data.length > 0 ? data[0] : { pageInfo: { totalRecord: 0 }, resultData: [] };
          
          if (_data && _data.resultData && _data.resultData.length > 0) {
            console.log('Setting cars:', _data.resultData);
            setCars(_data.resultData);
          } else {
            console.log('No cars found in result data');
            setCars([]);
          }
        } else {
          console.log('No suppliers found');
          if (isMounted) {
            setCars([]);
          }
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        helper.error(err);
        if (isMounted) {
          setCars([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCars();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="perfect-fleet bg-section">
      <div className="container-fluid">
        <div className="row section-row">
          <div className="col-lg-12">
            <div className="section-title" ref={ref}>
              {/* Apply animation only once when in view */}
              {inView && (
                <motion.h3
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {strings.HEADING}
                </motion.h3>
              )}
              <TextAnime className="text-anime-style-3" tag="h2">
                {strings.DESCRIPTION}
              </TextAnime>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="car-details-slider">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">Loading cars...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading our fleet...</p>
                  </div>
                </div>
              ) : cars.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                  spaceBetween={30}
                  slidesPerView={1}
                  loop={true}
                  effect="slide"
                  speed={1500}
                  autoplay={{ delay: 3000 }}
                  navigation={{
                    nextEl: ".car-button-next",
                    prevEl: ".car-button-prev",
                  }}
                  scrollbar={{ draggable: true }}
                  breakpoints={{
                    768: {
                      slidesPerView: 2,
                    },
                    991: {
                      slidesPerView: 3,
                    },
                    1300: {
                      slidesPerView: 4,
                    },
                    1600: {
                      slidesPerView: 5,
                    },
                  }}
                >
                  {cars.map((car, index) => (
                    <SwiperSlide key={index} data-cursor-text="Drag">
                      <div className="perfect-fleet-item">
                        <div className="image-box">
                          <img 
                            src={car.image || "/assets/images/our_fleet/transparent_car_images/e_class.png"} 
                            alt={car.name} 
                          />
                        </div>
                        <div className="perfect-fleet-content">
                          <div className="perfect-fleet-title">
                            <h3>{getCarTypeLabel(car.type)}</h3>
                            <h2>{car.name}</h2>
                          </div>
                          <div className="perfect-fleet-body">
                            <ul>
                              <li>
                                <HiOutlineUsers className="fleet-icon" />
                                {car.seats} {` ${strings.PASSENGER}`}
                              </li>
                              <li>
                                <HiOutlineViewfinderCircle className="fleet-icon" />
                                {car.doors} {` ${strings.DOORS}`}
                              </li>
                              <li>
                                <HiOutlineWifi className="fleet-icon" />
                                {car.aircon ? strings.YES : 'No'}
                              </li>
                              <li>
                                <HiOutlineCog6Tooth className="fleet-icon" />
                                {getGearboxLabel(car.gearbox)}
                              </li>
                            </ul>
                          </div>
                          <div className="perfect-fleet-footer">
                            <div className="perfect-fleet-pricing">
                              <h2>
                                €{car.price}
                                <span>/day</span>
                              </h2>
                            </div>
                            <div className="perfect-fleet-btn">
                              <Link to="#" className="section-icon-btn">
                                <HiOutlineArrowRight className="fleet-icon" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                  <div className="text-center">
                    <h4 className="text-muted">No cars available</h4>
                    <p className="text-muted">Please check back later for our latest fleet updates.</p>
                  </div>
                </div>
              )}
              <div className="car-details-btn">
                <div className="car-button-prev"></div>
                <div className="car-button-next"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeFleets;
