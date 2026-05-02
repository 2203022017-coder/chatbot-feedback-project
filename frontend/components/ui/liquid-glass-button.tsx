import { cn } from "@/lib/utils"

export function LiquidButton({ children, className, onClick }: any) {
  return (
    <button onClick={onClick} className={cn("relative px-8 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold hover:bg-white/20 transition-all shadow-xl", className)}>
      {children}
    </button>
  );
}

export function MetalButton({ children, className, variant }: any) {
  const colors = variant === "gold" ? "from-yellow-600 to-yellow-300" : "from-zinc-600 to-zinc-300";
  return (
    <button className={cn(`px-8 py-3 rounded-xl bg-gradient-to-b ${colors} text-black font-black uppercase tracking-tighter shadow-lg`, className)}>
      {children}
    </button>
  );
}