import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface TextAnimeProps {
  children: React.ReactNode;
  className?: string; // Optional className for additional styling
  tag?: keyof JSX.IntrinsicElements; // HTML tag to be used
  triggerOnce?: boolean;
}

const TextAnime: React.FC<TextAnimeProps> = ({
  children,
  className,
  tag = "div",
  triggerOnce = true,
}) => {
  const { ref, inView } = useInView(
    triggerOnce === true
      ? {
          triggerOnce: true,
          threshold: 0.85,
        }
      : {
          threshold: 0.85,
        }
  );

  // Split the text into letters
  const letters = React.Children.toArray(children).join("").split("");

  // Define animation for each letter
  const letterVariants = {
    initial: { opacity: 0, x: 20 },
    animate: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: inView ? i * 0.02 : 0, // Stagger the animation for each letter
        duration: 0.1,
        ease: "easeOut",
      },
    }),
  };

  // Define the final bump effect for the entire text
  const containerVariants = {
    initial: {},
    animate: {
      x: ["0%", "-3%", "0%"], // Bump effect
      transition: {
        duration: 1,
        ease: "easeOut",
        // staggerChildren: 0.05,
      },
    },
    exit: {
      // x: ["0%", "5%", "0%"], // Bump effect
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Generate animated letters
  const animatedLetters = letters.map((letter, index) => (
    <motion.span
      key={index}
      variants={letterVariants}
      custom={index}
      initial="initial"
      animate={inView ? "animate" : "initial"}
    >
      {letter}
    </motion.span>
  ));

  const Tag = tag; // Use the tag prop to determine which HTML element to render

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: "inline-block" }}
      variants={containerVariants}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      exit="exit" // Trigger exit animation
      data-cursor="-opaque"
    >
      <Tag>{animatedLetters}</Tag>
    </motion.div>
  );
};

export default TextAnime;
