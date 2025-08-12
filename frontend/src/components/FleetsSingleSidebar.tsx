import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Modal, { Styles } from "react-modal";

import * as bookcarsTypes from "../types/bookcars-types";
import * as bookcarsHelper from "../utils/bookcars-helper";
import * as helper from "../common/helper";
import env from "../config/env.config";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { Link } from "react-router-dom";
import DatePicker from "../components/DatePicker";
import { strings } from "../lang/fleets-single-sidebar";
import { strings as commonStrings } from "../lang/cars";
import { strings as chkStrings } from "../lang/checkout";
import { strings as comStrings } from "../lang/common";
import iconFleetList1 from "@assets/images/icons/icon-fleet-list-1.svg";
import iconFleetList2 from "@assets/images/icons/icon-fleet-list-2.svg";
import iconFleetList3 from "@assets/images/icons/icon-fleet-list-3.svg";
import iconFleetList4 from "@assets/images/icons/icon-fleet-list-4.svg";

const stripePromise = loadStripe(env.STRIPE_PUBLISHABLE_KEY);
// Modal styles
const modalStyles: Styles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Similar to `closeOnBgClick: false`
    zIndex: 1000,
    overflow: "hidden",
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "40px",
    maxWidth: "850px",
    width: "90%",
    overflowY: "auto",
  },
};

Modal.setAppElement("#root"); // Set app root to prevent screen readers issues

interface FleetsSingleSidebarProps {
  car: bookcarsTypes.Car;
  price: number;
  days: number;
  language: string;
  error: boolean;
  tosError: boolean;
  paymentFailed: boolean;
  recaptchaError: boolean;
  authenticated: boolean;
  emailValid: boolean;
  emailRegistered: boolean;
  emailInfo: boolean;
  additionalEmailValid: boolean;
  additionalPhoneValid: boolean;
  additionalBirthDateValid: boolean;
  additionalDriver: boolean;
  adManuallyChecked: boolean;
  phoneValid: boolean;
  payLater: boolean;
  clientSecret: string | null;
  phoneInfo: boolean;
  birthDateValid: boolean;
  pickupLocation: bookcarsTypes.Location;
  dropOffLocation: bookcarsTypes.Location;
  onFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBirthDateChange: (_birthDate: Date | null) => void;
  onAdditionalFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdditionalEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdditionalEmailBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onAdditionalPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdditionalPhoneBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onAdditionalBirthDateChange: (_birthDate: Date | null) => void;
  onTosChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPayLater: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPayOnline: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRecaptchaVerify: (token: string) => Promise<void>;
  onHandleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onCancel: () => Promise<void>;
}

