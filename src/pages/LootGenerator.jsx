
import { useEffect, useState } from "react";
import {
  getEquipmentList,
  getEquipmentByIndex,
  getMagicItemsList,
  getMagicItemByIndex,
} from "../services/dndApi";

function rollDice(number, sides) {
  let total = 0;

  for (let i = 0; i < number; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }

  return total;
}

function getCoins(challengeRating) {
  const cr = Number(challengeRating);

  if (cr <= 1) {
    return {
      cp: rollDice(2, 6),
      sp: rollDice(1, 6),
      gp: 0,
      pp: 0,
    };
  }

  if (cr <= 4) {
    return {
      cp: 0,
      sp: rollDice(2, 6),
      gp: rollDice(1, 6),
      pp: 0,
    };
  }

  if (cr <= 10) {
    return {
      cp: 0,
      sp: 0,
      gp: rollDice(4, 6),
      pp: rollDice(1, 4),
    };
  }

  if (cr <= 16) {
    return {
      cp: 0,
      sp: 0,
      gp: rollDice(6, 6),
      pp: rollDice(2, 4),
    };
  }

  return {
    cp: 0,
    sp: 0,
    gp: rollDice(10, 6),
    pp: rollDice(4, 4),
  };
}

function getItemCount(challengeRating) {
  const cr = Number(challengeRating);

  if (cr <= 1) return 1;
  if (cr <= 4) return rollDice(1, 2);
  if (cr <= 10) return rollDice(1, 3);
  if (cr <= 16) return rollDice(2, 2);

  return rollDice(2, 3);
}

