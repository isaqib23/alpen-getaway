import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import "../assets/css/car-details.css";
import FleetsSingleSidebar from "../components/FleetsSingleSidebar";
import FleetSingleContent from "../components/FleetSingleContent";

import * as bookcarsTypes from "../types/bookcars-types";
import * as bookcarsHelper from "../utils/bookcars-helper";

import env from "../config/env.config";
import * as BookingService from "../services/BookingService";
// import { strings as commonStrings } from "../lang/common";
// import { strings as csStrings } from "../lang/cars";
import * as helper from "../common/helper";
import * as UserService from "../services/UserService";
import * as CarService from "../services/CarService";
import * as LocationService from "../services/LocationService";
import * as StripeService from "../services/StripeService";
import validator from "validator";
import { format, intervalToDuration } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import ReCaptchaProvider from "../components/ReCaptchaProvider";

import TextAnime from "../components/animations/TextAnime";
import { motion } from "framer-motion";
import { strings as commonStrings } from "../lang/common";
import { strings as csStrings } from "../lang/cars";
import { strings } from "../lang/checkout";
import BookingForm from "../components/booking-form/BookingForm";

const CarDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<bookcarsTypes.User>();
  const [car, setCar] = useState<bookcarsTypes.Car>();
  const [pickupLocation, setPickupLocation] =
    useState<bookcarsTypes.Location>();
  const [dropOffLocation, setDropOffLocation] =
    useState<bookcarsTypes.Location>();
  const [from, setFrom] = useState<Date>();
  const [to, setTo] = useState<Date>();
  const [visible, setVisible] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [language, setLanguage] = useState(env.DEFAULT_LANGUAGE);
  const [noMatch, setNoMatch] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState<Date>();
  const [birthDateValid, setBirthDateValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [emailRegsitered, setEmailRegsitered] = useState(false);
  const [phoneValid, setPhoneValid] = useState(true);
  const [tosChecked, setTosChecked] = useState(false);
  const [tosError, setTosError] = useState(false);
  const [error, setError] = useState(false);
  const [price, setPrice] = useState(0);
  const [emailInfo, setEmailInfo] = useState(true);
  const [phoneInfo, setPhoneInfo] = useState(true);
  const [cancellation, setCancellation] = useState(false);
  const [amendments, setAmendments] = useState(false);
  const [theftProtection, setTheftProtection] = useState(false);
  const [collisionDamageWaiver, setCollisionDamageWaiver] = useState(false);
  const [fullInsurance, setFullInsurance] = useState(false);
  const [additionalDriver, setAdditionalDriver] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [additionalDriverFullName, setadditionalDriverFullName] = useState("");
  const [additionalDriverEmail, setadditionalDriverEmail] = useState("");
  const [additionalDriverPhone, setadditionalDriverPhone] = useState("");
  const [additionalDriverBirthDate, setadditionalDriverBirthDate] =
    useState<Date>();
  const [additionalDriverEmailValid, setadditionalDriverEmailValid] =
    useState(true);
  const [additionalDriverPhoneValid, setadditionalDriverPhoneValid] =
    useState(true);
  const [additionalDriverBirthDateValid, setadditionalDriverBirthDateValid] =
    useState(true);
  const [payLater, setPayLater] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState(false);

  const [adManuallyChecked, setAdManuallyChecked] = useState(false);
  const adRequired = true;

  const [paymentFailed, setPaymentFailed] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();

  const _fr = language === "fr";
  const _locale = _fr ? fr : enUS;
  const _format = _fr ? "eee d LLL yyyy kk:mm" : "eee, d LLL yyyy, p";
  const days = bookcarsHelper.days(from, to);
  const daysLabel =
    from &&
    to &&
    `
  ${helper.getDaysShort(days)} (${bookcarsHelper.capitalize(
      format(from, _format, { locale: _locale })
    )} 
  - ${bookcarsHelper.capitalize(format(to, _format, { locale: _locale }))})`;

  const handleCancellationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (car && from && to) {
      const _cancellation = e.target.checked;
      const options: bookcarsTypes.CarOptions = {
        cancellation: _cancellation,
        amendments,
        theftProtection,
        collisionDamageWaiver,
        fullInsurance,
        additionalDriver,
      };
      const _price = helper.price(car, from, to, options);

      setCancellation(_cancellation);
      setPrice(_price);
    }
  };

  const handleAmendmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (car && from && to) {
      const _amendments = e.target.checked;
      const options: bookcarsTypes.CarOptions = {
        cancellation,
        amendments: _amendments,
        theftProtection,
        collisionDamageWaiver,
        fullInsurance,
        additionalDriver,
      };
      const _price = helper.price(car, from, to, options);

      setAmendments(_amendments);
      setPrice(_price);
    }
  };

  const handleTheftProtectionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (car && from && to) {
      const _theftProtection = e.target.checked;
      const options: bookcarsTypes.CarOptions = {
        cancellation,
        amendments,
        theftProtection: _theftProtection,
        collisionDamageWaiver,
        fullInsurance,
        additionalDriver,
      };
      const _price = helper.price(car, from, to, options);

      setTheftProtection(_theftProtection);
      setPrice(_price);
    }
  };

  const handleCollisionDamageWaiverChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (car && from && to) {
      const _collisionDamageWaiver = e.target.checked;
      const options: bookcarsTypes.CarOptions = {
        cancellation,
        amendments,
        theftProtection,
        collisionDamageWaiver: _collisionDamageWaiver,
        fullInsurance,
        additionalDriver,
      };
      const _price = helper.price(car, from, to, options);

      setCollisionDamageWaiver(_collisionDamageWaiver);
      setPrice(_price);
    }
  };

  const handleFullInsuranceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (car && from && to) {
      const _fullInsurance = e.target.checked;
      const options: bookcarsTypes.CarOptions = {
        cancellation,
        amendments,
        theftProtection,
        collisionDamageWaiver,
        fullInsurance: _fullInsurance,
        additionalDriver,
      };
      const _price = helper.price(car, from, to, options);

      setFullInsurance(_fullInsurance);
      setPrice(_price);
    }
  };

  const handleAdditionalDriverChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (car && from && to) {
      const _additionalDriver = e.target.checked;
      const options: bookcarsTypes.CarOptions = {
        cancellation,
        amendments,
        theftProtection,
        collisionDamageWaiver,
        fullInsurance,
        additionalDriver: _additionalDriver,
      };
      const _price = helper.price(car, from, to, options);

      setAdditionalDriver(_additionalDriver);
      setPrice(_price);
      setAdManuallyChecked(_additionalDriver);
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (!e.target.value) {
      setEmailRegsitered(false);
      setEmailValid(true);
    }
  };

  const validateEmail = async (_email?: string) => {
    if (_email) {
      if (validator.isEmail(_email)) {
        try {
          const status = await UserService.validateEmail({ email: _email });
          if (status === 200) {
            setEmailRegsitered(false);
            setEmailValid(true);
            setEmailInfo(true);
            return true;
          }
          setEmailRegsitered(true);
          setEmailValid(true);
          setError(false);
          setEmailInfo(false);
          return false;
        } catch (err) {
          helper.error(err);
          setEmailRegsitered(false);
          setEmailValid(true);
          setEmailInfo(true);
          return false;
        }
      } else {
        setEmailRegsitered(false);
        setEmailValid(false);
        setEmailInfo(true);
        return false;
      }
    } else {
      setEmailRegsitered(false);
      setEmailValid(true);
      setEmailInfo(true);
      return false;
    }
  };

  // additionalDriver
  const _validateEmail = (_email?: string) => {
    if (_email) {
      if (validator.isEmail(_email)) {
        setadditionalDriverEmailValid(true);
        return true;
      }
      setadditionalDriverEmailValid(false);
      return false;
    }
    setadditionalDriverEmailValid(true);
    return false;
  };

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    await validateEmail(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);

    if (!e.target.value) {
      setPhoneValid(true);
    }
  };

  const validatePhone = (_phone?: string) => {
    if (_phone) {
      const _phoneValid = validator.isMobilePhone(_phone);
      setPhoneValid(_phoneValid);
      setPhoneInfo(_phoneValid);

      return _phoneValid;
    }
    setPhoneValid(true);
    setPhoneInfo(true);

    return true;
  };

  // additionalDriver
  const _validatePhone = (_phone?: string) => {
    if (_phone) {
      const _phoneValid = validator.isMobilePhone(_phone);
      setadditionalDriverPhoneValid(_phoneValid);

      return _phoneValid;
    }
    setadditionalDriverPhoneValid(true);

    return true;
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validatePhone(e.target.value);
  };

  const handleBirthDateChange = (_birthDate: Date | null) => {
    if (_birthDate) {
      const _birthDateValid = validateBirthDate(_birthDate);

      setBirthDate(_birthDate);
      setBirthDateValid(_birthDateValid);
    }
  };

  const handlePayLater = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPayLater(event.target.value !== "payLater");
  };
  const handlePayOnline = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPayLater(event.target.value === "payLater");
  };

  const handleAdditionalFullNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setadditionalDriverFullName(e.target.value);
  };
  const handleAdditionalEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setadditionalDriverEmail(e.target.value);

    if (!e.target.value) {
      setadditionalDriverEmailValid(true);
    }
  };
  const handleAdditionalEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    _validateEmail(e.target.value);
  };
  const handleAdditionalPhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setadditionalDriverPhone(e.target.value);

    if (!e.target.value) {
      setadditionalDriverPhoneValid(true);
    }
  };
  const handleAdditionalPhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    _validatePhone(e.target.value);
  };
  const handleAdditionalBirthDateChange = (_birthDate: Date | null) => {
    if (_birthDate) {
      const _birthDateValid = _validateBirthDate(_birthDate);

      setadditionalDriverBirthDate(_birthDate);
      setadditionalDriverBirthDateValid(_birthDateValid);
    }
  };

  const handleBookingCancel = async () => {
    try {
      if (bookingId && sessionId) {
        //
        // Delete temporary booking on cancel.
        // Otherwise, temporary bookings are
        // automatically deleted through a TTL index.
        //
        await BookingService.deleteTempBooking(bookingId, sessionId);
      }
    } catch (err) {
      helper.error(err);
    } finally {
      navigate("/");
    }
  };

  const validateBirthDate = (date?: Date) => {
    if (car && date && bookcarsHelper.isDate(date)) {
      const now = new Date();
      const sub = intervalToDuration({ start: date, end: now }).years ?? 0;
      const _birthDateValid = sub >= car.minimumAge;

      setBirthDateValid(_birthDateValid);
      return _birthDateValid;
    }
    setBirthDateValid(true);
    return true;
  };

  // additionalDriver
  const _validateBirthDate = (date?: Date) => {
    if (car && date && bookcarsHelper.isDate(date)) {
      const now = new Date();
      const sub = intervalToDuration({ start: date, end: now }).years ?? 0;
      const _birthDateValid = sub >= car.minimumAge;

      setadditionalDriverBirthDateValid(_birthDateValid);
      return _birthDateValid;
    }
    setadditionalDriverBirthDateValid(true);
    return true;
  };

  const handleTosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTosChecked(e.target.checked);

    if (e.target.checked) {
      setTosError(false);
    }
  };

  const handleRecaptchaVerify = useCallback(async (token: string) => {
    try {
      const ip = await UserService.getIP();
      const status = await UserService.verifyRecaptcha(token, ip);
      const valid = status === 200;
      setRecaptchaError(!valid);
    } catch (err) {
      helper.error(err);
      setRecaptchaError(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!car || !pickupLocation || !dropOffLocation || !from || !to) {
        helper.error();
        return;
      }

      if (!authenticated) {
        const _emailValid = await validateEmail(email);
        if (!_emailValid) {
          return;
        }

        const _phoneValid = validatePhone(phone);
        if (!_phoneValid) {
          return;
        }

        const _birthDateValid = validateBirthDate(birthDate);
        if (!_birthDateValid) {
          return;
        }

        if (env.RECAPTCHA_ENABLED && recaptchaError) {
          return;
        }

        if (!tosChecked) {
          setTosError(true);
          return;
        }
      }

      if (adManuallyChecked && additionalDriver) {
        const _emailValid = _validateEmail(additionalDriverEmail);
        if (!_emailValid) {
          return;
        }

        const _phoneValid = _validatePhone(additionalDriverPhone);
        if (!_phoneValid) {
          return;
        }

        const _birthDateValid = _validateBirthDate(additionalDriverBirthDate);
        if (!_birthDateValid) {
          return;
        }
      }

      setLoading(true);
      setPaymentFailed(false);

      let driver: bookcarsTypes.User | undefined;
      let _additionalDriver: bookcarsTypes.AdditionalDriver | undefined;

      if (!authenticated) {
        driver = {
          email,
          phone,
          fullName,
          birthDate,
          language: UserService.getLanguage(),
        };
      }

      const booking: bookcarsTypes.Booking = {
        supplier: car.supplier._id as string,
        car: car._id,
        driver: authenticated ? user?._id : undefined,
        pickupLocation: pickupLocation._id,
        dropOffLocation: dropOffLocation._id,
        from,
        to,
        status: bookcarsTypes.BookingStatus.Pending,
        cancellation,
        amendments,
        theftProtection,
        collisionDamageWaiver,
        fullInsurance,
        additionalDriver,
        price,
      };

      if (adRequired && additionalDriver && additionalDriverBirthDate) {
        _additionalDriver = {
          fullName: additionalDriverFullName,
          email: additionalDriverEmail,
          phone: additionalDriverPhone,
          birthDate: additionalDriverBirthDate,
        };
      }

      //
      // Stripe Payment Gateway
      //
      let _customerId: string | undefined;
      let _sessionId: string | undefined;
      if (!payLater) {
        const payload: bookcarsTypes.CreatePaymentPayload = {
          amount: price,
          currency: env.STRIPE_CURRENCY_CODE,
          locale: language,
          receiptEmail: (!authenticated
            ? driver?.email
            : user?.email) as string,
          name: `${car.name} 
          - ${daysLabel} 
          - ${
            pickupLocation._id === dropOffLocation._id
              ? pickupLocation.name
              : `${pickupLocation.name} - ${dropOffLocation.name}`
          }`,
          description: "BookCars Web Service",
          customerName: (!authenticated
            ? driver?.fullName
            : user?.fullName) as string,
        };
        const res = await StripeService.createCheckoutSession(payload);
        setClientSecret(res.clientSecret);
        _sessionId = res.sessionId;
        _customerId = res.customerId;
      }

      const payload: bookcarsTypes.CheckoutPayload = {
        driver,
        booking,
        additionalDriver: _additionalDriver,
        payLater,
        sessionId: _sessionId,
        customerId: _customerId,
      };

      const { status, bookingId: _bookingId } = await BookingService.checkout(
        payload
      );
      setLoading(false);

      if (status === 200) {
        if (payLater) {
          setVisible(false);
          setSuccess(true);
        }
        setBookingId(_bookingId);
        setSessionId(_sessionId);
      } else {
        helper.error();
      }
    } catch (err) {
      helper.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onLoad = async (_user?: bookcarsTypes.User) => {
    setUser(_user);
    setAuthenticated(_user !== undefined);
    setLanguage(UserService.getLanguage());

    const { state } = location;
    if (!state) {
      setNoMatch(true);
      return;
    }

    const { carId } = state;
    const { pickupLocationId } = state;
    const { dropOffLocationId } = state;
    const { from: _from } = state;
    const { to: _to } = state;

    if (!carId || !pickupLocationId || !dropOffLocationId || !_from || !_to) {
      setNoMatch(true);
      return;
    }

    let _car;
    let _pickupLocation;
    let _dropOffLocation;

    try {
      _car = await CarService.getCar(carId);
      if (!_car) {
        setNoMatch(true);
        return;
      }

      _pickupLocation = await LocationService.getLocation(pickupLocationId);

      if (!_pickupLocation) {
        setNoMatch(true);
        return;
      }

      if (dropOffLocationId !== pickupLocationId) {
        _dropOffLocation = await LocationService.getLocation(dropOffLocationId);
      } else {
        _dropOffLocation = _pickupLocation;
      }

      if (!_dropOffLocation) {
        setNoMatch(true);
        return;
      }

      const _price = helper.price(_car, _from, _to);

      const included = (val: number) => val === 0;

      setCar(_car);
      setPrice(_price);
      setPickupLocation(_pickupLocation);
      setDropOffLocation(_dropOffLocation);
      setFrom(_from);
      setTo(_to);
      setCancellation(included(_car.cancellation));
      setAmendments(included(_car.amendments));
      setTheftProtection(included(_car.theftProtection));
      setCollisionDamageWaiver(included(_car.collisionDamageWaiver));
      setFullInsurance(included(_car.fullInsurance));
      setVisible(true);
    } catch (err) {
      helper.error(err);
    }
  };

  console.log("Client secret", clientSecret);
  console.log("pickupLocation", pickupLocation);
  console.log("dropOffLocation", dropOffLocation);

  return (
    <ReCaptchaProvider>
      <Layout onLoad={onLoad}>
        <BookingForm
          from={pickupLocation}
          to={dropOffLocation}
          carImage={car?.image}
          onSubmit={handleSubmit}
          price={price}
          addReturn={true}
          recaptchaEnabled={true}
        />
      </Layout>
    </ReCaptchaProvider>
  );
};

export default CarDetails;
