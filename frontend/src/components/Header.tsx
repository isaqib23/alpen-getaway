import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import * as bookcarsTypes from "../types/bookcars-types";
import env from "../config/env.config";
import { strings } from "../lang/header";
import { strings as commonStrings } from "../lang/common";
import * as UserService from "../services/UserService";
import * as NotificationService from "../services/NotificationService";
import * as langHelper from "../common/langHelper";
import * as helper from "../common/helper";
import { useGlobalContext, GlobalContextType } from "../context/GlobalContext";

import "../assets/css/slicknav.min.css";
import "../assets/css/header.css";

interface HeaderProps {
  user?: bookcarsTypes.User;
  hidden?: boolean;
  hideSignin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, hidden, hideSignin }) => {
  const navigate = useNavigate();
  const { notificationCount, setNotificationCount } =
    useGlobalContext() as GlobalContextType;

  const [lang, setLang] = useState(helper.getLanguage(env.DEFAULT_LANGUAGE));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<HTMLElement | null>(null);
  const [sideAnchorEl, setSideAnchorEl] = useState<HTMLElement | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const refreshPage = () => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("l")) {
      params.delete("l");
      window.location.href =
        window.location.href.split("?")[0] +
        ([...params].length > 0 ? `?${params}` : "");
    } else {
      window.location.reload();
    }
  };

  const handleLangMenuClose = async (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(null);

    const { code } = event.currentTarget.dataset;
    if (code) {
      setLang(helper.getLanguage(code));
      const currentLang = UserService.getLanguage();
      if (isSignedIn && user) {
        // Update user language
        const data: bookcarsTypes.UpdateLanguagePayload = {
          id: user._id as string,
          language: code,
        };
        const status = await UserService.updateLanguage(data);
        if (status === 200) {
          UserService.setLanguage(code);
          if (code && code !== currentLang) {
            // Refresh page
            refreshPage();
          }
        } else {
          toast(commonStrings.CHANGE_LANGUAGE_ERROR, { type: "error" });
        }
      } else {
        UserService.setLanguage(code);
        if (code && code !== currentLang) {
          // Refresh page
          refreshPage();
        }
      }
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleSignout = async () => {
    await UserService.signout();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSideMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSideAnchorEl(event.currentTarget);
  };

  const handleSideMenuClose = () => {
    setSideAnchorEl(null);
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  useEffect(() => {
    const language = langHelper.getLanguage();
    setLang(helper.getLanguage(language));
    langHelper.setLanguage(strings, language);
  }, []);

  useEffect(() => {
    if (!hidden) {
      if (user) {
        NotificationService.getNotificationCounter(user._id as string).then(
          (notificationCounter) => {
            setIsSignedIn(true);
            setNotificationCount(notificationCounter.count);
            setIsLoading(false);
            setIsLoaded(true);
          }
        );
      } else {
        setIsLoading(false);
        setIsLoaded(true);
      }
    }
  }, [hidden, user, setNotificationCount]);

  useEffect(() => {
    // Load jQuery first
    const jQueryScript = document.createElement("script");
    jQueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    jQueryScript.async = true;
    document.body.appendChild(jQueryScript);

    // Load SlickNav script after jQuery
    jQueryScript.onload = () => {
      const slickNavScript = document.createElement("script");
      slickNavScript.src = "/js/jquery.slicknav.js";
      slickNavScript.async = true;
      document.body.appendChild(slickNavScript);

      slickNavScript.onload = () => {
        // Initialize SlickNav and other functionalities
        (window as any).$(() => {
          (window as any).$("#menu").slicknav({
            label: "",
            prependTo: ".responsive-menu",
          });

          // Scroll to top functionality
          (window as any).$("a[href='#top']").click(() => {
            (window as any).$("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
          });
        });
      };
    };

    return () => {
      document.body.removeChild(jQueryScript);
      // Clean up the SlickNav script if needed
    };
  }, []);

  return (
    <>
      {!hidden && (
        <div>
          {/* Header Start */}
          <header className="main-header">
            <div className="header-sticky">
              <nav className="navbar navbar-expand-lg">
                <div className="container">
                  {/* Logo Start */}
                  <Link className="navbar-brand" to="/">
                    <img src="/assets/images/logo.png" alt="Logo" />
                  </Link>
                  {/* Logo End */}

                  {/* Main Menu Start */}
                  <div className="collapse navbar-collapse main-menu">
                    <div className="nav-menu-wrapper">
                      <ul className="navbar-nav mr-auto" id="menu">
                        <li className="nav-item">
                          <Link className="nav-link" to="/">
                            {strings.HOME}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="/about">
                            {strings.ABOUT}
                          </Link>
                        </li>
                        <li className="nav-item submenu">
                          <Link className="nav-link" to="/services">
                            {strings.OUR_SERVICES}
                          </Link>
                          <ul>
                            <li>
                              <Link to="/booking-management">
                                Booking Management
                              </Link>
                            </li>
                            <li>
                              <Link to="/destinations">
                                Destinations
                              </Link>
                            </li>
                            <li>
                              <Link to="/pricing">
                                Pricing
                              </Link>
                            </li>
                            <li>
                              <Link to="/cars">
                                Our Fleet
                              </Link>
                            </li>
                            <li>
                              <Link to="/affiliate">
                                Affiliate Booking
                              </Link>
                            </li>
                            <li>
                              <Link to="/b2b">
                                B2B Partnership
                              </Link>
                            </li>
                            <li>
                              <Link to="/contact">
                                Customer Service
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="/contact">
                            {strings.CONTACT}
                          </Link>
                        </li>
                      </ul>
                    </div>
                    {/* Let's Start Button Start */}
                    <div className="header-btn d-inline-flex align-items-center">
                      {/* Sign In Link */}
                      {!hideSignin && !isSignedIn && isLoaded && !loading && (
                        <Link className="nav-link me-3 text-decoration-none" to="/sign-in">
                          {strings.SIGN_IN}
                        </Link>
                      )}
                      
                      {/* Account Menu */}
                      {isSignedIn && (
                        <div className="dropdown me-3">
                          <button
                            className="btn btn-link nav-link p-0 border-0 bg-transparent text-decoration-none"
                            type="button"
                            id="accountDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {strings.ACCOUNT}
                          </button>
                          <ul className="dropdown-menu" aria-labelledby="accountDropdown">
                            <li>
                              <Link className="dropdown-item" to="/bookings">
                                {strings.BOOKINGS}
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="/notifications">
                                <span className="me-2">{strings.NOTIFICATIONS}</span>
                                {notificationCount > 0 && (
                                  <span className="badge bg-info">
                                    {notificationCount}
                                  </span>
                                )}
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="/settings">
                                {strings.SETTINGS}
                              </Link>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={handleSignout}
                              >
                                {strings.SIGN_OUT}
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                      
                      <Link to="/b2b" className="btn-default me-3">
                        {strings.BUTTON}
                      </Link>

                      {/* Language Selection with Globe Icon */}
                      {isLoaded && !loading && (
                        <div className="dropdown">
                          <button
                            className="btn btn-link p-0 border-0 bg-transparent"
                            type="button"
                            id="languageDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            title="Select Language"
                            style={{ color: '#000', marginLeft: '15px' }}
                          >
                            <i className="fas fa-globe fs-5"></i>
                          </button>
                          <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                            {env._LANGUAGES.map((language) => (
                              <li key={language.code}>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={handleLangMenuClose}
                                  data-code={language.code}
                                >
                                  {language.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {/* Let's Start Button End */}
                  </div>
                  {/* Main Menu End */}
                  <div className="navbar-toggle" />
                </div>
              </nav>
              <div className="responsive-menu" />
            </div>
          </header>
          {/* Header End */}
        </div>
      )}
    </>
  );
};

export default Header;
