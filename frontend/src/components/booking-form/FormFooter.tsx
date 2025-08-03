import React from "react";
import { Grid, Typography } from "@mui/material";

export interface FormData {
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

const FormFooter: React.FC<{
  formData: FormData;
  activeStep: number;
  isLaptop: boolean;
  addReturn?: boolean;
  price: number;
}> = ({ formData, activeStep, isLaptop, addReturn, price }) => {
  return (
    <div className="form-footer">
      <Grid container={isLaptop} spacing={2}>
        <Grid item xs={4}>
          <div className="footer-section">
            <Typography variant="subtitle1">Travel Details</Typography>
            <Typography variant="body2">
              From: {formData.travelDetails.from}
            </Typography>
            {formData.travelDetails.flightNumber && (
              <Typography variant="body2">
                Flight: {formData.travelDetails.flightNumber}
              </Typography>
            )}
            {formData.travelDetails.pickupTime && (
              <Typography variant="body2">
                Time: {formData.travelDetails.pickupTime}
              </Typography>
            )}
            <Typography variant="body2">
              To: {formData.travelDetails.to}
            </Typography>
            {formData.travelDetails.exactAddress && (
              <Typography variant="body2">
                Address: {formData.travelDetails.exactAddress}
              </Typography>
            )}
            {addReturn && formData.travelDetails.returnTime && (
              <Typography variant="body2">
                Return Time: {formData.travelDetails.returnTime}
              </Typography>
            )}
          </div>
        </Grid>

        {activeStep >= 1 && (
          <Grid item xs={4}>
            <div className="footer-section">
              <Typography variant="subtitle1">Personal Details</Typography>
              {formData.personalDetails.firstName && (
                <Typography variant="body2">
                  First Name: {formData.personalDetails.firstName}
                </Typography>
              )}
              {formData.personalDetails.lastName && (
                <Typography variant="body2">
                  Last Name: {formData.personalDetails.lastName}
                </Typography>
              )}
              {formData.personalDetails.email && (
                <Typography variant="body2">
                  Email: {formData.personalDetails.email}
                </Typography>
              )}
              {formData.personalDetails.phone && (
                <Typography variant="body2">
                  Phone: {formData.personalDetails.phone}
                </Typography>
              )}
            </div>
          </Grid>
        )}

        {activeStep === 2 && (
          <Grid item xs={4}>
            <div className="footer-section">
              <Typography variant="subtitle1">Payment</Typography>
              <Typography variant="body2">
                Method:{" "}
                {formData.paymentMethod === "online" ? "Online" : "Cash"}
              </Typography>
              <Typography variant="body2">Amount: ${price}</Typography>
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default FormFooter;