function LootGenerator() {
  const [equipment, setEquipment] = useState([]);
  const [magicItems, setMagicItems] = useState([]);

  const [challengeRating, setChallengeRating] = useState("1");
  const [loot, setLoot] = useState(null);

  const [loadingData, setLoadingData] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLootData() {
      try {
        setLoadingData(true);
        setError("");

        const [equipmentData, magicData] = await Promise.all([
          getEquipmentList(),
          getMagicItemsList(),
        ]);

        setEquipment(equipmentData);
        setMagicItems(magicData);
      } catch (err) {
        console.error("Error cargando los objetos:", err);
        setError(
          "No fue posible cargar los objetos de la API. Comprueba tu conexión e inténtalo nuevamente."
        );
      } finally {
        setLoadingData(false);
      }
    }

    loadLootData();
  }, []);

  async function generateLoot() {
    if (equipment.length === 0) {
      setError("No hay equipamiento disponible para generar recompensas.");
      return;
    }

    try {
      setGenerating(true);
      setError("");

      const coins = getCoins(challengeRating);
      const itemCount = getItemCount(challengeRating);

      // Seleccionar objetos de equipamiento aleatorios.
      const selectedEquipment = [];

      for (let i = 0; i < itemCount; i++) {
        const randomIndex = Math.floor(Math.random() * equipment.length);
        selectedEquipment.push(equipment[randomIndex]);
      }

      // Consultar los detalles de cada objeto seleccionado.
      const equipmentDetails = await Promise.all(
        selectedEquipment.map((item) =>
          getEquipmentByIndex(item.index)
        )
      );

      // Probabilidad personalizada de encontrar un objeto mágico.
      const cr = Number(challengeRating);

      let magicChance = 0.08;

      if (cr >= 5 && cr <= 10) magicChance = 0.20;
      else if (cr >= 11 && cr <= 16) magicChance = 0.35;
      else if (cr >= 17) magicChance = 0.50;

      let magicItem = null;

      if (magicItems.length > 0 && Math.random() < magicChance) {
        const randomMagicIndex = Math.floor(
          Math.random() * magicItems.length
        );

        const selectedMagicItem = magicItems[randomMagicIndex];

        magicItem = await getMagicItemByIndex(
          selectedMagicItem.index
        );
      }

      setLoot({
        coins,
        equipment: equipmentDetails,
        magicItem,
        challengeRating,
      });
    } catch (err) {
      console.error("Error generando el botín:", err);
      setError(
        "Ocurrió un problema al generar el botín. Inténtalo nuevamente."
      );
    } finally {
      setGenerating(false);
    }
  }

  function formatCategory(item) {
    return (
      item.equipment_category?.name ||
      item.gear_category?.name ||
      item.weapon_category ||
      "Objeto"
    );
  }

  function renderCoins(coins) {
    const coinTypes = [
      { key: "cp", name: "Cobre" },
      { key: "sp", name: "Plata" },
      { key: "gp", name: "Oro" },
      { key: "pp", name: "Platino" },
    ];

    return coinTypes.filter((coin) => coins[coin.key] > 0).map((coin) => (
      <div className="loot-coin" key={coin.key}>
        <span>{coin.name}</span>
        <strong>{coins[coin.key]} {coin.key.toUpperCase()}</strong>
      </div>
    ));
  }

  return (
    <section className="loot-page">
      <div className="loot-header">
        <span className="section-eyebrow">RECOMPENSAS DEL ENCUENTRO</span>
        <h1>Generador de Loot</h1>
        <p>
          Genera tesoros, monedas y objetos para recompensar a tus
          aventureros después de cada encuentro.
        </p>
      </div>

      <div className="loot-generator-panel">
        <div className="loot-control">
          <label htmlFor="loot-cr">Nivel de desafío (CR)</label>

          <select
            id="loot-cr"
            value={challengeRating}
            onChange={(event) => setChallengeRating(event.target.value)}
          >
            <option value="0">CR 0</option>
            <option value="0.125">CR 1/8</option>
            <option value="0.25">CR 1/4</option>
            <option value="0.5">CR 1/2</option>
            {Array.from({ length: 30 }, (_, index) => index + 1).map(
              (cr) => (
                <option value={String(cr)} key={cr}>
                  CR {cr}
                </option>
              )
            )}
          </select>
        </div>

        <button
          className="loot-generate-button"
          onClick={generateLoot}
          disabled={loadingData || generating}
        >
          {loadingData
            ? "Cargando objetos..."
            : generating
              ? "Generando recompensa..."
              : "Generar botín"}
        </button>

        <p className="loot-hint">
          Las recompensas se generan aleatoriamente y aumentan según el
          nivel de desafío seleccionado.
        </p>
      </div>

      {error && <div className="loot-error">{error}</div>}

      {loot && (
        <div className="loot-results">
          <div className="loot-results-header">
            <div>
              <span className="section-eyebrow">RESULTADO DEL ENCUENTRO</span>
              <h2>Recompensas obtenidas</h2>
            </div>

            <span className="loot-cr-badge">
              CR {loot.challengeRating}
            </span>
          </div>

          <div className="loot-section">
            <h3>Monedas</h3>
            <div className="loot-coins-grid">
              {renderCoins(loot.coins)}
            </div>
          </div>

          <div className="loot-section">
            <h3>Equipamiento</h3>

            <div className="loot-items-grid">
              {loot.equipment.map((item, index) => (
                <article className="loot-item-card" key={`${item.index}-${index}`}>
                  <span className="loot-item-category">
                    {formatCategory(item)}
                  </span>

                  <h4>{item.name}</h4>

                  {item.desc && (
                    <p>
                      {Array.isArray(item.desc)
                        ? item.desc.join(" ")
                        : item.desc}
                    </p>
                  )}

                  {item.damage && (
                    <p>
                      Daño: {item.damage.damage_dice}{" "}
                      {item.damage.damage_type?.name
                        ? `(${item.damage.damage_type.name})`
                        : ""}
                    </p>
                  )}

                  {item.armor_class && (
                    <p>Clase de armadura: {item.armor_class.base}</p>
                  )}

                  {item.weight !== undefined && (
                    <p>Peso: {item.weight}</p>
                  )}
                </article>
              ))}
            </div>
          </div>

          {loot.magicItem && (
            <div className="loot-section">
              <h3>Objeto mágico</h3>

              <article className="loot-item-card magic-item-card">
                <span className="loot-item-category">
                  {loot.magicItem.rarity?.name || "Objeto mágico"}
                </span>

                <h4>{loot.magicItem.name}</h4>

                {loot.magicItem.desc && (
                  <p>
                    {Array.isArray(loot.magicItem.desc)
                      ? loot.magicItem.desc.join(" ")
                      : loot.magicItem.desc}
                  </p>
                )}
              </article>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default LootGenerator;