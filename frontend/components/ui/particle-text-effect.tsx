"use client"
import { useEffect, useRef } from "react"

export function ParticleTextEffect({ words = ["AI HUB", "CAREER", "STRATEGY"] }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 1000; canvas.height = 400;
    ctx.fillStyle = "white";
    ctx.font = "bold 120px Arial";
    ctx.textAlign = "center";
    ctx.fillText(words[0], 500, 200);
    // Basitleştirilmiş animasyon mantığı
  }, [words]);

  return <canvas ref={canvasRef} className="max-w-full h-auto" />;
}