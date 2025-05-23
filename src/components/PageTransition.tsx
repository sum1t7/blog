"use client"
import { motion } from 'framer-motion'

const variants = {
  // Slide transition
  slideLeft: {
    initial: { x: 300, opacity: 0 },
    in: { x: 0, opacity: 1 },
    out: { x: -300, opacity: 0 }
  },
  
  // Fade transition
  fade: {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  },
  
  // Scale transition
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    in: { scale: 1, opacity: 1 },
    out: { scale: 1.2, opacity: 0 }
  },
  
  // Slide up transition
  slideUp: {
    initial: { y: 50, opacity: 0 },
    in: { y: 0, opacity: 1 },
    out: { y: -50, opacity: 0 }
  }
}

import { ReactNode } from 'react';

interface AdvancedPageTransitionProps {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  duration?: number;
}

const AdvancedPageTransition = ({ 
  children, 
  className = "",
  variant = "slideLeft",
  duration = 0.4 
}: AdvancedPageTransitionProps) => {
  const transition = {
    type: 'tween',
    ease: 'easeInOut',
    duration
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={variants[variant]}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}

export default AdvancedPageTransition
