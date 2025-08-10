import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";

import * as bookcarsTypes from "../../types/bookcars-types";
import * as bookcarsHelper from "../../utils/bookcars-helper";
import * as UserService from "../../services/UserService";
import * as SupplierService from "../../services/SupplierService";
import * as LocationService from "../../services/LocationService";
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
  // Dynamic locations from API
  const [rows, setRows] = useState<bookcarsTypes.Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetch, setFetch] = useState(false);

  // Helper function to check if location is already selected in the other field
  const isLocationDisabled = (locationId: string, otherLocationId: string, locationName: string, otherLocationName: string) => {
    // Check by ID first
    if (locationId === otherLocationId) return true;
    
    // Also check by name to handle cases where same location has different IDs
    if (locationName && otherLocationName && locationName.toLowerCase() === otherLocationName.toLowerCase()) return true;
    
    return false;
  };

  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [passengerData, setPassengerData] = useState({
    adults: 1,
    kids: 0,
    child: 0,
    infant: 0,
    skiEquipment: 0,
    specialEquipment: 0,
  });


  const fetchData = async (
    _page: number,
    _keyword: string,
    onFetch?: (event: { rows: bookcarsTypes.Location[]; rowCount: number }) => void
  ) => {
    try {
      if (fetch || _page === 1) {
        setLoading(true);
        const data = await LocationService.getLocations(
          _keyword,
          _page,
          env.PAGE_SIZE
        );
        
        // Handle the Result<Location> type properly
        let _data: bookcarsTypes.Result<bookcarsTypes.Location>;
        if (Array.isArray(data) && data.length > 0) {
          // Legacy API response format
          _data = data[0] as bookcarsTypes.Result<bookcarsTypes.Location>;
        } else if (data && 'pageInfo' in data && 'resultData' in data) {
          // New API response format
          _data = data as bookcarsTypes.Result<bookcarsTypes.Location>;
        } else {
          // Fallback
          _data = { 
            pageInfo: { 
              totalRecords: 0, 
              totalPages: 0, 
              pageSize: 0, 
              pageNumber: 0,
              hasNextPage: false,
              hasPreviousPage: false
            }, 
            resultData: [] 
          };
        }

        if (!_data) {
          return;
        }

        const totalRecords = _data.pageInfo?.totalRecords || 0;
        const _rows = _page === 1 ? _data.resultData : [...rows, ..._data.resultData];

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
  const [locationError, setLocationError] = useState("");
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
      try {
        // Load suppliers
        let _suppliers = await SupplierService.getAllSuppliers();
        _suppliers = _suppliers.filter(
          (supplier) => supplier.avatar && !/no-image/i.test(supplier.avatar)
        );
        bookcarsHelper.shuffle(_suppliers);
        setSuppliers(_suppliers);

        // Load locations from API
        const locationsResult = await LocationService.getLocations('', 0, 100);
        
        if (locationsResult && locationsResult.resultData && Array.isArray(locationsResult.resultData)) {
          setRows(locationsResult.resultData);
        } else if (locationsResult && locationsResult.data && Array.isArray(locationsResult.data)) {
          // Handle direct array response from fallback API
          setRows(locationsResult.data);
        } else if (locationsResult && Array.isArray(locationsResult)) {
          // Handle direct array response
          setRows(locationsResult);
        }
        setLocationsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSuppliers([]);
        setLocationsLoading(false);
      }
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

  const handlePickupLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = e.target.value;
    const location = rows.find(row => row._id === locationId);
    
    setPickupLocation(locationId);
    setSelectedPickupLocation(location);
    setLocationError(""); // Clear any previous error
    
    // If drop-off location is the same as the new pickup location (by ID or name), clear it
    if (location && selectedDropOffLocation) {
      const shouldClear = isLocationDisabled(
        locationId,
        dropOffLocation,
        location.name,
        selectedDropOffLocation.name
      );
      
      if (shouldClear) {
        setDropOffLocation("");
        setSelectedDropOffLocation(undefined);
        setLocationError(`Drop-off location cleared as it was the same as pickup location (${location.name})`);
        
        // Clear the message after 3 seconds
        setTimeout(() => setLocationError(""), 3000);
      }
    }
  };

  const handleDropOffLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = e.target.value;
    const location = rows.find(row => row._id === locationId);
    
    setDropOffLocation(locationId);
    setSelectedDropOffLocation(location);
    setLocationError(""); // Clear any previous error
    
    // If pickup location is the same as the new drop-off location (by ID or name), clear it
    if (location && selectedPickupLocation) {
      const shouldClear = isLocationDisabled(
        locationId,
        pickupLocation,
        location.name,
        selectedPickupLocation.name
      );
      
      if (shouldClear) {
        setPickupLocation("");
        setSelectedPickupLocation(undefined);
        setLocationError(`Pickup location cleared as it was the same as drop-off location (${location.name})`);
        
        // Clear the message after 3 seconds
        setTimeout(() => setLocationError(""), 3000);
      }
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
                    {/* Location Error Message */}
                    {locationError && (
                      <div style={{
                        backgroundColor: '#fff3cd',
                        borderLeft: '4px solid #ffc107',
                        padding: '8px 12px',
                        marginBottom: '15px',
                        borderRadius: '4px',
                        color: '#856404',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        ℹ️ {locationError}
                      </div>
                    )}
                    {/* Rent Details Item Start */}
                    <div className="rent-details-item">
                      {/* <div className="icon-box">
                        <img
                          src="/img/icon-rent-details-2.svg"
                          alt="Pickup Location"
                        />
                      </div> */}
                      <div className="rent-details-content">
                        <h3>{strings.PICKUP}</h3>
                        <select
                          className="rent-details-form form-select"
                          value={pickupLocation}
                          onChange={handlePickupLocationChange}
                          disabled={locationsLoading}
                        >
                          <option value="" disabled>
                            {locationsLoading ? '⏳ Loading locations...' : `📌 ${strings.SELECT}`}
                          </option>
                          {rows && rows.map((row, index) => (
                            <option key={index} value={row._id}>
                              {`📌 ${row.name}`}
                            </option>
                          ))}
                          {rows.map((row, index) => {
                            const selectedDropOffLocation = rows.find(r => r._id === dropOffLocation);
                            const isDisabled = isLocationDisabled(
                              row._id, 
                              dropOffLocation, 
                              row.name, 
                              selectedDropOffLocation?.name || ''
                            );
                            
                            return (
                              <option 
                                key={index} 
                                value={row._id}
                                disabled={isDisabled}
                                style={{ 
                                  color: isDisabled ? '#999' : 'inherit',
                                  fontStyle: isDisabled ? 'italic' : 'normal',
                                  backgroundColor: isDisabled ? '#f5f5f5' : 'inherit'
                                }}
                              >
                                {`📌 ${row.name}${isDisabled ? ' (Selected as Drop-off)' : ''}`}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    {/* Rent Details Item End */}
                    {/* Rent Details Item Start */}
                    <div className="rent-details-item">
                      {/* <div className="icon-box">
                        <img
                          src="/img/icon-rent-details-2.svg"
                          alt="Dropoff Location"
                        />
                      </div> */}
                      <div className="rent-details-content">
                        <h3>{strings.DROP_OFF}</h3>
                        <select
                          className="rent-details-form form-select"
                          value={dropOffLocation}
                          onChange={handleDropOffLocationChange}
                          disabled={locationsLoading}
                        >
                          <option value="" disabled>
                            {locationsLoading ? '⏳ Loading locations...' : `📌 ${strings.SELECT}`}
                          </option>
                          {rows && rows.map((row, index) => (
                            <option key={index} value={row._id}>
                              {`📌 ${row.name}`}
                            </option>
                          ))}
                          {rows.map((row, index) => {
                            const selectedPickupLocation = rows.find(r => r._id === pickupLocation);
                            const isDisabled = isLocationDisabled(
                              row._id, 
                              pickupLocation, 
                              row.name, 
                              selectedPickupLocation?.name || ''
                            );
                            
                            return (
                              <option 
                                key={index} 
                                value={row._id}
                                disabled={isDisabled}
                                style={{ 
                                  color: isDisabled ? '#999' : 'inherit',
                                  fontStyle: isDisabled ? 'italic' : 'normal',
                                  backgroundColor: isDisabled ? '#f5f5f5' : 'inherit'
                                }}
                              >
                                {`📌 ${row.name}${isDisabled ? ' (Selected as Pickup)' : ''}`}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    {/* Rent Details Item End */}

                    {/* Rent Details Item Start */}
                    <div className="rent-details-item">
                      {/* <div className="icon-box">
                        <img
                          src="/img/icons/icon-rent-details-3.svg"
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
