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

const BookingDetails: React.FC<FormStepProps> = ({
  formData,
  onInputChange,
  addReturn,
}) => {
  return (
    <div className="travel-details">
      <div className="form-group">
        <label>From</label>
        <input type="text" value={formData.travelDetails.from || ""} readOnly />
      </div>
      <div className="form-group">
        <label>Flight Number</label>
        <input
          type="text"
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
          value={formData.travelDetails.pickupTime}
          onChange={(e) =>
            onInputChange("travelDetails.pickupTime", e.target.value)
          }
        />
      </div>

      <div className="form-group">
        <label>To</label>
        <input type="text" value={formData.travelDetails.to || ""} readOnly />
      </div>
      <div className="form-group">
        <label>Exact Address</label>
        <input
          type="text"
          value={formData.travelDetails.exactAddress}
          onChange={(e) =>
            onInputChange("travelDetails.exactAddress", e.target.value)
          }
        />
      </div>

      {addReturn && (
        <>
          <div className="form-group">
            <label>From</label>
            <input type="text" value={formData.travelDetails.from} readOnly />
          </div>
          <div className="form-group">
            <label>Exact Address</label>
            <input
              type="text"
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
              value={formData.travelDetails.returnTime}
              onChange={(e) =>
                onInputChange("travelDetails.returnTime", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>To</label>
            <input type="text" value={formData.travelDetails.to} readOnly />
          </div>
          <div className="form-group">
            <label>Flight Number</label>
            <input
              type="text"
              value={formData.travelDetails.returnFlightNumber}
              onChange={(e) =>
                onInputChange(
                  "travelDetails.returnFlightNumber",
                  e.target.value
                )
              }
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={formData.travelDetails.returnTime}
              onChange={(e) =>
                onInputChange("travelDetails.returnTime", e.target.value)
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BookingDetails;
