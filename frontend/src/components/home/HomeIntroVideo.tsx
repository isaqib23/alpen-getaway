import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import TextAnime from "../animations/TextAnime";

import { strings } from "../../lang/video";

const HomeIntroVideo: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const heroContent = (
    <div className="container">
      <div className="row section-row">
        <div className="col-lg-12">
          <div className="section-title" ref={ref}>
            {inView && (
              <motion.h3
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {strings.HEADING}
              </motion.h3>
            )}
            <TextAnime className="text-anime-style-3" tag="h2">
              {strings.DESCRIPTION}
            </TextAnime>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="intro-video-box">
            <div className="video-play-button">
              <a
                href="#"
                className="popup-video"
                data-cursor-text="Play"
                onClick={(e) => {
                  e.preventDefault();
                  handleVideoToggle();
                }}
              >
                {!isVideoPlaying ? (
                  <i className="fa-solid fa-play"></i>
                ) : (
                  <i className="fa-solid fa-pause"></i>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="intro-video bg-section">
      <video
        ref={videoRef}
        className="intro-background-video"
        loop
        muted
        playsInline
      >
        <source
          src="https://demo.awaikenthemes.com/assets/videos/novaride-video.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      {heroContent}
    </div>
  );
};

export default HomeIntroVideo;
