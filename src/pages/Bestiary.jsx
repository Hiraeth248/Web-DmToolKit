
import { useEffect, useMemo, useState } from "react";

import MonsterCard from "../components/MonsterCard";
import MonsterModal from "../components/MonsterModal";

import {
  getMonsters,
  getMonsterByIndex
} from "../services/dndApi";

function Bestiary() {
  const [monsterList, setMonsterList] = useState([]);
  const [monsterDetails, setMonsterDetails] = useState({});

  const [search, setSearch] = useState("");
  const [challengeRating, setChallengeRating] = useState("all");

  const [selectedMonster, setSelectedMonster] = useState(null);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [error, setError] = useState("");

  const [visibleCount, setVisibleCount] = useState(18);

  // Consultar el listado de monstruos
  useEffect(() => {
    let cancelled = false;

    async function loadMonsters() {
      setLoadingList(true);
      setError("");
      setMonsterList([]);
      setMonsterDetails({});
      setVisibleCount(18);

      try {
        const monsters = await getMonsters(challengeRating);

        if (!cancelled) {
          setMonsterList(monsters);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "No fue posible cargar los monstruos. Comprueba tu conexión."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingList(false);
        }
      }
    }

    loadMonsters();

    return () => {
      cancelled = true;
    };
  }, [challengeRating]);

  // Filtrar monstruos por nombre
  const filteredMonsters = useMemo(() => {
    return monsterList.filter((monster) =>
      monster.name.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [monsterList, search]);

  // Consultar estadísticas completas de los monstruos visibles
  useEffect(() => {
    let cancelled = false;

    async function loadMonsterDetails() {
      const monstersToLoad = filteredMonsters.slice(0, visibleCount);

      const missingMonsters = monstersToLoad.filter(
        (monster) => !monsterDetails[monster.index]
      );

      if (missingMonsters.length === 0) {
        setLoadingDetails(false);
        return;
      }

      setLoadingDetails(true);

      try {
        const results = await Promise.all(
          missingMonsters.map((monster) =>
            getMonsterByIndex(monster.index)
          )
        );

        if (!cancelled) {
          const newDetails = {};

          results.forEach((monster) => {
            newDetails[monster.index] = monster;
          });

          setMonsterDetails((previous) => ({
            ...previous,
            ...newDetails
          }));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "No fue posible consultar las estadísticas de algunos monstruos."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDetails(false);
        }
      }
    }

    if (!loadingList) {
      loadMonsterDetails();
    }

    return () => {
      cancelled = true;
    };
  }, [filteredMonsters, visibleCount, loadingList]);

  // Reiniciar la cantidad visible cuando cambia la búsqueda
  useEffect(() => {
    setVisibleCount(18);
  }, [search]);

  // Abrir ficha de un monstruo
  async function openMonster(monster) {
    const details = monsterDetails[monster.index];

    if (details) {
      setSelectedMonster(details);
      return;
    }

    try {
      const data = await getMonsterByIndex(monster.index);

      setMonsterDetails((previous) => ({
        ...previous,
        [monster.index]: data
      }));

      setSelectedMonster(data);
    } catch (err) {
      setError("No fue posible abrir la ficha de este monstruo.");
    }
  }

  return (
    <section className="bestiary-page">

      <div className="page-heading">
        <span className="section-label">LISTA DE CRIATURAS</span>

        <h2>Bestiario</h2>

        <p>
          Explora las criaturas que habitan el mundo de Dungeons & Dragons.
          Consulta sus estadísticas y prepárate para tus encuentros.
        </p>
      </div>

      <div className="bestiary-controls">

        <div className="search-container">
          <label htmlFor="monster-search">
            Buscar criatura
          </label>

          <input
            id="monster-search"
            type="text"
            placeholder="Escribe el nombre de un monstruo..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-container">
          <label htmlFor="challenge-filter">
            Nivel de desafío
          </label>

          <select
            id="challenge-filter"
            value={challengeRating}
            onChange={(event) =>
              setChallengeRating(event.target.value)
            }
          >
            <option value="all">Todos los niveles</option>
            <option value="0">CR 0</option>
            <option value="0.125">CR 1/8</option>
            <option value="0.25">CR 1/4</option>
            <option value="0.5">CR 1/2</option>
            <option value="1">CR 1</option>
            <option value="2">CR 2</option>
            <option value="3">CR 3</option>
            <option value="4">CR 4</option>
            <option value="5">CR 5</option>
            <option value="6">CR 6</option>
            <option value="7">CR 7</option>
            <option value="8">CR 8</option>
            <option value="9">CR 9</option>
            <option value="10">CR 10</option>
            <option value="11">CR 11</option>
            <option value="12">CR 12</option>
            <option value="13">CR 13</option>
            <option value="14">CR 14</option>
            <option value="15">CR 15</option>
            <option value="16">CR 16</option>
            <option value="17">CR 17</option>
            <option value="18">CR 18</option>
            <option value="19">CR 19</option>
            <option value="20">CR 20</option>
            <option value="21">CR 21</option>
            <option value="22">CR 22</option>
            <option value="23">CR 23</option>
            <option value="24">CR 24</option>
            <option value="25">CR 25</option>
            <option value="26">CR 26</option>
            <option value="27">CR 27</option>
            <option value="28">CR 28</option>
            <option value="29">CR 29</option>
            <option value="30">CR 30</option>
          </select>
        </div>

      </div>

      <div className="bestiary-results">
        <div>
          <h3>Criaturas disponibles</h3>

          <p>
            {filteredMonsters.length} criaturas encontradas
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loadingList ? (
        <div className="loading-message">
          Consultando el bestiario...
        </div>
      ) : filteredMonsters.length === 0 ? (
        <div className="empty-message">
          <h3>No se encontraron criaturas</h3>
          <p>Prueba con otro nombre o nivel de desafío.</p>
        </div>
      ) : (
        <>
          <div className="monster-grid">

            {filteredMonsters
              .slice(0, visibleCount)
              .map((monster) => {
                const details = monsterDetails[monster.index];

                if (!details) return null;

                return (
                  <MonsterCard
                    key={monster.index}
                    monster={details}
                    onSelect={openMonster}
                  />
                );
              })}

          </div>

          {loadingDetails && (
            <div className="loading-message">
              Cargando estadísticas de las criaturas...
            </div>
          )}

          {!loadingDetails &&
            visibleCount < filteredMonsters.length && (
              <button
                className="load-more-button"
                onClick={() =>
                  setVisibleCount((previous) => previous + 18)
                }
              >
                Cargar más criaturas
              </button>
            )}
        </>
      )}

      <MonsterModal
        monster={selectedMonster}
        onClose={() => setSelectedMonster(null)}
      />

    </section>
  );
}

export default Bestiary;