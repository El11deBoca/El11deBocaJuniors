// proximoPartido.js
const traduccionesCompeticion = {
  "Argentinian Primera Division": "Primera División Argentina",
  "Copa Argentina": "Copa Argentina",
  "Argentinian cup": "Copa Argentina",
  "Argentinian Copa de la Liga Profesional": "Copa de la Liga Argentina",
  "Supercopa Argentina": "Supercopa Argentina",
  "Copa Libertadores": "Copa Libertadores",
  "Copa Sudamericana": "Copa Sudamericana",
  "FIFA Club World Cup": "Mundial de Clubes",
  // Agregá más traducciones según necesites
};

export async function obtenerProximoPartido() {
  const TEAM_ID = 135156; // Boca Juniors
  const API_URL = `https://www.thesportsdb.com/api/v1/json/123/eventsnext.php?id=${TEAM_ID}`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data.events || data.events.length === 0) {
      throw new Error("No se encontraron próximos partidos");
    }

    const ev = data.events[0]; // Tomamos el primer evento

    const homeId = Number(ev.idHomeTeam);
    const awayId = Number(ev.idAwayTeam);

    let rival = "";
    if (homeId === TEAM_ID) {
      rival = ev.strAwayTeam;
    } else if (awayId === TEAM_ID) {
      rival = ev.strHomeTeam;
    } else {
      if (ev.strEvent && ev.strEvent.includes(" vs ")) {
        const parts = ev.strEvent.split(" vs ");
        rival = parts.find(p => !p.toLowerCase().includes("boca")) || ev.strEvent;
      } else {
        rival = ev.strEvent || "Rival desconocido";
      }
    }

    // Traducir la competición si existe en el mapa
    const competicionEsp = traduccionesCompeticion[ev.strLeague] || ev.strLeague || "Competición desconocida";

    return {
      rival,
      estadio: ev.strVenue || "Estadio desconocido",
      fecha: ev.dateEvent || "Fecha no disponible",
      hora: ev.strTime || "Hora no disponible",
      competicion: competicionEsp
    };

  } catch (err) {
    console.error("Error obteniendo próximo partido:", err);
    return null;
  }
}
