import { Variants } from "framer-motion";

export const cardAnimations: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
  tap: {
    scale: 0.98,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

export const columnAnimations: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  hover: {
    y: -2,
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
};

export const buttonAnimations: Variants = {
  idle: {
    scale: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  hover: {
    scale: 1.05,
    backgroundColor: "rgba(255,255,255,0.2)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
  tap: {
    scale: 0.95,
  },
};

export const containerAnimations: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
