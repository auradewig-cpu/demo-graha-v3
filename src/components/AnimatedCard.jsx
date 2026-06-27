import { motion } from "motion/react";

export function AnimatedCard({ children, className, style, delay = 0, ...rest }) {
  return (
    <motion.div
      className={`gsap-stagger-child ${className || ""}`}
      style={style}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedButton({ children, href, style, onClick }) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      style={{
        display: "inline-block",
        cursor: "pointer",
        ...style,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
}
