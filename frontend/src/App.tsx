import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import { init as initGA } from "./common/ga4";
import env from "./config/env.config";

import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import ApiErrorBoundary from "./components/ApiErrorBoundary";
import cursor from "./components/Cursor";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const About = lazy(() => import("./pages/About"));
const B2B = lazy(() => import("./pages/B2B"));
const Booking = lazy(() => import("./pages/Booking"));
const Bookings = lazy(() => import("./pages/Bookings"));
const BookingForm = lazy(() => import("./pages/BookingForm"));
const BookingManagement = lazy(() => import("./pages/BookingManagement"));
const Cars = lazy(() => import("./pages/Cars"));
const Contact = lazy(() => import("./pages/Contact"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const CheckoutSession = lazy(() => import("./pages/CheckoutSession"));
const CarDetails = lazy(() => import("./pages/CarDetails"));
const Destinations = lazy(() => import("./pages/Destinations"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Home = lazy(() => import("./pages/Home"));
const Settings = lazy(() => import("./pages/Settings"));
const Terms = lazy(() => import("./pages/Terms"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Affiliate = lazy(() => import("./pages/Affiliate"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const DSGVO = lazy(() => import("./pages/DSGVO"));

// Pages without Backend and Api support
// const CarTypes = lazy(() => import("./pages/CarTypes"));
// const Blog = lazy(() => import("./pages/Blog"));
// const BlogDetails = lazy(() => import("./pages/BlogDetails"));
// const FAQs = lazy(() => import("./pages/FAQs"));
// const Drivers = lazy(() => import("./pages/Drivers"));
// const DriverDetails = lazy(() => import("./pages/DriverDetails"));
// const ImageGallery = lazy(() => import("./pages/ImageGallery"));
// const VideoGallery = lazy(() => import("./pages/VideoGallery"));
// const Testimonials = lazy(() => import("./pages/Testimonials"));

if (env.GOOGLE_ANALYTICS_ENABLED) {
  initGA();
}

const AppContent = () => {
  const { isLoading } = useLoading();

  useEffect(() => {
    // Initialize the cursor when the component mounts
    cursor.initialize();
  }, []);
  
  return (
    <Router>
      <div className={`app ${!isLoading ? 'loaded' : ''}`}>
        <ErrorBoundary>
          <ApiErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/checkout-session/:sessionId"
              element={<CheckoutSession />}
            />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/affiliate" element={<Affiliate />} />
            <Route path="/b2b" element={<B2B />} />
            <Route path="/bookings" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-form" element={<BookingForm />} />
            <Route
              path="/booking-management"
              element={
                <ProtectedRoute>
                  <BookingManagement />
                </ProtectedRoute>
              }
            />
            <Route path="/cars" element={<Cars />} />
            <Route path="/fleet" element={<Cars />} />
            <Route path="/car-details" element={<CarDetails />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="/dsgvo" element={<DSGVO />} />
            <Route path="/services" element={<ServiceDetails />} />
            <Route path="/service-details" element={<ServiceDetails />} />
                <Route path="*" element={<NotFound />} />

                {/* Routes without Backend & Api support
                <Route path="/car-types" element={<CarTypes />} />
                <Route path="/blog-details" element={<BlogDetails />} />
                <Route path="/blog" element={<BlogDetails />} />
                <Route path="/driver-details" element={<DriverDetails />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/image-gallery" element={<ImageGallery />} />
                <Route path="/video-gallery" element={<VideoGallery />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/faqs" element={<FAQs />} /> */}
              </Routes>
            </Suspense>
          </ApiErrorBoundary>
        </ErrorBoundary>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <LoadingProvider>
      <GlobalProvider>
        <AppContent />
      </GlobalProvider>
    </LoadingProvider>
  );
};

export default App;
