export async function obtenerProximoPartido() {
  const TEAM_ID = 135156; // Boca Juniors
  const API_URL = `https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${TEAM_ID}`;
  
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data.events || data.events.length === 0) throw new Error("No se encontraron próximos partidos");

    // Tomamos el primer evento (puede mejorar con filtro si querés ligas oficiales)
    const ev = data.events[0];

    // Determinar rival según si Boca es local o visitante usando el ID
    const teamIdStr = String(TEAM_ID);
    let rival = ev.strHomeTeam || ev.strEvent || "";
    if (ev.idHomeTeam && ev.idAwayTeam) {
      rival = String(ev.idHomeTeam) === teamIdStr ? ev.strAwayTeam : ev.strHomeTeam;
    } else {
      // fallback: tomar la parte después de ' vs ' si existe
      if (ev.strEvent && ev.strEvent.includes(" vs ")) {
        const parts = ev.strEvent.split(" vs ");
        rival = parts.find(p => !p.toLowerCase().includes("boca")) || ev.strEvent;
      }
    }

    return {
      rival,
      estadio: ev.strVenue,
      fecha: ev.dateEvent,
      hora: ev.strTime,
      competicion: ev.strLeague
    };

  } catch (err) {
    console.error("Error obteniendo próximo partido:", err);
    return null;
  }
}
