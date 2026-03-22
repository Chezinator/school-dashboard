/**
 * AnimatedCard — Reusable wrapper that animates children into view
 * using Framer Motion's whileInView with a spring entrance.
 * Provides consistent micro-interactions across the entire dashboard.
 */
import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Stagger delay index — each card in a list gets idx * 0.06s delay */
  delay?: number;
  /** Disable animation (useful for already-visible elements) */
  noAnimation?: boolean;
}

export default function AnimatedCard({
  children,
  delay = 0,
  noAnimation = false,
  className = "",
  ...rest
}: AnimatedCardProps) {
  if (noAnimation) {
    return <div className={className} {...(rest as any)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 24,
        mass: 0.8,
        delay: delay * 0.06,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** A section-level animated wrapper with slightly different spring */
export function AnimatedSection({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 22,
        delay: delay * 0.08,
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
