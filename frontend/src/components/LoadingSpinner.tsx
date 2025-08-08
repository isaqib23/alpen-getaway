import React, { useEffect, useState } from "react";
import "../assets/css/loading-spinner.css";

interface LoadingSpinnerProps {
  show?: boolean;
  children?: React.ReactNode;
}

export default function LoadingSpinner({ show = true, children }: LoadingSpinnerProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [shouldRenderContent, setShouldRenderContent] = useState(!show);

  useEffect(() => {
    if (show) {
      // When showing loader, immediately hide content and show loader
      setShouldRenderContent(false);
      setIsVisible(true);
    } else {
      // When hiding loader, start fade-out animation
      setIsVisible(false);
      // Show content only after fade-out animation completes
      const timer = setTimeout(() => {
        setShouldRenderContent(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <>
      {/* Always render the preloader when it should be visible */}
      {(show || isVisible) && (
        <div className={`preloader ${!isVisible ? 'fade-out' : ''}`}>
          <div className="loading-container">
            {/* Circular Progress Indicator */}
            <div className="circular-loader">
              <div className="circular-progress"></div>
            </div>
          </div>
        </div>
      )}
      {/* Only render children when content should be visible AND not loading */}
      {shouldRenderContent && !show && children}
    </>
  );
}
