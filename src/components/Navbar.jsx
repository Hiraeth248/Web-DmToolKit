
function Navbar({ activeSection, setActiveSection }) {
  const menuItems = [
    {
      id: "bestiary",
      label: "Bestiario"
    },
    {
      id: "loot",
      label: "Generador de Loot"
    },
    {
      id: "dice",
      label: "Bandeja de Dados"
    }
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand">

        <div>
          <h1>DM Toolkit</h1>
          <span>A Dungeon Master's Best Companion!</span>
        </div>
      </div>

      <nav className="navbar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-button ${
              activeSection === item.id ? "active" : ""
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;