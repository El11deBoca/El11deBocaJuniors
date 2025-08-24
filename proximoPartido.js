// proximoPartido.js
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { app } from "./firebaseConfig.js"; // Usa tu inicialización de Firebase ya existente

const db = getFirestore(app);
const API_URL = "https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=133739"; // Boca Juniors

export async function obtenerProximoPartido() {
  const docRef = doc(db, "partidos", "proximo");
  const snapshot = await getDoc(docRef);

  const hoy = new Date();

  // Si existe en Firestore y es futuro, usarlo
  if (snapshot.exists()) {
    const partido = snapshot.data();
    const fechaHora = new Date(`${partido.fecha}T${partido.hora}`);
    if (fechaHora > hoy) return partido;
  }

  // Si no existe o ya pasó, obtener de API
  const res = await fetch(API_URL);
  const data = await res.json();
  const evento = data.events[0];

  const rival = evento.strAwayTeam === "Boca Juniors" ? evento.strHomeTeam : evento.strAwayTeam;

  const partidoNuevo = {
    rival,
    fecha: evento.dateEvent,
    hora: evento.strTime,
    competicion: evento.strLeague,
    estadio: evento.strVenue || "Por definir"
  };

  // Guardar en Firestore
  await setDoc(docRef, partidoNuevo);

  return partidoNuevo;
}
