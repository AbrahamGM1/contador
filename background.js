importScripts('backgroundColas.js');
//datos de la llamada
let nombreLlamada = "";
let fechaLlamada = "";
//intervalo para las consultas
let intervaloConsultas = null;
//intervalo del contador
let intervaloContador = null;
//token del usuario
let tokenGuardar = "";
//popup
let popupWindow = null;
//tiempo acumulado del contador
let acumulado = 0;

/*
var dataToSave = {
  arregloEtiquetas: ["1","2"],
  someOtherData: 'value'
};

chrome.storage.local.set(dataToSave, function() {
  console.log('Data saved successfully');
});
*/
/*
arregloPrueba = ["b","c"]
setTimeout(() => {
  // Después de esperar 5 segundos, coloca el código que deseas ejecutar.
  guardarEtiquetasCola("id",arregloPrueba);
}, 5000);
*/

chrome.storage.local.get('arregloEtiquetas', function(result) {
  console.log(result.arregloEtiquetas);
  if (!result.arregloEtiquetas) {
    chrome.storage.local.set({ 'arregloEtiquetas': JSON.stringify([]) }, function() {
      console.log('se creo un array para almacenar las etiquetas');
    });
  }else{
    console.log("existia un array antes")
  }
});


chrome.identity.getAuthToken({ interactive: true ,scopes: ['https://www.googleapis.com/auth/drive']}, function (token) {
   tokenGuardar = token;
   console.log(tokenGuardar);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'grabando') {
      console.log("el boton se presiono");
      nombreLlamada = message.nombreLlamada;
      fechaLlamada = message.fechaLlamada;
      console.log(popupWindow)

      if (popupWindow) {
        console.log("la ventana ya esta activa");
        iniciarContador();
      } else {
        crearVentana();
      }
  }

  if (message.action === "detenido"){
    detenerContador();
    console.log("comenzando busqueda del id...")

    //obtiene el arreglo de etiquetas
    chrome.storage.local.get('arregloEtiquetas', function(result) {

      console.log(result.arregloEtiquetas);
      //envia el arreglo a la consulta esperando el id para ser enviado a colas
      
      intervaloConsultas = setInterval(function() {
        consultarApi(result.arregloEtiquetas);
      }, 300000);
      
       //limpia el arreglo de etiquetas en caso de que se realice otra grabacion
       chrome.storage.local.set({ 'arregloEtiquetas': [] }, function() {
        console.log("array de etiquetas limpiado y mandado a colas")
       });
    });
  }
});

function crearVentana(){
  chrome.windows.create({
    url: 'popup.html',
    type: 'popup'
  }, function(ventana) {  
    iniciarContador();
    popupWindow = ventana;
    console.log(ventana);  
    removedListen(popupWindow.id);
  });  
}

function iniciarContador(){
  acumulado = 0; 

  intervaloContador = setInterval(() => {

    acumulado += 1000 ;

    chrome.runtime.sendMessage({ action: 'actualizarContador',tiempo: acumulado });
  
  }, 1000 / 60);
}

//error debido a que el intervalo sigue enviando actualizar aunque haya terminado
function detenerContador(){
   clearInterval(intervaloContador);
   acumulado = 0;
   chrome.runtime.sendMessage({action: 'actualizarContador',tiempo: acumulado})
}

function removedListen(id){
  chrome.windows.onRemoved.addListener(function(id) {
    if (popupWindow && id === popupWindow.id) {
        console.log('La ventana popup se ha cerrado.');
        popupWindow = null;
        detenerContador();
    }
  });
}

function consultarApi(arregloEtq){
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
    `https://www.googleapis.com/drive/v3/files?q=mimeType contains 'video/'`,
      init)
      .then((response) => response.json())
      .then(function(data) {
          const arreglo = data.files;

          arreglo.forEach(element => {
            console.log('id: ',element.id, " nombre: ",element.name);
             if(element.name.includes(fechaLlamada) &&  element.name.includes(nombreLlamada)){
               console.log("se encontro la llamada");
               console.log("id: ",element.id);
               console.log("name: ",element.name);
               clearInterval(intervaloConsultas);
               cambiarPermisos(element.id,arregloEtq);
             }else{
              console.log("todavia no se encuentra el id..")
             }
          });
      });
}

function cambiarPermisos(id,arregloEtq){
  if(id){
   let init = {
     method: 'POST',
     async: true,
     body: JSON.stringify({
       "role": "writer",
       "type": "anyone"
     })
     ,
     headers: {
       Authorization: 'Bearer ' + tokenGuardar,
       'Content-Type': 'application/json'
     },
     'contentType': 'json'
   };
   fetch(
     `https://www.googleapis.com/drive/v3/files/${id}/permissions`,
       init)
     .then((response) => response.json())
     .then(function(data) {
         console.log(data);
         guardarEtiquetasCola(id,arregloEtq);
     });
  }
}

function guardarEtiquetasCola(id,arregloEtq){
  guardarEnCola(id,arregloEtq);
}


