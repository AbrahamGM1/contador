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

//Esto nomás es pa poner bonita la presentación del texto del tiempo
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

//////////////////////////////////////////Modificaciones con DOM
var etiquetas = []

/**
 * La siguiente función se encarga de utilizar el DOM para obtener todos los elementos
 * html del popup que sean necesarios el añadirles lógica para el funcionamiento del plugin
 */
document.addEventListener("DOMContentLoaded", function() {
  var boton = document.getElementById('grabar');
  var botonOk = document.getElementById('agregar')
  var txtEtiqueta = document.getElementById('texto')

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

  /**
   * La siguiente funcion se encarga de obtener lo que esté escrito dentro del 
   * campo de texto para despues irlo desplegando en una lista, a su vez que va
   * guardando cada etiqueta dentro del localstorage. Por ahora nomás hará agregar,
   * mas adelante se debera de poder modificar o eliminar.
   */
  botonOk.addEventListener("click", function() {
    let nuevaEtiqueta = txtEtiqueta.value 
    //Si no hay nada ps no hace nada
    if(nuevaEtiqueta==""){

    } 
    //Si hay algo escrito, se guarda dentro del local storage y lo despliega debajo
    else if (nuevaEtiqueta !="") {
      let etiqueta = document.createElement("p")
      let cadenacompleta = txtEtiqueta.value + ":" + formatearMS(acumulado)
      etiqueta.innerHTML = cadenacompleta
      txtEtiqueta.value = ""
      document.body.appendChild(etiqueta)
    }

  });



});


