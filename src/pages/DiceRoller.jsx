import { useState } from "react";

const diceTypes = [4, 6, 8, 10, 12, 20, 100];
function DiceRoller() {
  const [diceType, setDiceType] = useState(20);
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [history, setHistory] = useState([]);

  function rollDice() {
    const count = Math.min(20, Math.max(1, Number(diceCount) || 1));
    const bonus = Number(modifier) || 0;

    const results = [];

    for (let i = 0; i < count; i++) {
      const result = Math.floor(Math.random() * diceType) + 1;
      results.push(result);
    }

    const diceTotal = results.reduce((sum, value) => sum + value, 0);
    const total = diceTotal + bonus;

    const newRoll = {
      id: Date.now() + Math.random(),
      notation: `${count}d${diceType}${bonus > 0 ? ` + ${bonus}` : bonus < 0 ? ` - ${Math.abs(bonus)}` : ""}`,
      results,
      diceTotal,
      modifier: bonus,
      total,
      date: new Date().toLocaleTimeString(),
    };

    setHistory((previous) => [newRoll, ...previous].slice(0, 20));
  }

  function clearHistory() {
    setHistory([]);
  }

  return (
    <section className="dice-page">
      <div className="dice-header">
        <span className="section-eyebrow">HERRAMIENTAS DEL AVENTURERO</span>
        <h1>Lanzamiento de Dados</h1>
        <p>
          Lanza tus dados, usa tus modificadores y consulta los resultados
          de tus tiradas.
        </p>
      </div>

      <div className="dice-generator-panel">
        <div className="dice-control">
          <label htmlFor="dice-count">Cantidad de dados</label>
          <input
            id="dice-count"
            type="number"
            min="1"
            max="20"
            value={diceCount}
            onChange={(event) => setDiceCount(event.target.value)}
          />
        </div>

        <div className="dice-control">
          <label>Tipo de dado</label>

          <div className="dice-types">
            {diceTypes.map((type) => (
              <button
                key={type}
                className={`dice-type-button ${
                  diceType === type ? "selected" : ""
                }`}
                onClick={() => setDiceType(type)}
              >
                d{type}
              </button>
            ))}
          </div>
        </div>

        <div className="dice-control">
          <label htmlFor="dice-modifier">Modificador</label>
          <input
            id="dice-modifier"
            type="number"
            value={modifier}
            onChange={(event) => setModifier(event.target.value)}
          />
        </div>

        <button className="dice-roll-button" onClick={rollDice}>
          Lanzar dados
        </button>
      </div>

      <div className="dice-history">
        <div className="dice-history-header">
          <h2>Historial de lanzamientos</h2>

          <button
            className="dice-clear-button"
            onClick={clearHistory}
            disabled={history.length === 0}
          >
            Limpiar historial
          </button>
        </div>

        {history.length === 0 ? (
          <p className="dice-empty">
            Todavía no has realizado ningún lanzamiento.
          </p>
        ) : (
          <div className="dice-history-list">
            {history.map((roll) => (
              <article className="dice-result-card" key={roll.id}>
                <div className="dice-result-info">
                  <h3>{roll.notation}</h3>
                  <span>{roll.date}</span>
                </div>

                <div className="dice-individual-results">
                  {roll.results.map((result, index) => (
                    <span key={index}>{result}</span>
                  ))}

                  {roll.modifier !== 0 && (
                    <span className="dice-modifier">
                      {roll.modifier > 0 ? "+" : ""}
                      {roll.modifier}
                    </span>
                  )}
                </div>

                <div className="dice-total">
                  <span>Total</span>
                  <strong>{roll.total}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default DiceRoller;