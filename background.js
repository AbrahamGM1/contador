let nombreLlamada = "";
let fechaLlamada = "";
let intervalo = "";
let tokenGuardar = "";
let popupWindow = null;

chrome.identity.getAuthToken({ interactive: true }, function (token) {
   tokenGuardar = token;
   console.log(tokenGuardar)
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'grabando') {
      console.log("el boton se presiono");
      nombreLlamada = message.nombreLlamada;
      fechaLlamada = message.fechaLlamada;
   
      //if (popupWindow && !popupWindow.closed) {
      //   console.log("la ventana ya esta activa");
      //} else {
      
        popupWindow = chrome.windows.create({
            url: 'popup.html',
            type: 'popup'
        });
      //}
  }

  if (message.action === "detenido"){
      
    intervalo = setInterval(consultarApi,10000);
     
  }

  if(message.action === "authToken"){
     tokenGuardar = message.tokenGuardar;
  }
});

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
      'https://www.googleapis.com/drive/v3/files?pageSize=5&fields=files(id,name)',
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
               clearInterval(intervalo);
             }
          });
      });
}