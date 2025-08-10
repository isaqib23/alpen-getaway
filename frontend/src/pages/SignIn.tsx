import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import TextAnime from "../components/animations/TextAnime";
import * as UserService from "../services/UserService";
import * as bookcarsTypes from "../types/bookcars-types";


import { strings } from "../lang/sign-in";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [blacklisted, setBlacklisted] = useState(false);
  const [stayConnected, setStayConnected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    try {
      e.preventDefault();

      const data = { email, password, stayConnected };

      const res = await UserService.signin(data);
      if (res.status === 200) {
        if (res.data.blacklisted) {
          await UserService.signout(false);
          setError(false);
          setBlacklisted(true);
        } else {
          setError(false);

          // Handle redirect after successful login
          const from = location.state?.from?.pathname || '/';
          const params = new URLSearchParams(window.location.search);
          
          if (params.has("from")) {
            const fromParam = params.get("from");
            if (fromParam === "car-details") {
              navigate(`/car-details${window.location.search}`);
            } else {
              navigate(from);
            }
          } else {
            navigate(from);
          }
        }
      } else {
        setError(true);
        setBlacklisted(false);
      }
    } catch {
      setError(true);
      setBlacklisted(false);
    }
  };

  console.log(error);
  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const onLoad = async (user?: bookcarsTypes.User) => {
    if (user) {
      const params = new URLSearchParams(window.location.search);
      if (params.has("from")) {
        const from = params.get("from");
        if (from === "car-details") {
          navigate(`/car-details${window.location.search}`);
        } else {
          navigate(`/${window.location.search}`);
        }
      } else {
        navigate(`/${window.location.search}`);
      }
    } else {
      setVisible(true);
    }
  };

  const emailRef = useInView({ triggerOnce: true });
  const passwordRef = useInView({ triggerOnce: true });

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
                {strings.SIGN_IN}
              </TextAnime>
              <p className="unified-form-subtitle">{strings.DESCRIPTION}</p>
            </div>
            
            <form
              id="signInForm"
              className="unified-form-body"
              onSubmit={handleSubmit}
            >
              <div className="unified-form-group">
                <label htmlFor="email" className="unified-form-label">
                  {strings.EMAIL}
                </label>
                <motion.input
                  ref={emailRef.ref}
                  type="email"
                  name="email"
                  className="unified-form-input"
                  id="email"
                  placeholder={strings.EMAIL_PLACEHOLDER}
                  value={email}
                  onChange={handleEmailChange}
                  required
                  variants={itemVariants}
                  initial="hidden"
                  animate={emailRef.inView ? "visible" : "hidden"}
                />
              </div>

              <div className="unified-form-group has-icon">
                <label htmlFor="password" className="unified-form-label">
                  {strings.PASSWORD}
                </label>
                <motion.input
                  ref={passwordRef.ref}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="unified-form-input has-icon"
                  id="password"
                  placeholder={strings.PASSWORD_PLACEHOLDER}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handlePasswordKeyDown}
                  required
                  variants={itemVariants}
                  initial="hidden"
                  animate={passwordRef.inView ? "visible" : "hidden"}
                />
                <button
                  type="button"
                  className="form-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              <div className="unified-form-checkbox-group">
                <input
                  type="checkbox"
                  className="unified-form-checkbox"
                  id="staySignedIn"
                  checked={stayConnected}
                  onChange={() => setStayConnected((prev) => !prev)}
                />
                <label className="unified-form-checkbox-label" htmlFor="staySignedIn">
                  {strings.STAY_CONNECTED}
                </label>
              </div>

              <button type="submit" className="unified-form-button primary">
                {strings.SIGN_IN}
              </button>

              <div className="unified-form-links">
                <p>
                  <Link to="/forgot-password" className="unified-form-link">
                    {strings.RESET_PASSWORD}
                  </Link>
                </p>
                
                <div className="unified-form-divider">
                  <span>or</span>
                </div>
                
                <p>
                  {strings.NO_ACCOUNT + " "}
                  <Link to="/sign-up" className="unified-form-link">
                    {strings.SIGN_UP}
                  </Link>
                </p>
              </div>

              {error && (
                <div className="unified-form-error">
                  {strings.ERROR_IN_SIGN_IN}
                </div>
              )}
              {blacklisted && (
                <div className="unified-form-error">
                  {strings.IS_BLACKLISTED}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SignIn;
