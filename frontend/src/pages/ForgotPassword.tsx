import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import validator from "validator";
import * as bookcarsTypes from "../types/bookcars-types";
import * as UserService from "../services/UserService";
import Layout from "../components/Layout";
import TextAnime from "../components/animations/TextAnime";
import { strings as commonStrings } from "../lang/common";
import { strings } from "../lang/reset-password";
import NoMatch from "./NotFound";
import * as helper from "../common/helper";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [noMatch, setNoMatch] = useState(false);
  const [sent, setSent] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (!e.target.value) {
      setError(false);
      setEmailValid(true);
    }
  };

  const validateEmail = async (_email: string) => {
    if (_email) {
      if (validator.isEmail(_email)) {
        try {
          const status = await UserService.validateEmail({ email: _email });

          if (status === 200) {
            // user not found (error)
            setError(true);
            setEmailValid(true);
            return false;
          }
          setError(false);
          setEmailValid(true);
          return true;
        } catch (err) {
          helper.error(err);
          setError(false);
          setEmailValid(true);
          return false;
        }
      } else {
        setError(false);
        setEmailValid(false);
        return false;
      }
    } else {
      setError(false);
      setEmailValid(true);
      return false;
    }
  };

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    await validateEmail(e.target.value);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    try {
      e.preventDefault();

      const _emailValid = await validateEmail(email);
      if (!_emailValid) {
        return;
      }

      const status = await UserService.resend(email, true);
      if (status === 200) {
        setError(false);
        setEmailValid(true);
        setSent(true);
      } else {
        setError(true);
        setEmailValid(true);
      }
    } catch {
      setError(true);
      setEmailValid(true);
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const onLoad = (user?: bookcarsTypes.User) => {
    if (user) {
      setNoMatch(true);
    } else {
      setVisible(true);
    }
  };

  const { ref: emailRef, inView: emailInView } = useInView({ triggerOnce: true });

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout onLoad={onLoad} strict={false}>
      {visible && (
        <div className="unified-form-page">
          <div className="unified-form-container">
            <div className="unified-form-header">
              <TextAnime className="unified-form-title text-anime-style-3" tag="h2">
                {strings.RESET_PASSWORD_HEADING}
              </TextAnime>
              <p className="unified-form-subtitle">
                {sent ? strings.EMAIL_SENT : strings.RESET_PASSWORD}
              </p>
            </div>

            {sent && (
              <div className="unified-form-body">
                <div className="unified-form-success">
                  {strings.EMAIL_SENT}
                </div>
                <div className="unified-form-links" style={{ marginTop: '30px' }}>
                  <Link to="/" className="unified-form-link">
                    {commonStrings.GO_TO_HOME}
                  </Link>
                </div>
              </div>
            )}

            {!sent && (
              <form className="unified-form-body" onSubmit={handleSubmit}>
                <div className="unified-form-group">
                  <label htmlFor="email" className="unified-form-label">
                    {commonStrings.EMAIL}
                  </label>
                  <motion.input
                    ref={emailRef}
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleEmailKeyDown}
                    onBlur={handleEmailBlur}
                    className="unified-form-input"
                    placeholder="Enter your email address"
                    required
                    autoComplete="off"
                    variants={itemVariants}
                    initial="hidden"
                    animate={emailInView ? "visible" : "hidden"}
                  />
                  {!emailValid && (
                    <span className="unified-form-field-error">
                      {commonStrings.EMAIL_NOT_VALID}
                    </span>
                  )}
                  {error && (
                    <span className="unified-form-field-error">
                      {strings.EMAIL_ERROR}
                    </span>
                  )}
                </div>

                <button type="submit" className="unified-form-button primary">
                  {strings.RESET}
                </button>

                <div className="unified-form-links">
                  <div className="unified-form-divider">
                    <span>or</span>
                  </div>
                  <p>
                    Remember your password?{" "}
                    <Link to="/sign-in" className="unified-form-link">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {noMatch && <NoMatch />}
    </Layout>
  );
};

export default ForgotPassword;
