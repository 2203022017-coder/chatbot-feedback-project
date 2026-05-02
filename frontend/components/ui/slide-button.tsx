"use client"
import React, { useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { SendHorizontal, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const SlideButton = ({ className, onClick }: any) => {
  const [completed, setCompleted] = useState(false);
  const x = useMotionValue(0);
  const springX = useSpring(x);
  const opacity = useTransform(springX, [0, 150], [1, 0]);

  return (
    <div className={cn("relative w-64 h-12 bg-zinc-800 rounded-full flex items-center p-1 overflow-hidden", className)}>
      {!completed ? (
        <motion.div 
          drag="x" 
          dragConstraints={{ left: 0, right: 200 }} 
          onDragEnd={(_, info) => { if(info.offset.x > 150) { setCompleted(true); onClick?.(); } else { x.set(0); } }}
          style={{ x: springX }}
          className="z-10 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <SendHorizontal size={18} className="text-white" />
        </motion.div>
      ) : (
        <div className="w-full flex justify-center text-emerald-400 font-bold items-center gap-2">
          <Check size={18} /> ONAYLANDI
        </div>
      )}
      <motion.span style={{ opacity }} className="absolute right-8 text-xs text-zinc-500 font-bold uppercase tracking-widest">Onaylamak için kaydır</motion.span>
    </div>
  );
}