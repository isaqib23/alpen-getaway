import React, { useState } from "react";
import { FaUser } from "react-icons/fa6";
import * as bookcarsTypes from "../types/bookcars-types";
import * as bookcarsHelper from "../utils/bookcars-helper";
import env from "../config/env.config";

import { strings } from "../lang/cars";

import {
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";

interface BookingDetails {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  adults: number;
  kids: number;
  child: number;
  infant: number;
  skiEquipment: number;
  specialEquipment: number;
}

interface BookingBarSectionProps {
  bookingDetails: BookingDetails;
  setBookingDetails: React.Dispatch<React.SetStateAction<BookingDetails>>;
  setSelectedCar: React.Dispatch<React.SetStateAction<bookcarsTypes.Car>>;
  cars: bookcarsTypes.Car[];
}

const BookingBarSection: React.FC<BookingBarSectionProps> = ({
  bookingDetails,
  setBookingDetails,
  setSelectedCar,
  cars,
}) => {
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?._id || "");
  const [showCarSelector, setShowCarSelector] = useState(false);

  const [showPickupLocationInput, setShowPickupLocationInput] = useState(false);
  const [showDropoffLocationInput, setShowDropoffLocationInput] =
    useState(false);
  const [tempPickupLocation, setTempPickupLocation] = useState(
    bookingDetails.pickupLocation
  );
  const [tempDropoffLocation, setTempDropoffLocation] = useState(
    bookingDetails.dropoffLocation
  );
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [passengerData, setPassengerData] = useState({
    adults: bookingDetails.adults,
    kids: bookingDetails.kids,
    child: bookingDetails.child,
    infant: bookingDetails.infant,
    skiEquipment: bookingDetails.skiEquipment,
    specialEquipment: bookingDetails.specialEquipment,
  });

  const handlePickupLocationChange = () => {
    setBookingDetails({
      ...bookingDetails,
      pickupLocation: tempPickupLocation,
    });
    setShowPickupLocationInput(false);
  };

  const handleDropoffLocationChange = () => {
    setBookingDetails({
      ...bookingDetails,
      dropoffLocation: tempDropoffLocation,
    });
    setShowDropoffLocationInput(false);
  };

  const handlePassengerDataSave = () => {
    setBookingDetails({
      ...bookingDetails,
      adults: passengerData.adults,
      kids: passengerData.kids,
      child: passengerData.child,
      infant: passengerData.infant,
      skiEquipment: passengerData.skiEquipment,
      specialEquipment: passengerData.specialEquipment,
    });
    setShowPassengerForm(false);
  };

  const getTotalPassengers = () => {
    return (
      passengerData.adults +
      passengerData.kids +
      passengerData.child +
      passengerData.infant
    );
  };
  console.log(cars);
  return (
    <div className="booking-form-section booking-bar-section">
      <h3 className="section-title">Trip Details</h3>

      {/* Pickup Location */}
      <div className="location-field">
        <div className="location-field-header">
          <span className="location-label">Pickup Location</span>
          <span
            className="change-request"
            onClick={() => setShowPickupLocationInput(!showPickupLocationInput)}
          >
            Change on request
          </span>
        </div>

        {showPickupLocationInput ? (
          <div>
            <input
              type="text"
              className="location-input"
              placeholder="Enter the name of city or airport"
              value={tempPickupLocation}
              onChange={(e) => setTempPickupLocation(e.target.value)}
              onBlur={handlePickupLocationChange}
            />
          </div>
        ) : (
          <div className="location-value">{bookingDetails.pickupLocation}</div>
        )}
      </div>

      {/* Dropoff Location */}
      <div className="location-field">
        <div className="location-field-header">
          <span className="location-label">Dropoff Location</span>
          <span
            className="change-request"
            onClick={() =>
              setShowDropoffLocationInput(!showDropoffLocationInput)
            }
          >
            Change on request
          </span>
        </div>

        {showDropoffLocationInput ? (
          <div>
            <input
              type="text"
              className="location-input"
              placeholder="Enter the name of city or airport"
              value={tempDropoffLocation}
              onChange={(e) => setTempDropoffLocation(e.target.value)}
              onBlur={handleDropoffLocationChange}
            />
          </div>
        ) : (
          <div className="location-value">{bookingDetails.dropoffLocation}</div>
        )}
      </div>

      {/* Date and Passengers */}
      <div className="date-passengers-row">
        <div className="date-field">
          <label className="date-label">Pickup Date & Time</label>
          <input
            type="datetime-local"
            className="date-input"
            value={bookingDetails.pickupDate}
            onChange={(e) =>
              setBookingDetails({
                ...bookingDetails,
                pickupDate: e.target.value,
              })
            }
          />
        </div>

        <div className="passengers-field" style={{ position: "relative" }}>
          <button
            type="button"
            className="border-0 passengers-button"
            onClick={() => setShowPassengerForm(!showPassengerForm)}
          >
            <FaUser color="white" />
          </button>

          {showPassengerForm && (
            <div className="passenger-form-container">
              <div className="passenger-form">
                <div className="form-group">
                  <label>Adults</label>
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
                  <label>Kids</label>
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
                  <label>Child</label>
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
                  <label>Infant</label>
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
                <div className="form-group">
                  <label>Ski Equipment</label>
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
                <div className="form-group">
                  <label>Special Equipment</label>
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
                <p className="passenger-note">
                  Children under 2 years travel free
                </p>
                <button
                  type="button"
                  className="done-button"
                  onClick={handlePassengerDataSave}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Car Selection */}
      <div className="location-field" style={{ marginTop: "15px" }}>
        <div className="location-field-header">
          <span className="location-label">Selected Car</span>
          <span
            className="change-request"
            onClick={() => setShowCarSelector(!showCarSelector)}
          >
            Change on request
          </span>
        </div>

        {showCarSelector ? (
          <FormControl fullWidth className="car-select-container">
            <Select
              labelId="car-select-label"
              value={selectedCarId}
              onChange={(event: SelectChangeEvent<string>) => {
                setSelectedCarId(event.target.value);
                const car = cars.find((c) => c._id === event.target.value);
                car && setSelectedCar(car);
              }}
              renderValue={(value) => {
                const car = cars.find((c) => c._id === value);
                return (
                  car && (
                    <div className="car-option">
                      <div className="image-box">
                        <img
                          src={bookcarsHelper.joinURL(env.CDN_CARS, car.image)}
                          alt={car.name}
                          style={{
                            width: 90,
                            height: 70,
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="perfect-fleet-content">
                        <div className="perfect-fleet-title">
                          <h2 style={{ margin: 0 }}>{car.name}</h2>
                        </div>
                        <div className="perfect-fleet-body">
                          <ul
                            style={{
                              display: "flex",
                              gap: "1rem",
                              padding: 0,
                              marginBottom: "0",
                            }}
                          >
                            <li>
                              <img
                                src="/img/icons/icon-fleet-list-1.svg"
                                alt=""
                              />
                              {car.seats}
                            </li>
                            <li>
                              <img
                                src="/img/icons/icon-fleet-list-2.svg"
                                alt=""
                              />
                              {car.doors}
                            </li>
                          </ul>
                          <ul
                            style={{ display: "flex", gap: "1rem", padding: 0 }}
                          >
                            <li>
                              <img
                                src="/img/icons/icon-fleet-list-3.svg"
                                alt=""
                              />
                              {car.aircon ? strings.YES : strings.NO}
                            </li>
                            <li>
                              <img
                                src="/img/icons/icon-fleet-list-4.svg"
                                alt=""
                              />
                              {car.gearbox === bookcarsTypes.GearboxType.Manual
                                ? strings.GEARBOX_MANUAL
                                : strings.GEARBOX_AUTOMATIC}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                );
              }}
            >
              {cars.map((car) => (
                <MenuItem key={car._id} value={car._id}>
                  <div className="car-option">
                    <div className="image-box">
                      <img
                        src={bookcarsHelper.joinURL(env.CDN_CARS, car.image)}
                        alt={car.name}
                        style={{ width: 100, height: 70, objectFit: "cover" }}
                      />
                    </div>
                    <div className="perfect-fleet-content">
                      <div className="perfect-fleet-title">
                        <h2 style={{ margin: 0 }}>{car.name}</h2>
                      </div>
                      <div className="perfect-fleet-body">
                        <ul
                          style={{ display: "flex", gap: "1rem", padding: 0 }}
                        >
                          <li>
                            <img
                              src="/img/icons/icon-fleet-list-1.svg"
                              alt=""
                            />
                            {car.seats}
                          </li>
                          <li>
                            <img
                              src="/img/icons/icon-fleet-list-2.svg"
                              alt=""
                            />
                            {car.doors}
                          </li>
                        </ul>
                        <ul
                          style={{ display: "flex", gap: "1rem", padding: 0 }}
                        >
                          <li>
                            <img
                              src="/img/icons/icon-fleet-list-3.svg"
                              alt=""
                            />
                            {car.aircon ? strings.YES : strings.NO}
                          </li>
                          <li>
                            <img
                              src="/img/icons/icon-fleet-list-4.svg"
                              alt=""
                            />
                            {car.gearbox === bookcarsTypes.GearboxType.Manual
                              ? strings.GEARBOX_MANUAL
                              : strings.GEARBOX_AUTOMATIC}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <div className="location-value">
            {cars.find((c) => c._id === selectedCarId)?.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingBarSection;
