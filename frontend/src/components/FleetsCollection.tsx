import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import * as bookcarsTypes from "../types/bookcars-types";
import * as bookcarsHelper from "../utils/bookcars-helper";
import env from "../config/env.config";
import Const from "../config/const";
import * as helper from "../common/helper";
import { strings as commonStrings } from "../lang/common";
import { strings } from "../lang/cars";
import * as CarService from "../services/CarService";
import * as UserService from "../services/UserService";
import * as SupplierService from "../services/SupplierService";

import { useMediaQuery } from "react-responsive";
import TextAnime from "./animations/TextAnime";

interface FleetsProps {
  from?: Date;
  to?: Date;
  suppliers?: string[];
  pickupLocation?: string;
  dropOffLocation?: string;
  carSpecs?: bookcarsTypes.CarSpecs;
  carType?: string[];
  gearbox?: string[];
  mileage?: string[];
  fuelPolicy?: string[];
  deposit?: number;
  cars?: bookcarsTypes.Car[];
  reload?: boolean;
  booking?: bookcarsTypes.Booking;
  className?: string;
  hidePrice?: boolean;
  hideSupplier?: boolean;
  loading?: boolean;
  sizeAuto?: boolean;
  onLoad?: bookcarsTypes.DataEvent<bookcarsTypes.Car>;
}

interface CategoryState {
  page: number;
  cars: bookcarsTypes.Car[];
  total: number;
  loading: boolean;
}

