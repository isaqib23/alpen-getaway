import React from "react";
import { Typography } from "@mui/material";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import * as bookcarsHelper from "../../utils/bookcars-helper";
import env from "../../config/env.config";

interface PaymentDetailsProps {
  formData: {
    paymentMethod: "online" | "cash";
    personalDetails: {
      email: string;
    };
  };
  onPaymentChange: (type: "online" | "cash") => void;
  carImage?: string;
  price: number;
  clientSecret: string | null;
  paymentProcessing?: boolean;
  paymentError?: string | null;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  formData,
  onPaymentChange,
  carImage,
  price,
  clientSecret,
  paymentProcessing = false,
  paymentError = null,
}) => {
  const stripePromise = loadStripe(env.STRIPE_PUBLISHABLE_KEY);

  return (
    <div className="payment-details">
      <div className="price-display">
        <div className="car-image-container">
          {carImage && (
            <img
              src={bookcarsHelper.joinURL(env.CDN_CARS, carImage)}
              alt="Selected Car"
            />
          )}
        </div>
        <div className="price-container">
          <Typography variant="h4">Total Price: $ {price}</Typography>
        </div>
      </div>

      <Typography variant="body1" className="payment-methods-title">
        Pay as you wish, select the payment method which suits you!
      </Typography>

      <div className="payment-options">
        <label className="radio-container">
          <input
            type="radio"
            name="paymentMethod"
            checked={formData.paymentMethod === "online"}
            onChange={() => onPaymentChange("online")}
          />
          <span className="custom-radio"></span>
          <span>Pay Online</span>
        </label>

        <label className="radio-container">
          <input
            type="radio"
            name="paymentMethod"
            checked={formData.paymentMethod === "cash"}
            onChange={() => onPaymentChange("cash")}
          />
          <span className="custom-radio"></span>
          <span>
            Pay in Cash on board (Cash should be paid in Euro (€) Only)
          </span>
        </label>
      </div>

      {formData.paymentMethod === "online" && (
        <div className="stripe-form-container">
          {paymentProcessing && (
            <div className="payment-status">
              <Typography variant="body1">
                Processing payment setup...
              </Typography>
            </div>
          )}

          {paymentError && (
            <div className="payment-error">
              <Typography variant="body1" color="error">
                Error setting up payment: {paymentError}
              </Typography>
            </div>
          )}

          {clientSecret && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}

          {!clientSecret && !paymentProcessing && !paymentError && (
            <div className="payment-status">
              <Typography variant="body1">
                Payment form will appear here when ready
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
