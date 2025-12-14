import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function AnimatedText({
  text,
  className,
  gradientColors = "linear-gradient(90deg, #000, #fff, #000)",
  gradientAnimationDuration = 1,
  hoverEffect = false,
  textClassName,
}) {
  return (
    <div
      className={cn(
        "flex flex-row items-center transition-shadow duration-300 ease-out",
        hoverEffect && "hover:drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      <motion.h1
        initial={{ backgroundPosition: "0 0" }}
        animate={{ backgroundPosition: "-200% 0" }}
        transition={{
          repeat: Infinity,
          duration: gradientAnimationDuration,
          ease: "linear",
        }}
        style={{
          backgroundImage: gradientColors,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
        className={cn("text-3xl font-bold tracking-tight", textClassName)}
      >
        {text}
      </motion.h1>
    </div>
  );
}
