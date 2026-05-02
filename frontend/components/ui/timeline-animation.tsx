"use client";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

export const TimelineContent = ({ children, className, animationNum, customVariants, as: Component = "div", ...props }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };

  return (
    <motion.div
      ref={ref}
      as={Component}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={customVariants || defaultVariants}
      custom={animationNum}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};