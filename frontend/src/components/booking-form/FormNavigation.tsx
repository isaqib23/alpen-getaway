import React from "react";
import { Button } from "@mui/material";

interface FormNavigationProps {
  activeStep: number;
  stepsLength: number;
  onBack: () => void;
  onNext: () => void;
  payOnline: boolean;
  isProcessing?: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  activeStep,
  stepsLength,
  onBack,
  onNext,
  payOnline,
  isProcessing = false,
}) => {
  return (
    <div className="form-navigation">
      <button
        disabled={activeStep === 0 || isProcessing}
        onClick={onBack}
        className="btn-default btn-highlighted"
      >
        Back
      </button>
      {!(activeStep === stepsLength - 1 && payOnline) && (
        <button
          onClick={onNext}
          className="btn-default"
          disabled={isProcessing}
        >
          {activeStep === stepsLength - 1 ? "Submit" : "Next"}
        </button>
      )}
    </div>
  );
};

export default FormNavigation;
