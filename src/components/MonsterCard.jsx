
function MonsterCard({ monster, onSelect }) {
  const armorClass =
    monster.armor_class?.map((armor) => armor.value).join(" / ") || "N/A";

  return (
    <article className="monster-card">
      <div className="monster-card-header">
        <span className="monster-type">
          {monster.size} {monster.type}
        </span>

        <span className="monster-cr">
          CR {monster.challenge_rating}
        </span>
      </div>

      <div className="monster-card-body">
        <h3>{monster.name}</h3>

        <div className="monster-stats">
          <div className="monster-stat">
            <span>Clase de Armadura</span>
            <strong>{armorClass}</strong>
          </div>

          <div className="monster-stat">
            <span>Puntos de Golpe</span>
            <strong>{monster.hit_points} HP</strong>
          </div>

          <div className="monster-stat">
            <span>Desafío</span>
            <strong>{monster.challenge_rating}</strong>
          </div>
        </div>

        <button
          className="monster-details-button"
          onClick={() => onSelect(monster)}
        >
          Consultar información
        </button>
      </div>
    </article>
  );
}

export default MonsterCard;