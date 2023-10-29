let tiempoRef = Date.now();
let inicio = false;
let acumulado = 0;
var arregloEtiquetas = []
var primeraConsulta = true
let tokenGuardar = "";

window.onload = function() {
  //document.querySelector('button').addEventListener('click', function() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      tokenGuardar = token;
    });
  //});
};

// Intenta cargar los valores del Local Storage que se usarán para el correcto funcionamiento de la extensión
const almacenado = localStorage.getItem('contador');
const arregloAlmacenado = JSON.parse(localStorage.getItem('arregloEtiquetas'));

//Los siguientes 2 ifs son necesarios para recuperar los valores del local storage y poder trabajar con ellos
if (almacenado) {
  const { inicioGuardado, acumuladoGuardado, tiempoRefGuardado } = JSON.parse(almacenado);
  inicio = inicioGuardado;
  acumulado = acumuladoGuardado;
  tiempoRef = tiempoRefGuardado;
}

if(arregloAlmacenado){
  arregloEtiquetas = arregloAlmacenado
} 


// Guarda el estado del contador en el Local Storage
function guardarEstado() {
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

/**
 * La siguiente función se encarga de utilizar el DOM para obtener todos los elementos
 * html del popup que sean necesarios el añadirles lógica para el funcionamiento del plugin
 */
document.addEventListener("DOMContentLoaded", function() {
  var boton = document.getElementById('grabar');
  var botonOk = document.getElementById('agregar')
  var txtEtiqueta = document.getElementById('texto')

  //Carga por primera vez toda la lista de elementos
  
  let arregloFinal = JSON.parse(localStorage.getItem('arregloEtiquetas'))
  
  if(arregloFinal){
  arregloFinal.forEach(element => {
    let parrafo = document.createElement('p')
    parrafo.className = "parrafo"
    parrafo.innerHTML = element
    document.body.appendChild(parrafo)
  });
  }

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
      let cadenacompleta = txtEtiqueta.value + ":" + formatearMS(acumulado)
      arregloEtiquetas.push(cadenacompleta)

      ///Mete dentro del arreglo el valor de la cadena
      //Mete el arreglo de puras strings al localstorage
      //Itera en un foreach todas las strings del arreglo
      //y muestralas en forma de lista
      localStorage.setItem('arregloEtiquetas',JSON.stringify(arregloEtiquetas))

      let arregloFinal = JSON.parse(localStorage.getItem('arregloEtiquetas'))

      if (primeraConsulta) {
        const parrafos = document.querySelectorAll("p")
        parrafos.forEach(function(parrafo){
          parrafo.remove();
        });
      } 


      arregloFinal.forEach(element => {
        let parrafo = document.createElement('p')
        parrafo.className = "parrafo"
        parrafo.innerHTML = element
        document.body.appendChild(parrafo)
      });
      

    }

  });


});

/*
document.addEventListener('DOMContentLoaded', function() {
  var boton = document.getElementById('consulta');
  var input = document.getElementById('labelConsultar');

  boton.addEventListener('click', function() {
    var texto = input.value;
    console.log(texto)
    consultarApi();
  });
});

async function consultarApi() {
  //while(true){
    let init = {
      method: 'GET',
      async: true,
      headers: {
        Authorization: 'Bearer ' + tokenGuardar,
        'Content-Type': 'application/json'
      },
      'contentType': 'json'
    };
    fetch(
        'https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name)',
        init)
        .then((response) => response.json())
        .then(function(data) {
            const arreglo = data.files;

            arreglo.forEach(element => {
              console.log('id: ',element.id, " nombre: ",element.name);
            });
        });
 // }
}
*/