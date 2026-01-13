import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const SkillCard = ({ title, percentage, icon: Icon, color }) => {
  const controls = useAnimation();

  // 1. Calculate the circle size
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (percentage / 100) * circumference;

  // 2. Initial load animation (fills up once when page loads)
  useEffect(() => {
    controls.start({
      strokeDashoffset: targetOffset,
      transition: { duration: 1, ease: "easeOut" }
    });
  }, [percentage, targetOffset, controls]);

  // 3. THIS IS THE FEATURE YOU WANTED:
  // When mouse enters, reset to 0 (empty) instantly, then animate to target.
  const handleHoverStart = () => {
    controls.set({ strokeDashoffset: circumference }); // Snap to empty
    controls.start({
      strokeDashoffset: targetOffset, // Animate to full
      transition: { duration: 1, ease: "easeOut" }
    });
  };

  return (
    <motion.div
      className="relative flex items-center justify-between p-4 mb-4 overflow-hidden rounded-xl bg-slate-900 border border-slate-800"
      whileHover={{ scale: 1.05, borderColor: "rgba(56, 189, 248, 0.8)" }} // Glow effect
      onHoverStart={handleHoverStart} // Triggers the odometer effect
    >
      {/* Icon & Title */}
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-slate-800 ${color || "text-blue-400"}`}>
          {Icon && <Icon size={24} />}
        </div>
        <span className="text-lg font-semibold text-white">{title}</span>
      </div>

      {/* The Circle */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Grey Background Track */}
          <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-700" />
          
          {/* Animated Blue Line */}
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }} // Starts empty
            animate={controls} // Controlled by our hover logic
            strokeLinecap="round"
            className={color ? color.replace("text-", "text-") : "text-blue-500"}
          />
        </svg>
        <span className="absolute text-xs font-bold text-white">{percentage}%</span>
      </div>
    </motion.div>
  );
};

export default SkillCard;