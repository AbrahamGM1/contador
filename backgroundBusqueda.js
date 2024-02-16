/**
 * este service worker se encargara de realizar las consultas relacionadas a la busqueda 
 * de id del video
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
      console.log(result);
  
      if(result.arregloBusquedaVideo.length === 0){
         console.log("no hay videos pendientes en la cola de busqueda") 
      }else{
         let primerVideo = result.arregloBusquedaVideo[0];
         console.log("voy a comenzar la busqueda de la siguiente llamada",primerVideo.nombreLlamada)
         setTimeout(() => {
          guardarEtiquetaWeb(primeraEtiqueta);
        }, 5000); 
      }
      
    });
}


/*
//funcion para eliminar elementos del localstorage

chrome.storage.local.remove('arregloBusquedaVideo', function() {
    console.log('Se eliminó el arreglo de búsqueda de videos.');
  });
*/