let tiempoRef = Date.now();
let inicio = false;
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
  localStorage.setItem('contador', JSON.stringify({ inicioGuardado: inicio, acumuladoGuardado: acumulado, tiempoRefGuardado: tiempoRef, activo:inicio}));
}

//Función que se ejecuta 60 veces por segundo que se encarga de actualizar constantemente el contador de la grabación
setInterval(() => {
  let tiempo = document.getElementById("tiempo");

  if (inicio) {
    acumulado += Date.now() - tiempoRef;
  }
  tiempoRef = Date.now();
  tiempo.innerHTML = formatearMS(acumulado);
  guardarEstado()
}, 1000 / 60);

//Pa poner bonita la presentación del texto del tiempo
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

// Recupera el boton del propio popup
document.addEventListener("DOMContentLoaded", function() {
  var boton = document.getElementById('grabar');

  //Cambia entre verdadero o falso segun la situcación en la que se encuentre la variable de inicio
  boton.addEventListener("click", function() {
      //Si se está "grabando" y se pulsa el botón, se detiene la "grabación" y se pone en 0 todo
      if (inicio == true) {
          inicio = false;
          localStorage.setItem('contador', JSON.stringify({ inicioGuardado: 0, acumuladoGuardado: 0, tiempoRefGuardado: 0, activo: inicio }));
          acumulado = 0;
          boton.innerHTML = "Grabar sesión";
      } else {
          //Si esta detenido, pues "inicia la grabación"
          inicio = true;
          boton.innerHTML = "Detener grabación";
      }
  });
});

