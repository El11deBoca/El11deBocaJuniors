const form = document.getElementById("formacionForm");
const jugadoresInput = document.getElementById("jugadores");
const usuarioInput = document.getElementById("usuario");
const formacionesContainer = document.getElementById("formacionesContainer");
const equipoIdealContainer = document.getElementById("equipoIdeal");

let formaciones = [];
let votos = {};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = usuarioInput.value.trim();
  const jugadores = jugadoresInput.value.trim().split("\n").map(j => j.trim()).filter(j => j);

  if (jugadores.length !== 11) {
    alert("Debes ingresar exactamente 11 jugadores.");
    return;
  }

  const formacion = { usuario, jugadores };
  formaciones.push(formacion);
  actualizarFormaciones();
  actualizarEquipoIdeal();
  form.reset();
});

function actualizarFormaciones() {
  formacionesContainer.innerHTML = "<h2>Formaciones Enviadas</h2>";
  formaciones.forEach((f, i) => {
    const div = document.createElement("div");
    div.className = "formacion";
    div.innerHTML = `<strong>${f.usuario}:</strong><br>${f.jugadores.join("<br>")}`;
    formacionesContainer.appendChild(div);
  });
}

function actualizarEquipoIdeal() {
  votos = {};
  formaciones.forEach(f => {
    f.jugadores.forEach(j => {
      votos[j] = (votos[j] || 0) + 1;
    });
  });

  const jugadoresOrdenados = Object.entries(votos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 11);

  equipoIdealContainer.innerHTML = "<h2>Equipo Ideal</h2><ol id='equipoIdeal'></ol>";
  const lista = document.getElementById("equipoIdeal");
  jugadoresOrdenados.forEach(([jugador, cantidad]) => {
    const li = document.createElement("li");
    li.textContent = `${jugador} (${cantidad} votos)`;
    lista.appendChild(li);
  });
}
