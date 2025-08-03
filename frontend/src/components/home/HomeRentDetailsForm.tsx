import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";

import * as bookcarsTypes from "../../types/bookcars-types";
import * as bookcarsHelper from "../../utils/bookcars-helper";
import * as LocationService from "../../services/LocationService";
import * as UserService from "../../services/UserService";
import * as SupplierService from "../../services/SupplierService";
import env from "../../config/env.config";
import * as helper from "../../common/helper";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimeValidationError } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";

import { strings } from "../../lang/home-hero";
import { fr, enUS } from "date-fns/locale";
import { FaUser, FaMagnifyingGlass } from "react-icons/fa6";

const HomeRentDetailsForm: React.FC<{ language: string }> = ({ language }) => {
  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<bookcarsTypes.Location[]>([]);
  const [fetch, setFetch] = useState(true);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<
    bookcarsTypes.Location[]
  >([]);

  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [passengerData, setPassengerData] = useState({
    adults: 1,
    kids: 0,
    child: 0,
    infant: 0,
    skiEquipment: 0,
    specialEquipment: 0,
  });

  useEffect(() => {
    fetchData(1, keyword);
  }, []);

  const fetchData = async (
    _page: number,
    _keyword: string,
    onFetch?: bookcarsTypes.DataEvent<bookcarsTypes.Location>
  ) => {
    try {
      if (fetch || _page === 1) {
        setLoading(true);
        const data = await LocationService.getLocations(
          _keyword,
          _page,
          env.PAGE_SIZE
        );
        const _data =
          data && data.length > 0
            ? data[0]
            : { pageInfo: { totalRecord: 0 }, resultData: [] };
        if (!_data) {
          return;
        }
        const totalRecords =
          Array.isArray(_data.pageInfo) && _data.pageInfo.length > 0
            ? _data.pageInfo[0].totalRecords
            : 0;
        const _rows =
          _page === 1 ? _data.resultData : [...rows, ..._data.resultData];

        setRows(_rows);
        setFetch(_data.resultData.length > 0);

        if (onFetch) {
          onFetch({ rows: _data.resultData, rowCount: totalRecords });
        }
      }
    } catch (err) {
      helper.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isLaptop = useMediaQuery({ query: "(min-width: 992px)" });
  const navigate = useNavigate();

  const _minDate = new Date();
  _minDate.setDate(_minDate.getDate() + 1);

  const [pickupLocation, setPickupLocation] = useState("");
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<
    bookcarsTypes.Location | undefined
  >(undefined);
  const [dropOffLocation, setDropOffLocation] = useState("");
  const [selectedDropOffLocation, setSelectedDropOffLocation] = useState<
    bookcarsTypes.Location | undefined
  >(undefined);
  const [minDate, setMinDate] = useState(_minDate);
  const [maxDate, setMaxDate] = useState<Date>();
  const [from, setFrom] = useState<Date | undefined>(new Date());
  const [to, setTo] = useState<Date | undefined>(new Date());
  const [sameLocation, setSameLocation] = useState(true);
  const [fromError, setFromError] = useState(false);
  const [toError, setToError] = useState(false);
  const [suppliers, setSuppliers] = useState<bookcarsTypes.User[]>([]);

  useEffect(() => {
    const _from = new Date();
    _from.setDate(_from.getDate() + 1);
    _from.setHours(10);
    _from.setMinutes(0);
    _from.setSeconds(0);
    _from.setMilliseconds(0);

    const _to = new Date(_from);
    _to.setDate(_to.getDate() + 3);

    const _maxDate = new Date(_to);
    _maxDate.setDate(_maxDate.getDate() - 1);
    setMaxDate(_maxDate);

    const __minDate = new Date(_from);
    __minDate.setDate(__minDate.getDate() + 1);

    setMinDate(__minDate);
    setFrom(_from);
    setTo(_to);

    const init = async () => {
      let _suppliers = await SupplierService.getAllSuppliers();
      _suppliers = _suppliers.filter(
        (supplier) => supplier.avatar && !/no-image/i.test(supplier.avatar)
      );
      bookcarsHelper.shuffle(_suppliers);
      setSuppliers(_suppliers);
    };

    init();
  }, []);

  useEffect(() => {
    if (from) {
      const __minDate = new Date(from);
      __minDate.setDate(from.getDate() + 1);
      setMinDate(__minDate);
    }
  }, [from]);

  const handlePickupLocationChange = async (values: bookcarsTypes.Option[]) => {
    const _pickupLocation = (values.length > 0 && values[0]._id) || "";
    setPickupLocation(_pickupLocation);

    if (_pickupLocation) {
      const location = await LocationService.getLocation(_pickupLocation);
      setSelectedPickupLocation(location);
    } else {
      setSelectedPickupLocation(undefined);
    }
  };

  const handleDropOffLocationChange = async (
    values: bookcarsTypes.Option[]
  ) => {
    const _dropOffLocation = (values.length > 0 && values[0]._id) || "";
    setDropOffLocation(_dropOffLocation);

    if (_dropOffLocation) {
      const location = await LocationService.getLocation(_dropOffLocation);
      setSelectedDropOffLocation(location);
    } else {
      setSelectedDropOffLocation(undefined);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !pickupLocation ||
      !dropOffLocation ||
      !from ||
      !to ||
      fromError ||
      toError
    ) {
      console.log(
        pickupLocation,
        dropOffLocation,
        from,
        to,
        fromError,
        toError
      );
      return;
    }

    // console.log({
    //   state: {
    //     pickupLocationId: pickupLocation,
    //     dropOffLocationId: dropOffLocation,
    //     from,
    //     to,
    //   },
    // });

    // console.log({
    //   pickupLocationId: pickupLocation,
    //   dropOffLocationId: dropOffLocation,
    //   from,
    //   to,
    // });

    navigate("/cars", {
      state: {
        pickupLocationId: pickupLocation,
        dropOffLocationId: dropOffLocation,
        from,
        to,
      },
    });
  };

  // console.log("Pick Up location", pickupLocation);
  // console.log("Drop Off location", dropOffLocation);
  const { ref: rentRef, inView: rentView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      <motion.div
        className="rent-details"
        ref={rentRef}
        initial={{ opacity: 0, y: 30 }}
        animate={rentView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: isLaptop ? 0.5 : 0.1 }}
      >
        <div className="container">
          {/* Filter Form Start */}
          <form action="#" method="get" onSubmit={handleSubmit}>
            <div className="row no-gutters align-items-center">
              <div className="col-md-12">
                <div className="rent-details-box">
                  <div className="rent-details-form">
                    {/* Rent Details Item Start */}
                    <div className="rent-details-item">
                      {/* <div className="icon-box">
                        <img
                          src="src/assets/images/icon-rent-details-2.svg"
                          alt="Pickup Location"
                        />
                      </div> */}
                      <div className="rent-details-content">
                        <h3>{strings.PICKUP}</h3>
                        <select
                          className="rent-details-form form-select"
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                        >
                          <option value="" disabled>
                            {`📌 ${strings.SELECT}`}
                          </option>
                          {rows.map((row, index) => (
                            <option key={index} value={row._id}>
                              {`📌 ${row.name}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Rent Details Item End */}
                    {/* Rent Details Item Start */}
                    <div className="rent-details-item">
                      {/* <div className="icon-box">
                        <img
                          src="src/assets/images/icon-rent-details-2.svg"
                          alt="Dropoff Location"
                        />
                      </div> */}
                      <div className="rent-details-content">
                        <h3>{strings.DROP_OFF}</h3>
                        <select
                          className="rent-details-form form-select"
                          value={dropOffLocation}
                          onChange={(e) => setDropOffLocation(e.target.value)}
                          onFocus={() => {}}
                        >
                          <option value="" disabled>
                            {`📌 ${strings.SELECT}`}
                          </option>
                          {rows.map((row, index) => (
                            <option key={index} value={row._id}>
                              {`📌 ${row.name}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    {/* Rent Details Item Start */}
                    <div className="rent-details-item">
                      {/* <div className="icon-box">
                        <img
                          src="src/assets/images/icon-rent-details-3.svg"
                          alt="Pickup Date"
                        />
                      </div> */}
                      <div className="rent-details-content">
                        <h3>{strings.PICKUP_DATE}</h3>
                        <LocalizationProvider
                          adapterLocale={language === "fr" ? fr : enUS}
                          dateAdapter={AdapterDateFns}
                        >
                          <DatePicker
                            className="rent-details-form custom-datepicker"
                            minDate={_minDate}
                            maxDate={maxDate}
                            value={from}
                            onChange={(date) => {
                              if (date) {
                                const __minDate = new Date(date);
                                __minDate.setDate(date.getDate() + 1);
                                setFrom(date);
                                setMinDate(__minDate);
                                setFromError(false);
                              } else {
                                setFrom(undefined);
                                setMinDate(_minDate);
                              }
                            }}
                            onError={(err: DateTimeValidationError) => {
                              if (err) {
                                setFromError(true);
                              } else {
                                setFromError(false);
                              }
                            }}
                            // localeText={UserService.getLanguage()}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    {/* Rent Details Item Start */}
                    <div className="rent-details-item ">
                      <div className="rent-details-content">
                        <h3 style={{ color: "#444447" }}>
                          {strings.RETURN_DATE}
                        </h3>
                        <LocalizationProvider
                          adapterLocale={language === "fr" ? fr : enUS}
                          dateAdapter={AdapterDateFns}
                        >
                          <DatePicker
                            className="rent-details-form custom-datepicker"
                            value={to}
                            minDate={minDate}
                            onChange={(date) => {
                              if (date) {
                                const _maxDate = new Date(date);
                                _maxDate.setDate(_maxDate.getDate() - 1);
                                setTo(date);
                                setMaxDate(_maxDate);
                                setToError(false);
                              } else {
                                setTo(undefined);
                                setMaxDate(undefined);
                              }
                            }}
                            onError={(err: DateTimeValidationError) => {
                              if (err) {
                                setToError(true);
                              } else {
                                setToError(false);
                              }
                            }}
                            // localeText={UserService.getLanguage()}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    <div className="rent-details-item rent-details-user text-center">
                      <button
                        type="button"
                        className="border-0 user-button"
                        onClick={() => setShowPassengerForm(!showPassengerForm)}
                      >
                        <FaUser color="white" />
                      </button>
                    </div>
                    <div className="rent-details-search text-center">
                      <button type="submit" className="border-0 user-button">
                        <FaMagnifyingGlass color="white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* Filter Form End */}
          {showPassengerForm && (
            <div className="passenger-form-container">
              <div className="passenger-form">
                <div className="form-group">
                  <label>{strings.ADULTS}</label>
                  <input
                    type="number"
                    min="1"
                    value={passengerData.adults}
                    onChange={(e) =>
                      setPassengerData({
                        ...passengerData,
                        adults: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>{strings.KIDS}</label>
                  <input
                    type="number"
                    min="0"
                    value={passengerData.kids}
                    onChange={(e) =>
                      setPassengerData({
                        ...passengerData,
                        kids: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>{strings.CHILD}</label>
                  <input
                    type="number"
                    min="0"
                    value={passengerData.child}
                    onChange={(e) =>
                      setPassengerData({
                        ...passengerData,
                        child: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>{strings.INFANT}</label>
                  <input
                    type="number"
                    min="0"
                    value={passengerData.infant}
                    onChange={(e) =>
                      setPassengerData({
                        ...passengerData,
                        infant: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>{strings.SKI}</label>
                  <input
                    type="number"
                    min="0"
                    value={passengerData.skiEquipment}
                    onChange={(e) =>
                      setPassengerData({
                        ...passengerData,
                        skiEquipment: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>{strings.SPECIAL}</label>
                  <input
                    type="number"
                    min="0"
                    value={passengerData.specialEquipment}
                    onChange={(e) =>
                      setPassengerData({
                        ...passengerData,
                        specialEquipment: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <p className="passenger-note">{strings.FREE}</p>
                <button
                  type="button"
                  className="done-button"
                  onClick={() => setShowPassengerForm(false)}
                >
                  {strings.DONE}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default HomeRentDetailsForm;