const FleetsCollection = ({
  from,
  to,
  suppliers,
  pickupLocation,
  dropOffLocation,
  carSpecs,
  carType: _carType,
  gearbox,
  mileage,
  fuelPolicy,
  deposit,
  cars,
  reload,
  loading: carListLoading,
  onLoad,
}: FleetsProps) => {
  const isLaptop = useMediaQuery({ query: "(min-width : 992px)" });

  const navigate = useNavigate();

  const [language, setLanguage] = useState(env.DEFAULT_LANGUAGE);
  const [init, setInit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [rows, setRows] = useState<bookcarsTypes.Car[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [days, setDays] = useState(0);

  useEffect(() => {
    setLanguage(UserService.getLanguage());
  }, []);

  useEffect(() => {
    if (from && to) {
      setDays(bookcarsHelper.days(from, to));
    }
  }, [from, to]);

  useEffect(() => {
    if (env.PAGINATION_MODE === Const.PAGINATION_MODE.INFINITE_SCROLL) {
      const element = document.querySelector("body");

      if (element) {
        element.onscroll = () => {
          if (
            fetch &&
            !loading &&
            window.scrollY > 0 &&
            window.scrollY + window.innerHeight + env.INFINITE_SCROLL_OFFSET >=
              document.body.scrollHeight
          ) {
            setLoading(true);
            setPage(page + 1);
          }
        };
      }
    }
  }, [fetch, loading, page]);

  const fetchData = async (
    _page: number,
    _suppliers?: string[],
    _pickupLocation?: string,
    _carSpecs?: bookcarsTypes.CarSpecs,
    __carType?: string[],
    _gearbox?: string[],
    _mileage?: string[],
    _fuelPolicy?: string[],
    _deposit?: number
  ) => {
    try {
      setLoading(true);
      const payload: bookcarsTypes.GetCarsPayload = {
        suppliers: _suppliers ?? [],
        pickupLocation: _pickupLocation,
        carSpecs: _carSpecs,
        carType: __carType,
        gearbox: _gearbox,
        mileage: _mileage,
        fuelPolicy: _fuelPolicy,
        deposit: _deposit,
      };

      const data = await CarService.getCars(payload, _page, env.CARS_PAGE_SIZE);

      const _data =
        data && data.length > 0
          ? data[0]
          : { pageInfo: { totalRecord: 0 }, resultData: [] };
      if (!_data) {
        helper.error();
        return;
      }
      const _totalRecords =
        Array.isArray(_data.pageInfo) && _data.pageInfo.length > 0
          ? _data.pageInfo[0].totalRecords
          : 0;

      let _rows = [];
      if (env.PAGINATION_MODE === Const.PAGINATION_MODE.INFINITE_SCROLL) {
        _rows = _page === 1 ? _data.resultData : [...rows, ..._data.resultData];
      } else {
        _rows = _data.resultData;
      }

      setRows(_rows);
      setRowCount((_page - 1) * env.CARS_PAGE_SIZE + _rows.length);
      setTotalRecords(_totalRecords);
      setFetch(_data.resultData.length > 0);

      if (
        (env.PAGINATION_MODE === Const.PAGINATION_MODE.INFINITE_SCROLL &&
          _page === 1) ||
        env.PAGINATION_MODE === Const.PAGINATION_MODE.CLASSIC
      ) {
        window.scrollTo(0, 0);
      }

      if (onLoad) {
        onLoad({ rows: _data.resultData, rowCount: _totalRecords });
      }
    } catch (err) {
      helper.error(err);
    } finally {
      setLoading(false);
      setInit(false);
    }
  };

  useEffect(() => {
    if (suppliers) {
      if (suppliers.length > 0) {
        fetchData(
          page,
          suppliers,
          pickupLocation,
          carSpecs,
          _carType,
          gearbox,
          mileage,
          fuelPolicy,
          deposit
        );
      } else {
        setRows([]);
        setFetch(false);
        if (onLoad) {
          onLoad({ rows: [], rowCount: 0 });
        }
        setInit(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    suppliers,
    pickupLocation,
    carSpecs,
    _carType,
    gearbox,
    mileage,
    fuelPolicy,
    deposit,
    from,
    to,
  ]);

  useEffect(() => {
    if (cars) {
      setRows(cars);
      setFetch(false);
      if (onLoad) {
        onLoad({ rows: cars, rowCount: cars.length });
      }
      setLoading(false);
    }
  }, [cars]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPage(1);
  }, [
    suppliers,
    pickupLocation,
    carSpecs,
    _carType,
    gearbox,
    mileage,
    fuelPolicy,
    deposit,
    from,
    to,
  ]);

  useEffect(() => {
    if (reload) {
      setPage(1);
      fetchData(
        1,
        suppliers,
        pickupLocation,
        carSpecs,
        _carType,
        gearbox,
        mileage,
        fuelPolicy,
        deposit
      );
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    reload,
    suppliers,
    pickupLocation,
    carSpecs,
    _carType,
    gearbox,
    mileage,
    fuelPolicy,
    deposit,
  ]);

  // const getExtraIcon = (option: string, extra: number) => {
  //   let available = false
  //   if (booking) {
  //     if (option === 'cancellation' && booking.cancellation && extra > 0) {
  //       available = true
  //     }
  //     if (option === 'amendments' && booking.amendments && extra > 0) {
  //       available = true
  //     }
  //     if (option === 'collisionDamageWaiver' && booking.collisionDamageWaiver && extra > 0) {
  //       available = true
  //     }
  //     if (option === 'theftProtection' && booking.theftProtection && extra > 0) {
  //       available = true
  //     }
  //     if (option === 'fullInsurance' && booking.fullInsurance && extra > 0) {
  //       available = true
  //     }
  //     if (option === 'additionalDriver' && booking.additionalDriver && extra > 0) {
  //       available = true
  //     }
  //   }

  //   return extra === -1
  //     ? <UncheckIcon className="unavailable" />
  //     : extra === 0 || available
  //       ? <CheckIcon className="available" />
  //       : <InfoIcon className="extra-info" />
  // }

  const fr = language === "fr";

  function capitalizeFirstWord(str: string) {
    if (!str) return str; // Check for empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const [categories, setCategories] = useState<Record<string, CategoryState>>({
    economy: { page: 1, cars: [], total: 0, loading: false },
    business: { page: 1, cars: [], total: 0, loading: false },
    vip: { page: 1, cars: [], total: 0, loading: false },
  });

  const fetchCategoryCars = async (
    category: string,
    page: number,
    payload: bookcarsTypes.GetCarsPayload
  ) => {
    try {
      setCategories((prev) => ({
        ...prev,
        [category]: { ...prev[category], loading: true },
      }));

      const data = await CarService.getCars(
        { ...payload }, // Add category filter to payload
        page,
        3 // Fetch only 3 cars per page
      );

      const _data =
        data && data.length > 0
          ? data[0]
          : { pageInfo: { totalRecord: 0 }, resultData: [] };
      if (!_data) {
        helper.error();
        return;
      }

      const _totalRecords =
        Array.isArray(_data.pageInfo) && _data.pageInfo.length > 0
          ? _data.pageInfo[0].totalRecords
          : 0;

      setCategories((prev) => ({
        ...prev,
        [category]: {
          page,
          cars: _data.resultData,
          total: _totalRecords,
          loading: false,
        },
      }));
    } catch (err) {
      helper.error(err);
      setCategories((prev) => ({
        ...prev,
        [category]: { ...prev[category], loading: false },
      }));
    }
  };

  useEffect(() => {
    if (suppliers && suppliers.length > 0) {
      const payload: bookcarsTypes.GetCarsPayload = {
        suppliers,
        pickupLocation,
        carSpecs,
        carType: _carType,
        gearbox,
        mileage,
        fuelPolicy,
        deposit,
      };

      // Fetch cars for each category
      Object.keys(categories).forEach((category) => {
        fetchCategoryCars(category, categories[category].page, payload);
      });
    } else {
      // Reset all categories if no suppliers
      setCategories({
        economy: { page: 1, cars: [], total: 0, loading: false },
        business: { page: 1, cars: [], total: 0, loading: false },
        vip: { page: 1, cars: [], total: 0, loading: false },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    suppliers,
    pickupLocation,
    carSpecs,
    _carType,
    gearbox,
    mileage,
    fuelPolicy,
    deposit,
    from,
    to,
  ]);

  const handleCategoryPageChange = (category: string, newPage: number) => {
    const payload: bookcarsTypes.GetCarsPayload = {
      suppliers: suppliers || [],
      pickupLocation,
      carSpecs,
      carType: _carType,
      gearbox,
      mileage,
      fuelPolicy,
      deposit,
    };

    fetchCategoryCars(category, newPage, payload);
  };

  const renderCategorySection = (category: string) => {
    const { cars, page, total, loading } = categories[category];
    const totalPages = Math.ceil(total / 3);

    const [paginationRef, paginationInView] = useInView({
      triggerOnce: true, // Animate only once when the item comes into view
      threshold: 0.1, // Adjust the threshold as needed
    });

    return (
      <div className="col-12 py-4" key={category}>
        <div className="d-flex justify-content-center">
          <TextAnime className="text-anime-style-3" tag="h2">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </TextAnime>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : cars.length === 0 ? (
          <>
            <div className="d-flex justify-content-center p-4">
              <TextAnime className="text-anime-style-3 text-center" tag="h3">
                {strings.DESCRIPTION}
              </TextAnime>
            </div>
          </>
        ) : (
          <>
            <div className="row mt-4">
              {cars.map((car, index) => (
                <div
                  key={`${category}-${car._id}`}
                  className="col-lg-4 col-md-6"
                >
                  <motion.div
                    className="perfect-fleet-item fleets-collection-item"
                    initial={{ opacity: 0, y: 20 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={
                      isLaptop
                        ? { delay: 0.2 * (index % 3), duration: 0.5 }
                        : { delay: 0.2, duration: 0.5 }
                    }
                  >
                    <div className="image-box">
                      <img
                        src={bookcarsHelper.joinURL(env.CDN_CARS, car.image)}
                        alt={car.name}
                      />
                    </div>
                    <div className="perfect-fleet-content">
                      <div className="perfect-fleet-title">
                        <h3>
                          {car.type === bookcarsTypes.CarType.PlugInHybrid
                            ? strings.PLUG_IN_HYBRID
                            : car.type === bookcarsTypes.CarType.Diesel
                            ? strings.DIESEL
                            : car.type === bookcarsTypes.CarType.Hybrid
                            ? strings.HYBRID
                            : car.type === bookcarsTypes.CarType.Gasoline
                            ? strings.GASOLINE
                            : strings.ELECTRIC}
                        </h3>
                        <h2>{car.name}</h2>
                      </div>
                      <div className="perfect-fleet-body">
                        <ul>
                          <li>
                            <img
                              src="/assets/images/icons/icon-fleet-list-1.svg"
                              alt=""
                            />
                            {car.seats}
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/icon-fleet-list-2.svg"
                              alt=""
                            />
                            {car.doors}
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/icon-fleet-list-3.svg"
                              alt=""
                            />
                            {car.aircon === true ? strings.YES : strings.NO}
                          </li>
                          <li>
                            <img
                              src="/assets/images/icons/icon-fleet-list-4.svg"
                              alt=""
                            />
                            {car.gearbox === bookcarsTypes.GearboxType.Manual
                              ? strings.GEARBOX_MANUAL
                              : strings.GEARBOX_AUTOMATIC}
                          </li>
                        </ul>
                        <h6 className="py-3 fw-semibold">
                          {strings.AMENITIES}
                        </h6>
                        <div className="amenities-item">
                          <ul>
                            {[
                              {
                                label: strings.CANCELLATION,
                                included:
                                  car.cancellation === -1 ||
                                  car.cancellation === 0,
                              },
                              {
                                label: strings.AMENDMENTS,
                                included:
                                  car.amendments === -1 || car.amendments === 0,
                              },
                              {
                                label: strings.COLLISION_DAMAGE_WAVER,
                                included:
                                  car.collisionDamageWaiver === -1 ||
                                  car.collisionDamageWaiver === 0,
                              },
                              {
                                label: strings.THEFT_PROTECTION,
                                included:
                                  car.theftProtection === -1 ||
                                  car.theftProtection === 0,
                              },
                              {
                                label: strings.FULL_INSURANCE,
                                included:
                                  car.fullInsurance === -1 ||
                                  car.fullInsurance === 0,
                              },
                              {
                                label: strings.ADDITIONAL_DRIVER,
                                included: car.additionalDriver === -1,
                              },
                            ].map((amenity, index) => (
                              <li key={index}>
                                <img
                                  src={`/assets/images/icons/amenity-${
                                    amenity.included
                                      ? "included"
                                      : "purchasable"
                                  }.svg`}
                                  alt=""
                                />
                                {amenity.label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="perfect-fleet-footer">
                        <div className="perfect-fleet-pricing">
                          <h2>
                            {`$${car.dailyPrice}`}
                            <span>/day</span>
                          </h2>
                        </div>
                        <div
                          className="perfect-fleet-btn"
                          onClick={() => {
                            console.log({ car });
                            navigate("/booking-form", {
                              state: {
                                carId: car._id,
                                pickupLocationId: pickupLocation,
                                dropOffLocationId: dropOffLocation,
                                from,
                                to,
                              },
                            });
                          }}
                        >
                          <Link to="" className="section-icon-btn">
                            <img
                              src="/assets/images/icons/arrow-white.svg"
                              alt="arrow"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="col-lg-12 " ref={paginationRef}>
                <motion.div
                  className="fleets-pagination"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: paginationInView ? 1 : 0,
                    y: paginationInView ? 0 : 20,
                  }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <ul className="pagination">
                    {!(page === 1) && (
                      <li>
                        <Link
                          to="#"
                          onClick={() =>
                            handleCategoryPageChange(category, page - 1)
                          }
                        >
                          <i className="fa-solid fa-arrow-left-long"></i>
                        </Link>
                      </li>
                    )}

                    {Array.from({ length: Math.min(totalPages, 5) }).map(
                      (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <li
                            key={i}
                            className={page === pageNum ? "active" : ""}
                          >
                            <Link
                              key={i}
                              to="#"
                              onClick={() =>
                                handleCategoryPageChange(category, pageNum)
                              }
                            >
                              {pageNum}
                            </Link>
                          </li>
                        );
                      }
                    )}

                    {!(page === totalPages) && (
                      <li>
                        <Link
                          to="#"
                          onClick={() =>
                            handleCategoryPageChange(category, page + 1)
                          }
                        >
                          <i className="fa-solid fa-arrow-right-long"></i>
                        </Link>
                      </li>
                    )}
                  </ul>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fleets-collection-box">
      {Object.keys(categories).length === 0 ? (
        !init &&
        !loading &&
        !carListLoading && (
          <div className="section-title faqs-section-title">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {strings.OOPS}
            </motion.h3>
            <TextAnime className="text-anime-style-3 text-center" tag="h2">
              {strings.DESCRIPTION}
            </TextAnime>
          </div>
        )
      ) : (
        <div className="row">
          {Object.keys(categories).map(renderCategorySection)}
        </div>
      )}
    </div>
  );
};
export default FleetsCollection;
