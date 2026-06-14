"use client";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 60, rotateY: 12 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        exit={{ opacity: 0, x: -60, rotateY: -12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
