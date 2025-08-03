import React from "react";
import "react-phone-input-2/lib/style.css";

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

interface FormStepProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  addReturn?: boolean;
}

const TravelDetailsSection: React.FC<FormStepProps> = ({
  formData,
  onInputChange,
  addReturn,
}) => {
  return (
    <div className="booking-form-section travel-details-section">
      <h3 className="section-title">Travel Details</h3>
      <div className="travel-details">
        <div className="travel-section outbound">
          <h4 className="travel-section-title">Outbound Journey</h4>
          <div className="form-group">
            <label>From</label>
            <input
              type="text"
              className="details-input"
              value={formData.travelDetails.from || ""}
            />
          </div>
          <div className="form-group">
            <label>Flight Number</label>
            <input
              type="text"
              className="details-input"
              value={formData.travelDetails.flightNumber}
              onChange={(e) =>
                onInputChange("travelDetails.flightNumber", e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              className="details-input"
              value={formData.travelDetails.pickupTime}
              onChange={(e) =>
                onInputChange("travelDetails.pickupTime", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>To</label>
            <input
              type="text"
              className="details-input"
              value={formData.travelDetails.to || ""}
            />
          </div>
          <div className="form-group">
            <label>Exact Address</label>
            <input
              type="text"
              className="details-input"
              value={formData.travelDetails.exactAddress}
              onChange={(e) =>
                onInputChange("travelDetails.exactAddress", e.target.value)
              }
            />
          </div>
        </div>

        {addReturn && (
          <div className="travel-section return">
            <h4 className="travel-section-title">Return Journey</h4>
            <div className="form-group">
              <label>From</label>
              <input
                type="text"
                className="details-input"
                value={formData.travelDetails.to || ""}
              />
            </div>
            <div className="form-group">
              <label>Exact Address</label>
              <input
                type="text"
                className="details-input"
                value={formData.travelDetails.exactAddress}
                onChange={(e) =>
                  onInputChange("travelDetails.exactAddress", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                className="details-input"
                value={formData.travelDetails.returnTime}
                onChange={(e) =>
                  onInputChange("travelDetails.returnTime", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>To</label>
              <input
                type="text"
                className="details-input"
                value={formData.travelDetails.from || ""}
              />
            </div>
            <div className="form-group">
              <label>Flight Number</label>
              <input
                type="text"
                className="details-input"
                value={formData.travelDetails.returnFlightNumber}
                onChange={(e) =>
                  onInputChange(
                    "travelDetails.returnFlightNumber",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelDetailsSection;
