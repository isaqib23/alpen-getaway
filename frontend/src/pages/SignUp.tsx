import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useNavigate } from "react-router-dom";

import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import validator from "validator";
import { intervalToDuration } from "date-fns";
import * as bookcarsTypes from "../types/bookcars-types";
import * as bookcarsHelper from "../utils/bookcars-helper";
import env from "../config/env.config";
import { strings as commonStrings } from "../lang/common";
import { strings } from "../lang/sign-up";
import * as UserService from "../services/UserService";
import * as helper from "../common/helper";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import "../assets/css/unified-forms.css";
import Layout from "../components/Layout";
import TextAnime from "../components/animations/TextAnime";
import LoadingSpinner from "../components/LoadingSpinner";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(env.DEFAULT_LANGUAGE);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [tosChecked, setTosChecked] = useState(false);
  const [tosError, setTosError] = useState(false);
  const [phoneValid, setPhoneValid] = useState(true);
  const [phone, setPhone] = useState("");
  const [birthDateValid, setBirthDateValid] = useState(true);

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (!e.target.value) {
      setEmailError(false);
      setEmailValid(true);
    }
  };

  const validateEmail = async (_email?: string) => {
    if (_email) {
      if (validator.isEmail(_email)) {
        try {
          const status = await UserService.validateEmail({ email: _email });
          if (status === 200) {
            setEmailError(false);
            setEmailValid(true);
            return true;
          }
          setEmailError(true);
          setEmailValid(true);
          setError(false);
          return false;
        } catch (err) {
          helper.error(err);
          setEmailError(false);
          setEmailValid(true);
          return false;
        }
      } else {
        setEmailError(false);
        setEmailValid(false);
        return false;
      }
    } else {
      setEmailError(false);
      setEmailValid(true);
      return false;
    }
  };

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    await validateEmail(e.target.value);
  };

  const validatePhone = (_phone?: string) => {
    if (_phone) {
      const _phoneValid = validator.isMobilePhone(_phone);
      setPhoneValid(_phoneValid);

      return _phoneValid;
    }
    setPhoneValid(true);

    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);

    if (!e.target.value) {
      setPhoneValid(true);
    }
  };

  const handlePhoneBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    validatePhone(e.target.value);
  };

  const validateBirthDate = (date?: Date | null) => {
    if (date && bookcarsHelper.isDate(date)) {
      const now = new Date();
      const sub = intervalToDuration({ start: date, end: now }).years ?? 0;
      const _birthDateValid = sub >= env.MINIMUM_AGE;

      setBirthDateValid(_birthDateValid);
      return _birthDateValid;
    }
    setBirthDateValid(true);
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
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

  const handleTosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTosChecked(e.target.checked);

    if (e.target.checked) {
      setTosError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const _emailValid = await validateEmail(email);
      if (!_emailValid) {
        return;
      }

      const _phoneValid = validatePhone(phone);
      if (!_phoneValid) {
        return;
      }

      const _birthDateValid = validateBirthDate(birthDate);
      if (!birthDate || !_birthDateValid) {
        return;
      }

      if (password.length < 6) {
        setPasswordError(true);
        setRecaptchaError(false);
        setPasswordsDontMatch(false);
        setError(false);
        setTosError(false);
        return;
      }

      if (password !== confirmPassword) {
        setPasswordError(false);
        setRecaptchaError(false);
        setPasswordsDontMatch(true);
        setError(false);
        setTosError(false);
        return;
      }

      if (env.RECAPTCHA_ENABLED && recaptchaError) {
        return;
      }

      if (!tosChecked) {
        setPasswordError(false);
        setRecaptchaError(false);
        setPasswordsDontMatch(false);
        setError(false);
        setTosError(true);
        return;
      }

      setLoading(true);

      const data: bookcarsTypes.SignUpPayload = {
        email,
        phone,
        password,
        fullName,
        birthDate,
        language: UserService.getLanguage(),
      };

      const status = await UserService.signup(data);

      if (status === 200) {
        const signInResult = await UserService.signin({
          email,
          password,
        });

        if (signInResult.status === 200) {
          navigate(`/${window.location.search}`);
        } else {
          setPasswordError(false);
          setRecaptchaError(false);
          setPasswordsDontMatch(false);
          setError(true);
          setTosError(false);
        }
      } else {
        setPasswordError(false);
        setRecaptchaError(false);
        setPasswordsDontMatch(false);
        setError(true);
        setTosError(false);
      }
    } catch (err) {
      console.error(err);
      setPasswordError(false);
      setRecaptchaError(false);
      setPasswordsDontMatch(false);
      setError(true);
      setTosError(false);
    } finally {
      setLoading(false);
    }
  };

  const onLoad = (user?: bookcarsTypes.User) => {
    if (user) {
      navigate("/");
    } else {
      setLanguage(UserService.getLanguage());
      setVisible(true);
    }
  };

  //   const datePickerRef = useRef<DatePicker | null>(null);
  const [fullNameRef, fullNameInView] = useInView({ triggerOnce: true });
  const [emailRef, emailInView] = useInView({ triggerOnce: true });
  const [phoneRef, phoneInView] = useInView({ triggerOnce: true });
  const [passwordRef, passwordInView] = useInView({ triggerOnce: true });
  const [birthDateRef, birthDateInView] = useInView({ triggerOnce: true });
  const [confirmPasswordRef, confirmPasswordInView] = useInView({
    triggerOnce: true,
  });

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout strict={false} onLoad={onLoad}>
      {visible && (
        <div className="unified-form-page">
          <div className="unified-form-container">
            <div className="unified-form-header">
              <TextAnime className="unified-form-title text-anime-style-3" tag="h2">
                {strings.SIGN_UP}
              </TextAnime>
              <p className="unified-form-subtitle">{strings.DESCRIPTION}</p>
            </div>
            
            <form
              id="signUpForm"
              className="unified-form-body"
              onSubmit={handleSubmit}
            >
              <div className="unified-form-group">
                <label htmlFor="fullName" className="unified-form-label">
                  {strings.FULL_NAME}
                </label>
                <motion.input
                  ref={fullNameRef}
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={handleFullNameChange}
                  className="unified-form-input"
                  placeholder={strings.FULL_NAME_PLACEHOLDER}
                  required
                  autoComplete="off"
                  variants={itemVariants}
                  initial="hidden"
                  animate={fullNameInView ? "visible" : "hidden"}
                />
              </div>
              
              <div className="unified-form-group">
                <label htmlFor="email" className="unified-form-label">
                  {strings.EMAIL}
                </label>
                <motion.input
                  ref={emailRef}
                  id="email"
                  type="email"
                  value={email}
                  onBlur={handleEmailBlur}
                  onChange={handleEmailChange}
                  className="unified-form-input"
                  placeholder={strings.EMAIL_PLACEHOLDER}
                  required
                  autoComplete="off"
                  variants={itemVariants}
                  initial="hidden"
                  animate={emailInView ? "visible" : "hidden"}
                />
                {!emailValid && (
                  <span className="unified-form-field-error">
                    {strings.EMAIL_UNVALID}
                  </span>
                )}
                {emailError && (
                  <span className="unified-form-field-error">
                    {strings.EMAIL_REGISTERED}
                  </span>
                )}
              </div>
              
              <div className="unified-form-group">
                <label htmlFor="phone" className="unified-form-label">
                  {strings.PHONE}
                </label>
                <motion.input
                  ref={phoneRef}
                  id="phone"
                  type="tel"
                  value={phone}
                  onBlur={handlePhoneBlur}
                  onChange={handlePhoneChange}
                  className="unified-form-input"
                  placeholder="Phone number"
                  required
                  autoComplete="off"
                  variants={itemVariants}
                  initial="hidden"
                  animate={phoneInView ? "visible" : "hidden"}
                />
                {!phoneValid && (
                  <span className="unified-form-field-error">
                    {strings.PHONE_UNVALID}
                  </span>
                )}
              </div>
              
              <div className="unified-form-group">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <label className="unified-form-label">{strings.BIRTH_DATE}</label>
                  <DatePicker
                    className="unified-form-datepicker"
                    value={birthDate}
                    onChange={(_birthDate) => {
                      if (_birthDate) {
                        const _birthDateValid = validateBirthDate(_birthDate);
                        setBirthDate(_birthDate);
                        setBirthDateValid(_birthDateValid);
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined"
                      }
                    }}
                  />
                </LocalizationProvider>
                {!birthDateValid && (
                  <span className="unified-form-field-error">
                    {strings.BIRTH_DATE_UNVALID}
                  </span>
                )}
              </div>
              
              <div className="unified-form-group">
                <label htmlFor="password" className="unified-form-label">
                  {strings.PASSWORD}
                </label>
                <motion.input
                  ref={passwordRef}
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="unified-form-input"
                  placeholder={strings.PASSWORD_PLACEHOLDER}
                  required
                  autoComplete="off"
                  variants={itemVariants}
                  initial="hidden"
                  animate={passwordInView ? "visible" : "hidden"}
                />
              </div>
              
              <div className="unified-form-group">
                <label htmlFor="confirmPassword" className="unified-form-label">
                  {strings.CONFIRM_PASSWORD}
                </label>
                <motion.input
                  ref={confirmPasswordRef}
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="unified-form-input"
                  placeholder={strings.CONFIRM_PASSWORD_PLACEHOLDER}
                  required
                  autoComplete="off"
                  variants={itemVariants}
                  initial="hidden"
                  animate={confirmPasswordInView ? "visible" : "hidden"}
                />
              </div>
              
              {env.RECAPTCHA_ENABLED && (
                <div className="unified-form-group">
                  <GoogleReCaptcha onVerify={handleRecaptchaVerify} />
                </div>
              )}
              
              <div className="unified-form-checkbox-group">
                <input
                  type="checkbox"
                  checked={tosChecked}
                  onChange={handleTosChange}
                  className="unified-form-checkbox"
                  id="terms"
                />
                <label className="unified-form-checkbox-label" htmlFor="terms">
                  {strings.AGREE} <Link to="/terms" className="unified-form-link">{strings.TERMS}</Link>
                </label>
              </div>
              
              <button type="submit" className="unified-form-button primary" disabled={loading}>
                {loading ? "Creating Account..." : strings.SIGN_UP}
              </button>
              
              <div className="unified-form-links">
                <div className="unified-form-divider">
                  <span>or</span>
                </div>
                <p>
                  {strings.ALREADY + " "}
                  <Link to="/sign-in" className="unified-form-link">
                    {strings.SIGN_IN}
                  </Link>
                </p>
              </div>
              
              {(passwordError || passwordsDontMatch || recaptchaError || tosError || error) && (
                <div className="unified-form-error">
                  {passwordError && strings.PASSWORD_ERROR}
                  {passwordsDontMatch && strings.CONFIRM_PASSWORD_ERROR}
                  {recaptchaError && strings.RECAPTCHA_ERROR}
                  {tosError && strings.TOS_ERROR}
                  {error && strings.SIGN_UP_ERROR}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      {loading && <LoadingSpinner />}
    </Layout>
  );
};

export default SignUp;
