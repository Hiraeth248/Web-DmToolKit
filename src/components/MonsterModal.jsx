
function MonsterModal({ monster, onClose }) {
  if (!monster) return null;

  const abilities = [
    { name: "Fuerza", value: monster.strength },
    { name: "Destreza", value: monster.dexterity },
    { name: "Constitución", value: monster.constitution },
    { name: "Inteligencia", value: monster.intelligence },
    { name: "Sabiduría", value: monster.wisdom },
    { name: "Carisma", value: monster.charisma }
  ];

  const armorClass = monster.armor_class
    ?.map((armor) => `${armor.value} (${armor.type})`)
    .join(", ");

  const speed = monster.speed
    ? Object.entries(monster.speed)
        .map(([type, value]) => `${type}: ${value}`)
        .join(" | ")
    : "No disponible";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <section
        className="monster-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="modal-subtitle">
              {monster.size} {monster.type}
            </span>

            <h2>{monster.name}</h2>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar ficha"
          >
            X
          </button>
        </div>

        <div className="modal-main-stats">
          <div>
            <span>Clase de Armadura</span>
            <strong>{armorClass || "N/A"}</strong>
          </div>

          <div>
            <span>Puntos de Golpe</span>
            <strong>{monster.hit_points} HP</strong>
          </div>

          <div>
            <span>Challenge Rating</span>
            <strong>{monster.challenge_rating}</strong>
          </div>

          <div>
            <span>Experiencia</span>
            <strong>{monster.xp} XP</strong>
          </div>
        </div>

        <div className="modal-section">
          <h3>Características</h3>

          <div className="ability-grid">
            {abilities.map((ability) => (
              <div className="ability-item" key={ability.name}>
                <span>{ability.name}</span>
                <strong>{ability.value ?? "N/A"}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-section">
          <h3>Información de combate</h3>

          <p><strong>Velocidad:</strong> {speed}</p>

          <p>
            <strong>Bonificación de competencia:</strong>{" "}
            {monster.proficiency_bonus ?? "N/A"}
          </p>

          <p>
            <strong>Sentidos:</strong>{" "}
            {monster.senses
              ? Object.entries(monster.senses)
                  .map(([type, value]) => `${type}: ${value}`)
                  .join(", ")
              : "No disponible"}
          </p>

          <p>
            <strong>Idiomas:</strong>{" "}
            {monster.languages || "Ninguno"}
          </p>
        </div>

        {monster.special_abilities?.length > 0 && (
          <div className="modal-section">
            <h3>Habilidades especiales</h3>

            {monster.special_abilities.map((ability, index) => (
              <div className="monster-ability" key={index}>
                <strong>{ability.name}</strong>
                <p>{ability.desc}</p>
              </div>
            ))}
          </div>
        )}

        {monster.actions?.length > 0 && (
          <div className="modal-section">
            <h3>Acciones</h3>

            {monster.actions.map((action, index) => (
              <div className="monster-ability" key={index}>
                <strong>{action.name}</strong>
                <p>{action.desc}</p>
              </div>
            ))}
          </div>
        )}

        {monster.legendary_actions?.length > 0 && (
          <div className="modal-section">
            <h3>Acciones legendarias</h3>

            {monster.legendary_actions.map((action, index) => (
              <div className="monster-ability" key={index}>
                <strong>{action.name}</strong>
                <p>{action.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MonsterModal;