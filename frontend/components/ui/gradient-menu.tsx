import { Home, Briefcase, FileText, Settings } from "lucide-react";

export default function GradientMenu() {
  const menu = [
    { name: "Home", icon: Home, color: "from-purple-500 to-pink-500" },
    { name: "İşler", icon: Briefcase, color: "from-blue-500 to-cyan-500" },
    { name: "Analiz", icon: FileText, color: "from-orange-500 to-red-500" },
    { name: "Ayar", icon: Settings, color: "from-emerald-500 to-teal-500" }
  ];
  return (
    <ul className="flex gap-4 p-4 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl">
      {menu.map((item) => (
        <li key={item.name} className="relative group cursor-pointer p-3 rounded-2xl hover:bg-white/5 transition-all">
          <item.icon size={20} className="text-zinc-400 group-hover:text-white" />
        </li>
      ))}
    </ul>
  );
}