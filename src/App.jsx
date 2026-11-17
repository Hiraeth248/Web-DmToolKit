
import { useState } from "react";

import Navbar from "./components/Navbar";

import Bestiary from "./pages/Bestiary";
import LootGenerator from "./pages/LootGenerator";
import DiceRoller from "./pages/DiceRoller";

function App() {
  const [activeSection, setActiveSection] = useState("bestiary");

  const renderSection = () => {
    switch (activeSection) {
      case "bestiary":
        return <Bestiary />;

      case "loot":
        return <LootGenerator />;

      case "dice":
        return <DiceRoller />;

      default:
        return <Bestiary />;
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="main-content">
        {renderSection()}
      </main>

      <footer className="app-footer">
        <p>Dungeon Master's Toolkit</p>
        <span>Una herramienta para aventureros y Dungeon Masters</span>
      </footer>
    </div>
  );
}

export default App;