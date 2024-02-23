/**
 * este service worker se encargara de realizar las consultas relacionadas a la busqueda 
 * de id del video
 */


let tokenGuardar = "";

chrome.identity.getAuthToken({ interactive: true ,scopes: ['https://www.googleapis.com/auth/drive']}, function (token) {
   tokenGuardar = token;
   console.log("se creo token de api")
});

//funcion para eliminar elementos del localstorage
/*
chrome.storage.local.remove('arregloBusquedaVideo', function() {
    console.log('Se eliminó el arreglo de búsqueda de videos.');
  });
*/

/*  
chrome.storage.local.set({ 'arregloBusquedaVideo': [JSON.stringify({nombreLlamada: "ejemplo",fechaLlamada:"2002-11-02",etiquetas:["etiqueta","asdfas"]})] }, function() {
  console.log('se creo un array para almacenar las etiquetas sin id encontrado');
});
*/


chrome.storage.local.get('arregloBusquedaVideo', function(result) {
    console.log("arreglo busqueda: ",result.arregloBusquedaVideo);
    if (!result.arregloBusquedaVideo) {
      chrome.storage.local.set({ 'arregloBusquedaVideo': [] }, function() {
        console.log('se creo un array para almacenar videos por guardar');
      });
    }else{

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
              console.log("length del arreglo, ",infoLlamadaActualizado.etiquetas.length);

              guardarArregloVideo(infoLlamadaActualizado); 
              guardarEnPermisos(infoLlamadaActualizado);   
            }
        }).catch((error) => {
            console.error("Ha fallado la consulta con el sig error");
            console.error(error);

            setTimeout(() => {
              colasBusquedaVideo();
           }, 10000);
            
        });
  }
  
  


/*
//funcion para eliminar elementos del localstorage

chrome.storage.local.remove('arregloBusquedaVideo', function() {
    console.log('Se eliminó el arreglo de búsqueda de videos.');
  });
*/