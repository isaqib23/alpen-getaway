import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { loadStripe } from "@stripe/stripe-js";
import ProgressStepper from "./ProgressStepper";
import BookingDetails from "./BookingDetails";
import PersonalDetails from "./PersonalDetails";
import PaymentDetails from "./PaymentDetails";
import FormFooter from "./FormFooter";
import FormNavigation from "./FormNavigation";

import * as bookcarsTypes from "../../types/bookcars-types";
import * as UserService from "../../services/UserService";
import * as StripeService from "../../services/StripeService";
import * as BookingService from "../../services/BookingService";
import env from "../../config/env.config";

interface BookingFormProps {
  from: bookcarsTypes.Location | undefined;
  to: bookcarsTypes.Location | undefined;
  addReturn?: boolean;
  carImage: string | undefined;
  price: number;
  carId?: string;
  pickupDateTime?: Date;
  dropoffDateTime?: Date;
  recaptchaEnabled?: boolean;
  onSubmit: (data: any) => void;
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

interface BookingAvailability {
  available: boolean;
  message?: string;
}

interface BookingQuote {
  totalAmount: number;
  breakdown?: {
    basePrice: number;
    taxes: number;
    fees: number;
  };
}

const BookingForm: React.FC<BookingFormProps> = ({
  from,
  to,
  addReturn = false,
  carImage,
  price,
  carId,
  pickupDateTime,
  dropoffDateTime,
  onSubmit,
}) => {
  const isLaptop = useMediaQuery({ query: "(min-width: 992px)" });
  const [activeStep, setActiveStep] = useState(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [customerId, setCustomerId] = useState<string | null>(null);
  
  // New state for availability checking and quote generation
  const [availabilityChecking, setAvailabilityChecking] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<BookingAvailability | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [currentPrice, setCurrentPrice] = useState(price);

  const [formData, setFormData] = useState<FormData>({
    travelDetails: {
      from: from?.name,
      to: to?.name,
      flightNumber: "",
      pickupTime: "",
      exactAddress: "",
      returnTime: "",
      returnFlightNumber: "",
    },
    personalDetails: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      additionalInfo: "",
    },
    paymentMethod: "online",
  });

  const steps = ["Booking Details", "Personal Details", "Payment Details"];

  const handleInputChange = (field: string, value: string) => {
    const [section, key] = field.split(".");

    if (section !== "travelDetails" && section !== "personalDetails") {
      throw new Error(`Invalid form section: ${section}`);
    }

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handlePhoneChange = (phone: string) => {
    setFormData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        phone,
      },
    }));
  };

  const handlePaymentChange = (type: "online" | "cash") => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: type,
    }));

    // Reset payment state when changing payment method
    if (type === "cash") {
      setClientSecret(null);
      setSessionId(undefined);
      setCustomerId(null);
    }
  };

  // Check availability for the current booking
  const checkAvailability = async () => {
    if (!carId || !from || !to || !pickupDateTime || !dropoffDateTime) {
      console.warn("Missing required data for availability check");
      return;
    }

    try {
      setAvailabilityChecking(true);
      setAvailabilityError(null);

      const availabilityData = {
        carId,
        pickupLocationId: from._id,
        dropoffLocationId: to._id,
        pickupDateTime: pickupDateTime.toISOString(),
        dropoffDateTime: dropoffDateTime.toISOString(),
      };

      console.log("Checking availability with data:", availabilityData);
      
      const result = await BookingService.getAvailability(availabilityData);
      setAvailability(result);

      if (!result.available) {
        setAvailabilityError(result.message || "This car is not available for the selected dates");
      }

      return result;
    } catch (err) {
      console.error("Availability check error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to check availability";
      setAvailabilityError(errorMessage);
      setAvailability({ available: false, message: errorMessage });
      return { available: false, message: errorMessage };
    } finally {
      setAvailabilityChecking(false);
    }
  };

  // Get price quote for the current booking
  const getQuote = async () => {
    if (!carId || !from || !to || !pickupDateTime || !dropoffDateTime) {
      console.warn("Missing required data for quote");
      return;
    }

    try {
      setQuoteLoading(true);
      setQuoteError(null);

      const quoteData = {
        carId,
        pickupLocationId: from._id,
        dropoffLocationId: to._id,
        pickupDateTime: pickupDateTime.toISOString(),
        dropoffDateTime: dropoffDateTime.toISOString(),
        // Include any additional options if needed
        additionalDriver: false,
        fullInsurance: false,
        theftProtection: false,
        collisionDamageWaiver: false,
        amendments: false,
        cancellation: false,
      };

      console.log("Getting quote with data:", quoteData);
      
      const result = await BookingService.getQuote(quoteData);
      setQuote(result);
      
      // Update the current price with the quoted amount
      if (result.totalAmount) {
        setCurrentPrice(result.totalAmount);
      }

      return result;
    } catch (err) {
      console.error("Quote error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to get price quote";
      setQuoteError(errorMessage);
      // Fallback to original price if quote fails
      setCurrentPrice(price);
      return null;
    } finally {
      setQuoteLoading(false);
    }
  };

  const getClientSecret = async () => {
    try {
      setPaymentProcessing(true);
      setPaymentError(null);

      if (formData.paymentMethod === "online") {
        // Only proceed if we're using online payment
        const fullName =
          `${formData.personalDetails.firstName} ${formData.personalDetails.lastName}`.trim();

        // Use the current quoted price instead of the original price
        const finalAmount = quote?.totalAmount || currentPrice || price;

        // Prepare booking data for integrated booking + payment flow
        const bookingData: bookcarsTypes.CheckoutPayload = {
          passengerName: fullName,
          passengerEmail: formData.personalDetails.email,
          passengerPhone: formData.personalDetails.phone,
          pickupAddress: formData.travelDetails.from || from?.name,
          dropoffAddress: formData.travelDetails.to || to?.name,
          pickupDateTime: pickupDateTime,
          dropoffDateTime: dropoffDateTime,
          carId: carId,
          flightNumber: formData.travelDetails.flightNumber,
          specialRequirements: formData.personalDetails.additionalInfo,
          paymentMethod: formData.paymentMethod === 'online' ? 'ONLINE' : 'CASH',
          totalAmount: finalAmount,
        };

        // Prepare payment payload with booking data for integrated flow
        const payload: bookcarsTypes.CreatePaymentPayload = {
          bookingData: bookingData, // Include booking data for integrated flow
          amount: finalAmount,
          currency: env.STRIPE_CURRENCY_CODE,
          locale: UserService.getLanguage(),
          receiptEmail: formData.personalDetails.email,
          name: `${from?.name || ""} to ${to?.name || ""}`,
          description: "BookCars Web Service",
          customerName: fullName,
          successUrl: `${window.location.origin}/checkout-session?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/booking-form`,
        };

        console.log("Creating integrated booking + payment with payload:", payload);

        const res = await StripeService.createCheckoutSession(payload);
        console.log("Payment session created:", res);

        if (res && (res.clientSecret || res.sessionUrl)) {
          setClientSecret(res.clientSecret);
          setSessionId(res.sessionId || res.paymentIntentId);
          setCustomerId(res.customerId);
          
          // If we got a sessionUrl, redirect directly to Stripe Checkout
          if (res.sessionUrl) {
            window.location.href = res.sessionUrl;
            return null;
          }
          
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

  const handleNext = async () => {
    // Check availability when moving from first step (booking details)
    if (activeStep === 0) {
      const availabilityResult = await checkAvailability();
      if (!availabilityResult?.available) {
        // Don't proceed if car is not available
        return;
      }
      
      // Get updated quote after availability check
      await getQuote();
    }

    // If moving to payment step and online payment is selected
    if (activeStep === 1 && formData.paymentMethod === "online") {
      const secret = await getClientSecret();
      if (!secret) {
        // Don't proceed if payment creation failed
        return;
      }
    }

    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      // Final step submission - include availability and quote data
      const finalData = {
        ...formData,
        availability,
        quote,
        currentPrice,
        paymentDetails: {
          clientSecret,
          sessionId,
          customerId,
        },
      };
      onSubmit(finalData);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Effect to check initial availability and get quote when component loads
  useEffect(() => {
    const initializeBooking = async () => {
      if (carId && from && to && pickupDateTime && dropoffDateTime) {
        // Check availability first
        const availabilityResult = await checkAvailability();
        if (availabilityResult?.available) {
          // If available, get the quote
          await getQuote();
        }
      }
    };

    initializeBooking();
  }, [carId, from?._id, to?._id, pickupDateTime, dropoffDateTime]);

  // Effect to initialize payment when first reaching payment step
  useEffect(() => {
    if (
      activeStep === 2 &&
      formData.paymentMethod === "online" &&
      !clientSecret
    ) {
      getClientSecret();
    }
  }, [activeStep, formData.paymentMethod]);

  return (
    <div className="b2b-form-container">
      <div className="b2b-form">
        <ProgressStepper activeStep={activeStep} steps={steps} />

        {/* Availability and Quote Status */}
        {(availabilityChecking || quoteLoading || availabilityError || quoteError) && (
          <div className="booking-status-section" style={{ marginBottom: '20px', padding: '15px', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
            {availabilityChecking && (
              <div className="availability-checking" style={{ color: '#1976d2', marginBottom: '10px' }}>
                🔍 Checking availability...
              </div>
            )}
            {quoteLoading && (
              <div className="quote-loading" style={{ color: '#1976d2', marginBottom: '10px' }}>
                💰 Getting price quote...
              </div>
            )}
            {availabilityError && (
              <div className="availability-error" style={{ color: '#d32f2f', marginBottom: '10px' }}>
                ❌ {availabilityError}
              </div>
            )}
            {quoteError && (
              <div className="quote-error" style={{ color: '#ed6c02', marginBottom: '10px' }}>
                ⚠️ {quoteError} - Using original pricing.
              </div>
            )}
            {availability?.available && !availabilityError && (
              <div className="availability-success" style={{ color: '#2e7d32', marginBottom: '10px' }}>
                ✅ Car is available for your selected dates!
              </div>
            )}
            {quote && !quoteError && (
              <div className="quote-success" style={{ color: '#2e7d32' }}>
                💰 Updated price: ${quote.totalAmount || currentPrice}
                {quote.breakdown && (
                  <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                    Base: ${quote.breakdown.basePrice} | Taxes: ${quote.breakdown.taxes} | Fees: ${quote.breakdown.fees}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="form-sections">
          {activeStep === 0 && (
            <BookingDetails
              formData={formData}
              onInputChange={handleInputChange}
              addReturn={addReturn}
            />
          )}

          {activeStep === 1 && (
            <PersonalDetails
              formData={formData}
              onInputChange={handleInputChange}
              onPhoneChange={handlePhoneChange}
            />
          )}

          {activeStep === 2 && (
            <PaymentDetails
              formData={formData}
              onPaymentChange={handlePaymentChange}
              carImage={carImage}
              price={currentPrice}
              clientSecret={clientSecret}
              paymentProcessing={paymentProcessing}
              paymentError={paymentError}
            />
          )}
        </div>

        <FormNavigation
          activeStep={activeStep}
          stepsLength={steps.length}
          onBack={handleBack}
          onNext={handleNext}
          payOnline={formData.paymentMethod === "online"}
          isProcessing={paymentProcessing || availabilityChecking || quoteLoading}
          disabled={availabilityError !== null}
        />

        <FormFooter
          formData={formData}
          activeStep={activeStep}
          isLaptop={isLaptop}
          addReturn={addReturn}
          price={currentPrice}
        />
      </div>
    </div>
  );
};

export default BookingForm;
