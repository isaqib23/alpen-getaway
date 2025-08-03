import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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

export interface FormStepProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  onPhoneChange: (phone: string) => void;
}

const PersonalDetailsSection: React.FC<FormStepProps> = ({
  formData,
  onInputChange,
  onPhoneChange,
}) => {
  return (
    <div className="booking-form-section personal-details-section">
      <h3 className="section-title">Personal Details</h3>
      <div className="personal-details">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            className="details-input"
            value={formData.personalDetails.firstName}
            onChange={(e) =>
              onInputChange("personalDetails.firstName", e.target.value)
            }
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            className="details-input"
            value={formData.personalDetails.lastName}
            onChange={(e) =>
              onInputChange("personalDetails.lastName", e.target.value)
            }
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="details-input"
            value={formData.personalDetails.email}
            onChange={(e) =>
              onInputChange("personalDetails.email", e.target.value)
            }
          />
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <PhoneInput
            country={"us"}
            value={formData.personalDetails.phone}
            onChange={onPhoneChange}
            inputClass="phone-input"
            containerClass="phone-input-container"
          />
        </div>
        <div className="form-group">
          <label>Additional Info (Optional)</label>
          <textarea
            className="details-textarea"
            value={formData.personalDetails.additionalInfo}
            onChange={(e) =>
              onInputChange("personalDetails.additionalInfo", e.target.value)
            }
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsSection;
