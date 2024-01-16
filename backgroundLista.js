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
//a
let videos = [];
let videosAntes;

chrome.identity.getAuthToken({ interactive: true, scopes: ['https://www.googleapis.com/auth/drive']  }, function (token) {
   tokenGuardar = token;
   console.log(token);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'grabando') {
      console.log("el boton se presiono");
      //consulta los videos que se encuentren antes de la grabacion antes
      //guarda la lista de los videos
      consultarNumeroArchivos("",message.action);
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
    //¡
    videosAntes = videos;
    videos = [];
    consultarNumeroArchivos("",message.action)
    //intervaloConsultas = setInterval(consultarApi,10000);
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

/** 
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
               clearInterval(intervaloConsultas);
             }
          });
      });     
}


*/


function consultarNumeroArchivos(nextToken,estado){
 
  let init;
   
  //configura la consulta dependiendo si regresa el resultado paginado o uno completo
  if(nextToken === ""){
    init = {
      method: 'GET',
      async: true,
      headers: {
        Authorization: 'Bearer ' + tokenGuardar,
        'Content-Type': 'application/json'
      },
      params: {
         q: "mimeType contains 'video/'"
      },
      'contentType': 'json'
    };

    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.append('q', "mimeType contains 'video/'");
  
    init.url = url;
  }else{
    init = {
      method: 'GET',
      async: true,
      headers: {
        Authorization: 'Bearer ' + tokenGuardar,
        'Content-Type': 'application/json',
      },
      params: {
         q: "mimeType contains 'video/'",
         pageToken: nextToken
      },
      'contentType': 'json'
    };

    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.append('q', "mimeType contains 'video/'");
    url.searchParams.append('pageToken', nextToken);
  
    init.url = url;

  }

  fetch(
      init.url,
      init)
      .then((response) => response.json())
      .then(function(data) {

        console.log(data);

        const arreglo = data.files;

        arreglo.forEach(element => {
           videos.push(element);
        });

        console.log("numero de videos: ",videos.length)

        if(data.nextPageToken){
            console.log("faltan videos por agregar al conteo")
             
            consultarNumeroArchivos(data.nextPageToken,estado)

        }else{
          console.log("videos totales: ");
          console.log(videos.length);

          if(estado === "detenido"){
            comprobarNumeroVideos();
          }
        }

  }); 
}

function comprobarNumeroVideos(){
  if(videosAntes.length === videos.length){
    console.log("cantidad sigue siendo la misma");
    videos = [];
    setTimeout(function() {
      consultarNumeroArchivos("", "detenido");
    }, 10 * 60 * 1000);
  }else{
    console.log("se ha encontrado una diferencia");

    console.log(videos[0]);

    console.log("el id del video es: ",videos[0].id);

    cambiarPermisos(videos[0].id);
  }
}

//cambia los permisos del video a que todos los puedan visualizar
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

