"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export function Hero() {
  const titles = ["STRATEJİK", "VERİ ODAKLI", "AI DESTEKLİ", "GLOBAL"];
  const [index, setIndex] = useState(0);
  useEffect(() => { const timer = setInterval(() => setIndex(i => (i + 1) % titles.length), 3000); return () => clearInterval(timer); }, []);

  return (
    <div className="py-10">
      <h1 className="text-6xl font-black text-white">YENİ NESİL <br/> 
        <AnimatePresence mode="wait">
          <motion.span key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-blue-500 inline-block">
            {titles[index]}
          </motion.span>
        </AnimatePresence>
        <br/>KARİYER PORTALI
      </h1>
    </div>
  );
}