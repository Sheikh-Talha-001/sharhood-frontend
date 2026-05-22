import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface FloatingStickerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  rotate?: number;
}

export function FloatingSticker({
  children,
  className,
  delay = 0,
  duration = 4,
  rotate = 0,
}: FloatingStickerProps) {
  return (
    <motion.div
      initial={{ rotate }}
      animate={{
        y: [0, -15, 0],
        rotate: [rotate, rotate + 2, rotate - 2, rotate],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={cn(
        "absolute pointer-events-none select-none z-10",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function Sticker({ text, colorClass, className }: { text: string; colorClass: string; className?: string }) {
  return (
    <div className={cn(
      "px-4 py-2 rounded-full font-bold text-white shadow-lg flex items-center justify-center transform",
      colorClass,
      className
    )}>
      {text}
    </div>
  );
}
