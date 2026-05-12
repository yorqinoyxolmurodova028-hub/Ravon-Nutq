import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { DiagnosticTool } from "./components/DiagnosticTool";
import { ExerciseLibrary } from "./components/ExerciseLibrary";
import { Resources } from "./components/Resources";
import { EducationalGames } from "./components/EducationalGames";
import { TextbookIntegration } from "./components/TextbookIntegration";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-20 md:pt-16">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4">
        {activeTab === "home" && (
          <>
            <Hero onStart={() => setActiveTab("diagnostics")} />
            <div className="py-12 px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 text-center">
                  <h3 className="text-2xl font-bold text-primary mb-4">1500+</h3>
                  <p className="text-muted-foreground">O'quvchilar tahlil qilindi</p>
                </div>
                <div className="p-8 rounded-3xl bg-secondary/5 border border-secondary/10 text-center">
                  <h3 className="text-2xl font-bold text-secondary-foreground mb-4">50+</h3>
                  <p className="text-muted-foreground">Interaktiv mashqlar</p>
                </div>
                <div className="p-8 rounded-3xl bg-accent/5 border border-accent/10 text-center">
                  <h3 className="text-2xl font-bold text-accent-foreground mb-4">100%</h3>
                  <p className="text-muted-foreground">Ilmiy asoslangan metodika</p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === "diagnostics" && <DiagnosticTool />}
        {activeTab === "exercises" && <ExerciseLibrary />}
        {activeTab === "games" && <EducationalGames />}
        {activeTab === "textbook" && <TextbookIntegration />}
        {activeTab === "resources" && <Resources />}
      </main>

      <footer className="hidden md:block py-12 border-t border-border mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 Nutq Nur. Guliston Davlat Pedagogika Instituti Magistrlik Dissertatsiyasi loyihasi.</p>
        </div>
      </footer>
    </div>
  );
}
