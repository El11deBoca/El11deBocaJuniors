import { obtenerProximoPartido } from "./proximoPartido.js";

const CACHE_KEY = "datosPartido";
window.rivalActual = null;

function mostrarDatosPartido(partido) {
  const datosDiv = document.getElementById("datos-proximo-partido");
  if (!datosDiv) return;

  if (partido) {
    window.rivalActual = partido.rival;

    datosDiv.innerHTML = `
      <strong>Rival:</strong> ${partido.rival} <br />
      <strong>Estadio:</strong> ${partido.estadio} <br />
      <strong>Fecha:</strong> ${partido.fecha} ${partido.hora} <br />
      <strong>Competición:</strong> ${partido.competicion}
    `;

    const filtroInfo = document.getElementById("filtro-info");
    if (filtroInfo) {
      filtroInfo.textContent = `Mostrando equipos para: ${partido.rival}`;
    }

  } else {
    datosDiv.innerText = "No se pudo cargar el próximo partido.";
    const filtroInfo = document.getElementById("filtro-info");
    if (filtroInfo) filtroInfo.textContent = "";
  }
}

// Carga datos desde la API y actualiza cache solo si cambió
async function cargarDatosPartido() {
  try {
    const nuevoPartido = await obtenerProximoPartido();
    if (!nuevoPartido) return mostrarDatosPartido(null);

    mostrarDatosPartido(nuevoPartido);

    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    const cacheDatos = cache.datos || {};
    const ahora = Date.now();

    // Guardar en cache solo si no existe o si pasó más de 12 horas
    if (
      !cache.fechaCache ||
      ahora - cache.fechaCache > 12 * 60 * 60 * 1000 ||
      nuevoPartido.rival !== cacheDatos.rival
    ) {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ datos: nuevoPartido, fechaCache: ahora })
      );
    }
  } catch (err) {
    console.error("Error cargando próximo partido:", err);
    mostrarDatosPartido(null);
  }
}

// Mostrar desde cache si existe y es reciente
function mostrarPartidoConCache() {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  const ahora = Date.now();

  if (cache.fechaCache && ahora - cache.fechaCache <= 12 * 60 * 60 * 1000 && cache.datos) {
    mostrarDatosPartido(cache.datos);
  } else {
    cargarDatosPartido();
  }
}

// Programar actualización automática a medianoche
function programarActualizacionMedianoche() {
  const ahora = new Date();
  const manana = new Date(ahora);
  manana.setHours(24, 0, 0, 0);
  const msHastaMedianoche = manana - ahora;

  setTimeout(() => {
    cargarDatosPartido();
    programarActualizacionMedianoche();
  }, msHastaMedianoche);
}

window.addEventListener("DOMContentLoaded", () => {
 
  mostrarPartidoConCache();
  programarActualizacionMedianoche();

  if (typeof mostrarEquiposLocal === "function") {
    mostrarEquiposLocal();
  }
});



