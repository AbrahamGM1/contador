/**
 * este service worker se encargara de realizar las consultas relacionadas a la busqueda 
 * de id del video
 */


let tokenGuardar = "";

chrome.identity.getAuthToken({ interactive: true ,scopes: ['https://www.googleapis.com/auth/drive']}, function (token) {
   tokenGuardar = token;
   console.log(tokenGuardar);
});

//funcion para eliminar elementos del localstorage
/*
chrome.storage.local.remove('arregloBusquedaVideo', function() {
    console.log('Se eliminó el arreglo de búsqueda de videos.');
  });
*/

chrome.storage.local.get('arregloBusquedaVideo', function(result) {
    console.log("arreglo busqueda: ",result.arregloBusquedaVideo);
    if (!result.arregloBusquedaVideo) {
      chrome.storage.local.set({ 'arregloBusquedaVideo': [] }, function() {
        console.log('se creo un array para almacenar las etiquetas sin id encontrado');
      });
    }else{
      console.log("existia un array de busqueda antes")
    }
});

function guardarEnBusqueda(nombreLlamada,fechaLlamada,arregloEtq){
    chrome.storage.local.get('arregloBusquedaVideo', function(result) {
      
    let infoLlamada = JSON.stringify({
               "nombreLlamada":nombreLlamada,
               "fechaLlamada":fechaLlamada,
               "etiquetas":arregloEtq
               });

    console.log(infoLlamada, " se agrego a la cola de busqueda de id");

    result.arregloBusquedaVideo.push(infoLlamada);
  
      chrome.storage.local.set({ 'arregloBusquedaVideo': result.arregloBusquedaVideo}, function() {
        console.log('Array de busqueda actualizado');
        console.log(result.arregloBusquedaVideo)
  
        //comienza el funcionamiento de las colas tras actualizar
        if(result.arregloBusquedaVideo.length  === 0){
          console.log("no hay tags en la cola de busqueda de videos") 
        }else{
          colasBusquedaVideo();
        }
      });
      
    });
}

async function colasBusquedaVideo(){
    chrome.storage.local.get('arregloBusquedaVideo', function(result) {  
      if(result.arregloBusquedaVideo.length === 0){
         console.log("no hay videos pendientes en la cola de busqueda") 
      }else{
         let primerVideo = JSON.parse(result.arregloBusquedaVideo[0]);
         console.log("voy a comenzar la busqueda de la siguiente llamada",primerVideo.nombreLlamada)
  
        consultarApi(primerVideo);

      }
      
    });
}

function consultarApi(primerVideo){
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
            console.log("arreglo completo:", arreglo);

            try{
            arreglo.forEach(element => {
               if(element.name.includes(primerVideo.fechaLlamada) &&  element.name.includes(primerVideo.nombreLlamada)){
                 console.log("se encontro la llamada");
                 console.log("id: ",element.id);
                 console.log("name: ",element.name);
                 
                 let infoLlamadaActualizado = {
                    "nombreLlamada":primerVideo.nombreLlamada,
                    "fechaLlamada":primerVideo.fechaLlamada,
                    "etiquetas":primerVideo.etiquetas,
                    "id":element.id
                 };               
                 
                 var breakException = infoLlamadaActualizado;

                 throw breakException;
               }else{
                
               }
            });
            
            console.log("todavia no se encuentra el id....")
            setTimeout(() => {
                consultarApi(primerVideo);
            }, 300000);

            }catch(infoLlamadaActualizado){
              cambiarPermisos(infoLlamadaActualizado);    
            }
        });
  }
  
  function cambiarPermisos(infoLlamadaActualizado){
    if(infoLlamadaActualizado.id){
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
       `https://www.googleapis.com/drive/v3/files/${infoLlamadaActualizado.id}/permissions`,
         init)
       .then((response) => response.json())
       .then(function(data) {
           console.log(data);
           guardarVideo(infoLlamadaActualizado);
       });
    }
  }
  
  function guardarVideo(infoLlamadaActualizado){
    if(infoLlamadaActualizado.id){
     let init = {
       method: 'POST',
       async: true,
       body: JSON.stringify({
        "artifactName": infoLlamadaActualizado.nombreLlamada,
        "artifactLocation": `https://drive.google.com/file/d/${infoLlamadaActualizado.id}`,
        "artifactFormat": "mp4",
        "artifactTags": [],
        "isMadeBy": "",
        "hasUsedIn": "",
        "hasTaggedBy": "",
        "isUsedBy": ""
       })
       ,
       headers: {
         'Content-Type': 'application/json'
       },
       'contentType': 'json'
     };
     fetch(
       `https://apivideotagger.borrego-research.com/webserviceontology/videotagger/videos/save`,
         init)
       .then((response) => response.json())
       .then(function(data) {
           console.log(data);
           guardarEnCola(infoLlamadaActualizado.id,infoLlamadaActualizado.etiquetas);
           guardarSiguiente();
       });
    }
  }

  //borra el que se acaba de agregar de la cola y vuelve a lanzar la cola 
  function guardarSiguiente(){
    chrome.storage.local.get('arregloBusquedaVideo', function(result) {

        result.arregloBusquedaVideo.shift();
  
        chrome.storage.local.set({ 'arregloBusquedaVideo': result.arregloBusquedaVideo}, function() {
          console.log('Array busqueda actualizado');
          console.log(result.arregloBusquedaVideo);
    
          //comienza el funcionamiento de las colas tras actualizar
          if(result.arregloBusquedaVideo.length === 0){
            console.log("no hay mas videos del cual buscar el id") 
          }else{
            colasBusquedaVideo();
          }
        });

      });
  }

/*
//funcion para eliminar elementos del localstorage

chrome.storage.local.remove('arregloBusquedaVideo', function() {
    console.log('Se eliminó el arreglo de búsqueda de videos.');
  });
*/