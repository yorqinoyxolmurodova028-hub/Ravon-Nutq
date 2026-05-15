import { BookOpen, Home, Stethoscope, User, Gamepad2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const navItems = [
    { id: "home", label: "Asosiy", icon: Home },
    { id: "diagnostics", label: "Tashxis", icon: Stethoscope },
    { id: "exercises", label: "Mashqlar", icon: BookOpen },
    { id: "games", label: "O'yinlar", icon: Gamepad2 },
    { id: "textbook", label: "Elektron Kutubxona", icon: GraduationCap },
    { id: "resources", label: "Ma'lumotlar", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t-2 border-slate-100 md:top-4 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:w-max md:rounded-3xl md:border-2 md:sticker-shadow md:px-4">
      <div className="container flex items-center justify-around h-18 px-4 mx-auto md:gap-4 md:px-2">
        <div className="hidden md:flex items-center gap-3 font-display font-black text-2xl pr-4 border-r border-slate-100">
          <div className="w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center text-white rotate-[-5deg] shadow-lg">R</div>
          <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">Ravon Nutq</span>
        </div>
        <div className="flex items-center gap-1 md:gap-3 py-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`flex flex-col h-auto py-2 px-3 md:flex-row md:gap-2 md:py-2 md:px-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                ? "bg-yellow-400 text-white hover:bg-yellow-500 shadow-lg scale-105" 
                : "text-slate-500 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? "animate-bounce" : ""}`} />
              <span className="text-[10px] md:text-sm font-bold">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
