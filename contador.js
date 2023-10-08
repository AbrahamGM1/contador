let tiempoRef = Date.now();
let inicio = true;
let acumulado = 0;

// Intenta cargar los valores del Local Storage al inicio
const almacenado = localStorage.getItem('contador');
if (almacenado) {
  const { inicioGuardado, acumuladoGuardado, tiempoRefGuardado } = JSON.parse(almacenado);
  inicio = inicioGuardado;
  acumulado = acumuladoGuardado;
  tiempoRef = tiempoRefGuardado;
}

function guardarEstado() {
  // Guarda el estado en el Local Storage
  localStorage.setItem('contador', JSON.stringify({ inicioGuardado: inicio, acumuladoGuardado: acumulado, tiempoRefGuardado: tiempoRef }));
}

function iniciar() {
  inicio = true;
  tiempoRef = Date.now(); // Actualizar la referencia de tiempo
  guardarEstado();
}

function detener() {
  inicio = false;
  guardarEstado();
}  

setInterval(() => {
  let tiempo = document.getElementById("tiempo");
  if (inicio) {
    acumulado += Date.now() - tiempoRef;
  }
  tiempoRef = Date.now();
  tiempo.innerHTML = formatearMS(acumulado);
}, 1000 / 60);

function formatearMS(tiempo_ms) {
  let MS = tiempo_ms % 1000;
  let St = Math.floor(tiempo_ms / 1000);
  let S = St % 60;
  let M = Math.floor((St / 60) % 60);
  let H = Math.floor(St / 3600);

  Number.prototype.ceros = function (n) {
    return (this + "").padStart(n, 0);
  }

  return H.ceros(2) + ":" + M.ceros(2) + ":" + S.ceros(2) + "." + MS.ceros(3);
}