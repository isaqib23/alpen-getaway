import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string; // Optional className for additional styling
  triggerOnce?: boolean;
}

const RevealImage: React.FC<RevealImageProps> = ({
  src,
  alt,
  className,
  triggerOnce = true,
}) => {
  const { ref, inView } = useInView(
    triggerOnce === true
      ? {
          triggerOnce: true,
          threshold: 0.1,
        }
      : {
          threshold: 0.1,
        }
  );

  return (
    <figure className={className} ref={ref}>
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }} // Initially clip the image
        animate={{ clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }} // Animate the clipping
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img src={src} alt={alt} />
      </motion.div>
    </figure>
  );
};

export default RevealImage;
