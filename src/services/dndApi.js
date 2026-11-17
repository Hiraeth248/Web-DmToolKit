
const API_BASE_URL = "https://www.dnd5eapi.co/api/2014";

// Función general para hacer las solicitudes
async function apiRequest(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Error de conexión: ${response.status}`);
  }

  return response.json();
}

// Para obtener la lista de monstruos
export async function getMonsters(challengeRating = "all") {
  const query =
    challengeRating !== "all"
      ? `?challenge_rating=${encodeURIComponent(challengeRating)}`
      : "";

  const data = await apiRequest(`/monsters${query}`);

  return data.results || [];
}

// Para obtener toda la info de un monstruo
export async function getMonsterByIndex(index) {
  return apiRequest(`/monsters/${encodeURIComponent(index)}`);
}



export async function getEquipmentList() {
  const data = await apiRequest("/equipment");
  return data.results || [];
}

export async function getEquipmentByIndex(index) {
  return apiRequest(`/equipment/${encodeURIComponent(index)}`);
}

export async function getMagicItemsList() {
  const data = await apiRequest("/magic-items");
  return data.results || [];
}

export async function getMagicItemByIndex(index) {
  return apiRequest(`/magic-items/${encodeURIComponent(index)}`);
}