import React, { useEffect, useState } from "react";
import "../assets/css/booking-management.css";
import BookingBarSection from "./BookingBarSection";
import PersonalDetailsSection from "./PersonalDetailsSection";
import TravelDetailsSection from "./TravelDetailsSection";
import PaymentDetailsSection from "./PaymentDetailsSection";

import * as bookcarsTypes from "../types/bookcars-types";
import * as bookcarsHelper from "../utils/bookcars-helper";
import * as CarService from "../services/CarService";
import * as UserService from "../services/UserService";
import * as StripeService from "../services/StripeService";
import * as LocationService from "../services/LocationService";
import * as SupplierService from "../services/SupplierService";
import * as helper from "../common/helper";
import env from "../config/env.config";
import { toast } from "react-toastify";

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

interface FormData {
  travelDetails: {
    from: string | undefined;
    to: string | undefined;
    flightNumber: string;
    pickupTime: string;
    exactAddress: string;
    returnTime: string;
    returnFlightNumber: string;
  };
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    additionalInfo: string;
  };
  paymentMethod: "online" | "cash";
}

const BookingManagement: React.FC = () => {
  const DUMMY_STATE = {
    pickupLocationId: "628a5484572a010c6b5d1b42",
    dropOffLocationId: "628a549c572a010c6b5d1b4e",
    from: "2025-04-13T05:00:00.000Z",
    to: "2025-04-16T05:00:00.000Z",
  };
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");
  const [pickupLocation, setPickupLocation] =
    useState<bookcarsTypes.Location>();
  const [dropOffLocation, setDropOffLocation] =
    useState<bookcarsTypes.Location>();
  const [carSpecs, setCarSpecs] = useState<bookcarsTypes.CarSpecs>({});
  const [carType, setCarType] = useState(bookcarsHelper.getAllCarTypes());
  const [gearbox, setGearbox] = useState([
    bookcarsTypes.GearboxType.Automatic,
    bookcarsTypes.GearboxType.Manual,
  ]);
  const [mileage, setMileage] = useState([
    bookcarsTypes.Mileage.Limited,
    bookcarsTypes.Mileage.Unlimited,
  ]);
  const [fuelPolicy, setFuelPolicy] = useState([
    bookcarsTypes.FuelPolicy.FreeTank,
    bookcarsTypes.FuelPolicy.LikeForlike,
  ]);
  const [deposit, setDeposit] = useState(-1);
  const [rows, setRows] = useState<bookcarsTypes.Car[]>([]);
  const [bookingId, setBookingId] = useState<string>("");
  const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    id: "BK12345",
    pickupLocation: "Vienna International Airport",
    dropoffLocation: "Vienna City Center",
    pickupDate: "2025-04-20T14:00",
    adults: 2,
    kids: 1,
    child: 0,
    infant: 0,
    skiEquipment: 0,
    specialEquipment: 0,
  });
  const [suppliers, setSuppliers] = useState<string[]>();
  const [cars, setCars] = useState<{
    page: number;
    cars: bookcarsTypes.Car[];
    total: number;
    loading: boolean;
  }>({
    page: 1,
    cars: [],
    total: 0,
    loading: false,
  });
  const [selectedCar, setSelectedCar] = useState<bookcarsTypes.Car>(
    cars.cars[0]
  );

  const fetchAllCars = async (
    page: number,
    payload: bookcarsTypes.GetCarsPayload
  ) => {
    try {
      setCars((prev) => ({
        ...prev,
        loading: true,
      }));

      const data = await CarService.getCars(
        { ...payload },
        page,
        10 // You can adjust the number of cars per page as needed
      );

      console.log("Fetched cars data:", data); // Log the retrieved data

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

      setCars({
        page,
        cars: _data.resultData,
        total: _totalRecords,
        loading: false,
      });

      console.log("Processed cars:", _data.resultData); // Log the processed car data
      console.log("Total records:", _totalRecords); // Log the total number of records
    } catch (err) {
      console.error("Error fetching cars:", err); // Log any errors
      helper.error(err);
      setCars((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const fetchData = async () => {
    if (!DUMMY_STATE) {
      return;
    }

    const { pickupLocationId } = DUMMY_STATE;
    const { dropOffLocationId } = DUMMY_STATE;
    const { from: _from } = DUMMY_STATE;
    const { to: _to } = DUMMY_STATE;

    if (!pickupLocationId || !dropOffLocationId || !_from || !_to) {
      return;
    }

    let _pickupLocation;
    let _dropOffLocation;
    try {
      _pickupLocation = await LocationService.getLocation(pickupLocationId);

      if (!_pickupLocation) {
        return;
      }

      if (dropOffLocationId !== pickupLocationId) {
        _dropOffLocation = await LocationService.getLocation(dropOffLocationId);
      } else {
        _dropOffLocation = _pickupLocation;
      }

      if (!_dropOffLocation) {
        return;
      }

      const payload: bookcarsTypes.GetCarsPayload = {
        pickupLocation: _pickupLocation._id,
        carSpecs,
        carType,
        gearbox,
        mileage,
        fuelPolicy,
        deposit,
      };
      const _allSuppliers = await SupplierService.getFrontendSuppliers(payload);
      const _suppliers = bookcarsHelper.flattenSuppliers(_allSuppliers);

      setPickupLocation(_pickupLocation);
      setDropOffLocation(_dropOffLocation);

      setSuppliers(_suppliers);
    } catch (err) {
      helper.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (suppliers && suppliers.length > 0) {
      const payload: bookcarsTypes.GetCarsPayload = {
        suppliers,
        pickupLocation: pickupLocation?._id,
        carSpecs,
        carType,
        gearbox,
        mileage,
        fuelPolicy,
        deposit,
      };

      fetchAllCars(cars.page, payload);
    } else {
      // Reset cars if no suppliers
      setCars({
        page: 1,
        cars: [],
        total: 0,
        loading: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cars.page,
    suppliers,
    pickupLocation,
    carSpecs,
    gearbox,
    mileage,
    fuelPolicy,
    deposit,
  ]);

  const [formData, setFormData] = useState<FormData>({
    travelDetails: {
      from: bookingDetails.pickupLocation,
      to: bookingDetails.dropoffLocation,
      flightNumber: "AF1234",
      pickupTime: "14:00",
      exactAddress: "Terminal 3, Gate 7",
      returnTime: "10:00",
      returnFlightNumber: "AF1235",
    },
    personalDetails: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+15551234567",
      additionalInfo: "",
    },
    paymentMethod: "online",
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const handleManageBooking = () => {
    if (bookingId.trim()) {
      getClientSecret();
      setShowBookingForm(true);
    } else {
      toast.error("Booking id is empty");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const fieldPath = field.split(".");
    if (fieldPath.length === 2) {
      const [section, key] = fieldPath;
      setFormData({
        ...formData,
        [section]: {
          ...(formData[section as keyof FormData] as object),
          [key]: value,
        },
      });
    }
  };

  const handlePhoneChange = (phone: string) => {
    setFormData({
      ...formData,
      personalDetails: {
        ...formData.personalDetails,
        phone,
      },
    });
  };

  const handlePaymentChange = (type: "online" | "cash") => {
    setFormData({
      ...formData,
      paymentMethod: type,
    });
  };

  const getClientSecret = async () => {
    try {
      setPaymentProcessing(true);
      setPaymentError(null);

      if (formData.paymentMethod === "online") {
        // Only proceed if we're using online payment
        const fullName =
          `${formData.personalDetails.firstName} ${formData.personalDetails.lastName}`.trim();

        // Prepare a more detailed payload based on the working implementation
        const payload: bookcarsTypes.CreatePaymentPayload = {
          amount: selectedCar?.dailyPrice ?? 0,
          currency: env.STRIPE_CURRENCY_CODE,
          locale: UserService.getLanguage(),
          receiptEmail: formData.personalDetails.email,
          name: `${formData.travelDetails.from || ""} to ${
            formData.travelDetails.to || ""
          }`,
          description: "BookCars Web Service",
          customerName: fullName,
        };

        console.log("Creating payment with payload:", payload);

        const res = await StripeService.createCheckoutSession(payload);
        console.log("Payment session created:", res);

        if (res && res.clientSecret) {
          setClientSecret(res.clientSecret);
          setSessionId(res.sessionId);
          setCustomerId(res.customerId);
          return res.clientSecret;
        } else {
          throw new Error("Invalid response from payment service");
        }
      }
      return null;
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(
        err instanceof Error ? err.message : "Unknown payment error"
      );
      return null;
    } finally {
      setPaymentProcessing(false);
    }
  };

  useEffect(() => {
    cars && setSelectedCar(cars.cars[0]);
  }, [cars]);

  useEffect(() => {
    formData.paymentMethod === "online" && getClientSecret();
  }, [selectedCar, formData.paymentMethod]);

  console.log(suppliers);
  console.log(cars);
  console.log(pickupLocation);
  console.log(dropOffLocation);
  console.log(carType);

  return (
    <div className="booking-management-container">
      {!showBookingForm ? (
        <>
          <div className="booking-id-form">
            <input
              type="text"
              className="booking-id-input"
              placeholder="Enter your booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />
            <button className="btn-default" onClick={handleManageBooking}>
              Manage
            </button>
          </div>
          <div className="empty-state-container">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7M3 7L12 13L21 7M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="empty-state-title">Ready to Manage Your Booking?</h3>
              <p className="empty-state-description">
                Enter your booking ID above to view, modify, or cancel your reservation. 
                You can find your booking ID in your confirmation email or SMS.
              </p>
              <div className="empty-state-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>View booking details</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Modify travel dates</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Update passenger information</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Cancel with free policy</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="booking-form">
          <div className="booking-form-row">
            <BookingBarSection
              bookingDetails={bookingDetails}
              setBookingDetails={setBookingDetails}
              setSelectedCar={setSelectedCar}
              cars={cars.cars}
            />
            <PersonalDetailsSection
              formData={formData}
              onInputChange={handleInputChange}
              onPhoneChange={handlePhoneChange}
            />
          </div>
          <div className="booking-form-row">
            <TravelDetailsSection
              formData={formData}
              onInputChange={handleInputChange}
              addReturn={true}
            />
            <PaymentDetailsSection
              formData={formData}
              onPaymentChange={handlePaymentChange}
              carImage={selectedCar?.image}
              price={selectedCar?.dailyPrice}
              clientSecret={clientSecret}
              paymentProcessing={paymentProcessing}
              paymentError={paymentError}
            />
          </div>
          <div className="booking-form-footer">
            <h5>
              Cancelation Policy: We have a free cancellation policy for all
              rides
            </h5>
            <p style={{ marginBottom: 0 }}>
              If you want to cancel your ride 24 hours before your ride begins,
              then its free of cost, but if you want to cancel your ride within
              24 hours of your ride then it will cost you 25% of your ride. 24
              Hours time span means that we manage, assign & change in this time
              span.
            </p>
            <button
              className="btn-default"
              style={{ float: "right", marginBottom: "10px" }}
              onClick={() => setShowCancelModal(true)}
            >
              Cancel my ride
            </button>
          </div>
        </div>
      )}
      {showCancelModal && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal">
            <h3>Cancel Booking</h3>
            <p>Please let us know why you're canceling your booking:</p>

            <div className="cancel-reasons">
              <label className="radio-container">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Change of Plan"
                  checked={cancelReason === "Change of Plan"}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <span className="custom-radio"></span>
                <span className="custom-radio"></span>
                <span>Change of Plan</span>
              </label>

              <label className="radio-container">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Long Wait Time"
                  checked={cancelReason === "Long Wait Time"}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <span className="custom-radio"></span>
                <span>Long Wait Time</span>
              </label>

              <label className="radio-container">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Found alternative transport"
                  checked={cancelReason === "Found alternative transport"}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <span className="custom-radio"></span>
                Found alternative transport
              </label>

              <label className="radio-container">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Incorrect booking"
                  checked={cancelReason === "Incorrect booking"}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <span className="custom-radio"></span>
                Incorrect booking
              </label>

              <label className="radio-container">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Driver unprofessionalism"
                  checked={cancelReason === "Driver unprofessionalism"}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <span className="custom-radio"></span>
                Driver unprofessionalism
              </label>

              <label className="radio-container">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Safety Concerns"
                  checked={cancelReason === "Safety Concerns"}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <span className="custom-radio"></span>
                Safety Concerns
              </label>

              <label className="radio-container">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Unexpected Delays"
                  checked={cancelReason === "Unexpected Delays"}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <span className="custom-radio"></span>
                Unexpected Delays
              </label>

              <label className="radio-container">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Double Booking"
                  checked={cancelReason === "Double Booking"}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <span className="custom-radio"></span>
                Double Booking
              </label>

              <label className="radio-container">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Other"
                  checked={cancelReason === "Other"}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <span className="custom-radio"></span>
                Other
              </label>
            </div>

            {cancelReason === "Other" && (
              <div className="other-reason-container">
                <textarea
                  placeholder="Please specify your reason..."
                  value={otherReasonText}
                  onChange={(e) => setOtherReasonText(e.target.value)}
                />
              </div>
            )}

            <div className="cancel-modal-buttons">
              <button
                className="btn-cancel"
                onClick={() => setShowCancelModal(false)}
              >
                Go Back
              </button>
              <button
                className="btn-submit"
                onClick={() => {
                  console.log(
                    "Cancellation reason:",
                    cancelReason === "Other" ? otherReasonText : cancelReason
                  );
                  setShowCancelModal(false);
                  // Here you would add your actual cancellation logic
                }}
                disabled={
                  !cancelReason ||
                  (cancelReason === "Other" && !otherReasonText)
                }
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
