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
    { id: "textbook", label: "Darslik", icon: GraduationCap },
    { id: "resources", label: "Ma'lumotlar", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="container flex items-center justify-around h-16 px-4 mx-auto md:justify-between">
        <div className="hidden md:flex items-center gap-2 font-bold text-primary text-xl">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">N</div>
          Nutq Nur
        </div>
        <div className="flex items-center gap-1 md:gap-4">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="flex flex-col h-auto py-1 px-3 md:flex-row md:gap-2 md:py-2"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] md:text-sm">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