const FleetsSingleSidebar: React.FC<FleetsSingleSidebarProps> = ({
  car,
  days,
  price,
  language,
  payLater,
  error,
  paymentFailed,
  recaptchaError,
  additionalDriver,
  adManuallyChecked,
  additionalBirthDateValid,
  additionalEmailValid,
  additionalPhoneValid,
  tosError,
  clientSecret,
  pickupLocation,
  dropOffLocation,
  authenticated,
  emailValid,
  emailRegistered,
  emailInfo,
  phoneInfo,
  phoneValid,
  birthDateValid,
  onFullNameChange,
  onEmailBlur,
  onEmailChange,
  onPhoneBlur,
  onPhoneChange,
  onBirthDateChange,
  onAdditionalFullNameChange,
  onAdditionalEmailBlur,
  onAdditionalEmailChange,
  onAdditionalPhoneBlur,
  onAdditionalPhoneChange,
  onAdditionalBirthDateChange,
  onPayLater,
  onPayOnline,
  onRecaptchaVerify,
  onTosChange,
  onHandleSubmit,
  onCancel,
}) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    onCancel();
  };

  useEffect(() => {
    // Disable body scroll when the modal is open
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup to reset body scroll
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const closeButtonStyles: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "40px", // Same width as .mfp-close
    height: "40px", // Same height as .mfp-close
    background: isHovered ? "#000" : "#ff3600",
    borderRadius: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    lineHeight: "35px", // Center the "X" vertically
    textAlign: "center", // Center the "X" horizontally
    color: "#fff", // Optional: set the color of the "X"
  };

  function capitalizeFirstWord(str: string) {
    if (!str) return str; // Check for empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const sidebarList = [
    {
      src: iconFleetList1,
      text: strings.PASSENGERS,
      value: car?.seats,
    },
    {
      src: iconFleetList2,
      text: strings.AIRCON,
      value: car?.aircon ? strings.YES : strings.NO,
    },
    {
      src: iconFleetList3,
      text: strings.DOORS,
      value: car?.doors,
    },
    {
      src: iconFleetList4,
      text: strings.TRANSMISSION,
      value: capitalizeFirstWord(
        car.gearbox === bookcarsTypes.GearboxType.Manual
          ? strings.MANUAL
          : strings.AUTOMATIC
      ),
    },
    {
      src: iconFleetList1,
      text: strings.AGE,
      value: car?.minimumAge,
    },
  ];

  const { ref: sidebarRef, inView: sidebarInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: pricingRef, inView: pricingInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="fleets-single-sidebar" ref={sidebarRef}>
      <motion.div
        className="fleets-single-sidebar-box"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: sidebarInView ? 1 : 0, y: sidebarInView ? 0 : 50 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="fleets-single-sidebar-pricing"
          initial={{ opacity: 0 }}
          animate={{ opacity: pricingInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          ref={pricingRef}
        >
          <h2>
            ${price}
            <span>{`${strings.PER} ${days} ${strings.DAY}${
              days > 1 ? "s" : ""
            }`}</span>
          </h2>
        </motion.div>

        <motion.div
          className="fleets-single-sidebar-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: sidebarInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ul>
            {sidebarList.map((item, index) => (
              <li key={index}>
                <img src={item.src} alt="" />
                {item.text} <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="fleets-single-sidebar-btn"
          initial={{ opacity: 0 }}
          animate={{ opacity: sidebarInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {/* Replace the jQuery magnific popup trigger with the Modal */}
          <button className="btn-default" onClick={openModal}>
            {strings.BOOK}
          </button>
          <span>or</span>
          <a href="#" className="wp-btn">
            <i className="fa-brands fa-whatsapp"></i>
          </a>
        </motion.div>
      </motion.div>

      {/* React Modal for the booking form */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Booking Form Modal"
        overlayClassName="ReactModal_Content"
        className="booking-form mfp-wrap ReactModal_Content" // Apply the same class used in the original popup
      >
        <Link
          to="#"
          onClick={closeModal}
          onMouseEnter={() => setIsHovered(true)} // Hover effect start
          onMouseLeave={() => setIsHovered(false)}
          style={closeButtonStyles}
        >
          &times; {/* This is the "X" close icon */}
        </Link>
        <form id="bookingform" onSubmit={onHandleSubmit}>
          <div className="section-title">
            <h2>{strings.MODAL_HEADING}</h2>
            <p>{strings.MODAL_DESCRIPTION}</p>
          </div>
          <fieldset>
            <div className="row">
              <h5 className="pb-4">{strings.BOOKING_DETAILS}</h5>
              {/* Booking Form Inputs */}
              {[
                {
                  name: "name",
                  type: "text",
                  placeholder: strings.FULL_NAME_PLACEHOLDER,
                  disabled: false,
                  onChange: onFullNameChange,
                  visible: !authenticated,
                  error: false,
                },
                {
                  name: "email",
                  type: "email",
                  placeholder: strings.EMAIL_PLACEHOLDER,
                  disabled: false,
                  onChange: onEmailChange,
                  onBlur: onEmailBlur,
                  visible: !authenticated,
                  error: !emailValid || emailRegistered,
                  errorText: !emailValid
                    ? strings.EMAIL_UNVALID
                    : strings.EMAIL_REGISTERED,
                  info: emailInfo,
                },
                {
                  name: "phone",
                  type: "text",
                  placeholder: strings.PHONE_PLACEHOLDER,
                  disabled: false,
                  onChange: onPhoneChange,
                  onBlur: onPhoneBlur,
                  visible: !authenticated,
                  error: !phoneValid,
                  errorText: strings.PHONE_UNVALID,
                  info: phoneInfo,
                },
                {
                  name: "cartype",
                  type: "select",
                  placeholder: "Choose Car Type",
                  options: [
                    "sport_car",
                    "convertible_car",
                    "sedan_car",
                    "luxury_car",
                    "electric_car",
                    "coupe_car",
                  ],
                  disabled: true,
                  defaultValue: capitalizeFirstWord(
                    car.type === bookcarsTypes.CarType.PlugInHybrid
                      ? commonStrings.PLUG_IN_HYBRID
                      : car.type === bookcarsTypes.CarType.Diesel
                      ? commonStrings.DIESEL
                      : car.type === bookcarsTypes.CarType.Hybrid
                      ? commonStrings.HYBRID
                      : car.type === bookcarsTypes.CarType.Gasoline
                      ? commonStrings.GASOLINE
                      : commonStrings.ELECTRIC
                  ),
                  visible: true,
                },
                {
                  name: "location",
                  type: "select",
                  placeholder: "Choose Pickup Location",
                  options: ["abu_dhabi", "alain", "dubai", "sharjah"],
                  disabled: true,
                  defaultValue: pickupLocation.name,
                  visible: true,
                },
                {
                  name: "droplocation",
                  type: "select",
                  placeholder: "Choose Drop-off Location",
                  options: ["abu_dhabi", "alain", "sharjah"],
                  disabled: true,
                  defaultValue: dropOffLocation.name,
                  visible: true,
                },
              ].map(
                (field, index) =>
                  field.visible && (
                    <div
                      className="booking-form-group col-md-6 mb-4"
                      key={index}
                    >
                      <>
                        {field.type === "select" ? (
                          <select
                            name={field.name}
                            className="booking-form-control form-select"
                            id={field.name}
                            disabled={field.disabled}
                            defaultValue="" // Set defaultValue for select inputs
                            required
                          >
                            <option value="" disabled>
                              {field.defaultValue}
                            </option>
                            {field.options?.map((option, i) => (
                              <option key={i} value={option}>
                                {option.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            className="booking-form-control"
                            id={field.name}
                            placeholder={field.placeholder}
                            required
                            disabled={field.disabled}
                          />
                        )}
                        {
                          <div className="help-block with-errors fs-6 lh-1 text-danger">
                            {field.error && field.errorText}
                            {field.info ? field.info : ""}
                          </div>
                        }
                      </>
                    </div>
                  )
              )}
              {/* Birthdate */}
              {!authenticated && (
                <div className="booking-form-control col-md-6 mb-4 ">
                  <DatePicker
                    variant="outlined"
                    required
                    label={strings.BIRTH_DATE}
                    onChange={onBirthDateChange}
                    language={language}
                  />
                  <div className="help-block with-errors fs-6 fw-light lh-1 text-danger">
                    {!birthDateValid &&
                      helper.getBirthDateError(car.minimumAge)}
                  </div>
                </div>
              )}
              {env.RECAPTCHA_ENABLED && (
                <div className="recaptcha">
                  <GoogleReCaptcha onVerify={onRecaptchaVerify} />
                </div>
              )}
              <div className="booking-form-control mb-4">
                <input
                  type="checkbox"
                  onChange={onTosChange}
                  className="form-check-input"
                  id="terms"
                />
                <label className="form-check-label" htmlFor="terms">
                  {strings.AGREE} <Link to="/terms">{strings.TERMS}</Link>
                </label>
              </div>
              {adManuallyChecked && additionalDriver && (
                <>
                  <h6 className="pb-4">{strings.ADDITIONAL}</h6>
                  {[
                    {
                      name: "name",
                      type: "text",
                      placeholder: strings.ADDITIONAL_FULL_NAME_PLACEHOLDER,
                      onChange: onAdditionalFullNameChange,
                      error: false,
                    },
                    {
                      name: "email",
                      type: "email",
                      placeholder: strings.ADDITIONAL_EMAIL_PLACEHOLDER,
                      onChange: onAdditionalEmailChange,
                      onBlur: onAdditionalEmailBlur,
                      error: !additionalEmailValid,
                      errorText: strings.EMAIL_UNVALID,
                    },
                    {
                      name: "phone",
                      type: "text",
                      placeholder: strings.ADDITIONAL_PHONE_PLACEHOLDER,
                      onChange: onAdditionalPhoneChange,
                      onBlur: onAdditionalPhoneBlur,
                      error: !additionalPhoneValid,
                      errorText: strings.PHONE_UNVALID,
                    },
                  ].map((field, index) => (
                    <div
                      className="booking-form-group col-md-6 mb-4"
                      key={index}
                    >
                      <input
                        type={field.type}
                        name={field.name}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className="booking-form-control"
                        id={field.name}
                        placeholder={field.placeholder}
                        required
                      />
                      <div className="help-block with-errors fs-6 lh-1 text-danger">
                        {field.error && field.errorText}
                      </div>
                    </div>
                  ))}
                  <div className="booking-form-control col-md-6 mb-4">
                    <DatePicker
                      variant="outlined"
                      required
                      label={strings.BIRTH_DATE}
                      onChange={onAdditionalBirthDateChange}
                      language={language}
                    />
                    <div className="help-block with-errors fs-6 fw-light lh-1 text-danger">
                      {!additionalBirthDateValid &&
                        helper.getBirthDateError(car.minimumAge)}
                    </div>
                  </div>
                </>
              )}
              {car.supplier.payLater && (
                <div className="payment-options-container m-3 mt-0">
                  <div className="booking-info py-1">
                    <span>{chkStrings.PAYMENT_OPTIONS}</span>
                  </div>

                  <div className="payment-options">
                    {/* Use basic form and radio inputs for payment options */}
                    <div>
                      <label className="radio-container">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="payLater"
                          onChange={onPayLater}
                          defaultChecked
                        />
                        <span className="custom-radio"></span>
                        <span>{chkStrings.PAY_LATER}</span>
                        <span className="payment-info">{`(${chkStrings.PAY_LATER_INFO})`}</span>
                      </label>
                    </div>

                    <div>
                      <label className="radio-container">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="payOnline"
                          onChange={onPayOnline}
                        />
                        <span className="custom-radio"></span>
                        <span>{chkStrings.PAY_ONLINE}</span>
                        <span className="payment-info">{`(${chkStrings.PAY_ONLINE_INFO})`}</span>
                      </label>
                    </div>
                    <div className="help-block with-errors fs-6 lh-1 text-danger">
                      {tosError && comStrings.TOS_ERROR}
                      {error && comStrings.GENERIC_ERROR}
                      {paymentFailed && chkStrings.PAYMENT_FAILED}
                      {recaptchaError && comStrings.RECAPTCHA_ERROR}
                    </div>
                  </div>
                </div>
              )}
              {(!car.supplier.payLater || !payLater) && clientSecret && (
                <div className="payment-options-container">
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              )}
              {!clientSecret && (
                <div className="col-md-12 booking-form-group ">
                  <button type="submit" className="btn-default">
                    {strings.RENT}
                  </button>
                  <div id="msgSubmit" className="h3 hidden"></div>
                </div>
              )}
            </div>
          </fieldset>
        </form>
      </Modal>
    </div>
  );
};

export default FleetsSingleSidebar;
