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
    intervaloConsultas = setInterval(consultarApi,300000);
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

function consultarApi(){
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
               cambiarPermisos(element.id);
             }else{
              console.log("todavia no se encuentra el id..")
             }
          });
      });
}

function cambiarPermisos(id){
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
     });
  }
}

