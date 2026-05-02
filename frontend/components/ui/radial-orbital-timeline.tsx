"use client";
import { useState, useEffect, useRef } from "react";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RadialOrbitalTimeline({ timelineData }: any) {
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setRotation(r => (r + 0.5) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[600px] relative flex items-center justify-center overflow-hidden bg-transparent">
      <div className="absolute w-96 h-96 border border-white/10 rounded-full" />
      {timelineData.map((item: any, i: number) => {
        const angle = (i / timelineData.length) * 360 + rotation;
        const x = Math.cos(angle * Math.PI / 180) * 200;
        const y = Math.sin(angle * Math.PI / 180) * 200;
        const Icon = item.icon;
        return (
          <div key={item.id} className="absolute transition-all duration-500" style={{ transform: `translate(${x}px, ${y}px)` }}>
            <div className="w-12 h-12 bg-zinc-900 border border-white/20 rounded-full flex items-center justify-center text-white">
              <Icon size={20} />
            </div>
            <div className="absolute top-14 left-1/2 -translate-x-1/2 text-[10px] text-white/50 whitespace-nowrap">{item.title}</div>
          </div>
        );
      })}
    </div>
  );
}