import { obtenerProximoPartido } from "./proximoPartido.js";

const CACHE_KEY = "datosPartido";

// Función para mostrar los datos en el HTML
function mostrarDatosPartido(partido) {
  const datosDiv = document.getElementById("datos-proximo-partido");
  if (!datosDiv) return;

  if (partido) {
    datosDiv.innerHTML = `
      <strong>Rival:</strong> ${partido.rival} <br />
      <strong>Estadio:</strong> ${partido.estadio} <br />
      <strong>Fecha:</strong> ${partido.fecha} ${partido.hora} <br />
      <strong>Competición:</strong> ${partido.competicion}
    `;
  } else {
    datosDiv.innerText = "No se pudo cargar el próximo partido.";
  }
}

// Función para cargar datos desde la API y actualizar cache solo si cambió
async function cargarDatosPartido() {
  try {
    const nuevoPartido = await obtenerProximoPartido();
    mostrarDatosPartido(nuevoPartido);

    if (!nuevoPartido) return;

    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");

    // Guardar solo si es un partido diferente
    const cacheDatos = cache.datos || {};
    if (
      nuevoPartido.rival !== cacheDatos.rival ||
      nuevoPartido.fecha !== cacheDatos.fecha ||
      nuevoPartido.hora !== cacheDatos.hora
    ) {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ datos: nuevoPartido, fecha: new Date().toDateString() })
      );
    }
  } catch (err) {
    console.error("Error cargando próximo partido:", err);
    mostrarDatosPartido(null);
  }
}

// Función principal: usa caché si es del mismo día
function mostrarPartidoConCache() {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  const hoy = new Date().toDateString();

  if (cache.fecha === hoy && cache.datos) {
    mostrarDatosPartido(cache.datos);
  } else {
    cargarDatosPartido();
  }
}

// Función para programar actualización automática a medianoche
function programarActualizacionMedianoche() {
  const ahora = new Date();
  const manana = new Date(ahora);
  manana.setHours(24, 0, 0, 0); // medianoche
  const msHastaMedianoche = manana - ahora;

  setTimeout(() => {
    cargarDatosPartido();
    // Reprogramar para el siguiente día
    programarActualizacionMedianoche();
  }, msHastaMedianoche);
}

// Al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  mostrarPartidoConCache();
  programarActualizacionMedianoche();

  if (typeof mostrarEquiposLocal === "function") {
    mostrarEquiposLocal();
  }
});
