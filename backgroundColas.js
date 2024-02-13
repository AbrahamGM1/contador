/**
 * este service worker se encargara de realizar las consultas relacionadas a las colas
 */
console.log("hola mundo")

//codigo comentado siguiente es para limpiar el array de colas para pruebas

/*
 var dataToSave = {
    arregloColas: [],
    someOtherData: 'value'
  };
  
  chrome.storage.local.set(dataToSave, function() {
    console.log('Data saved successfully');
  });
*/


chrome.storage.local.get('arregloColas', function(result) {
    console.log(result.arregloColas)
    if (!result.arregloColas) {
      chrome.storage.local.set({ 'arregloColas': JSON.stringify([]) }, function() {
        console.log('se creo un array para almacenar las etiquetas para uso de las colas');
      });
    }else{
      console.log("existia un array de colas antes")
      //delete result.arregloColas

      /*
      chrome.storage.local.set(result, function() {
        console.log('borrado');
      });c
      */
    }
  });

function guardarEnCola(id,arregloEtq){
  chrome.storage.local.get('arregloColas', function(result) {
    
    arregloEtq.forEach(element => {
      console.log(element, " agregado a colas")
      result.arregloColas.push(element+`,${id}`);
    });
    
      
    chrome.storage.local.set({ 'arregloColas': result.arregloColas}, function() {
      console.log('Array actualizado');
      console.log(result.arregloColas)

      //comienza el funcionamiento de las colas tras actualizar
      if(result.arregloColas.length === 0){
        console.log("no hay tags en la cola") 
      }else{
        colasWebService();
      }
    });
    
  });
}

//cola simulada
async function colasWebService(){
  chrome.storage.local.get('arregloColas', function(result) {
    console.log(result);

    if(result.arregloColas.length === 0){
       console.log("no hay tags en la cola") 
    }else{
       let primeraEtiqueta = result.arregloColas[0];
       console.log("voy a guardar esta etiqueta: ",primeraEtiqueta)
       setTimeout(() => {
        guardarEtiquetaWeb(primeraEtiqueta);
      }, 5000); 
    }
    
  });
}

function guardarEtiquetaWeb(etiqueta){

  let parts = etiqueta.split(',');

  console.log(parts);

  let id = parts[2];
  let tagDescripcion = parts[0];
  let tagTiempo = parts[1];

  if(etiqueta){
   let init = {
     method: 'PUT',
     async: true,
     body: JSON.stringify({
      "url": `https://drive.google.com/file/d/${id}`,
      "artifactTag": tagDescripcion,
      "timestamp": tagTiempo
    })
     ,
     headers: {
       'Content-Type': 'application/json'
     }
   };
   fetch(
     "https://apivideotagger.borrego-research.com/webserviceontology/videotagger/videos/tag",
       init)
     .then((response) => console.log(response))
     .then(function(data) {
         console.log(data);
         chrome.storage.local.get('arregloColas', function(result) {

          result.arregloColas.shift();
    
          chrome.storage.local.set({ 'arregloColas': result.arregloColas}, function() {
            console.log('Array actualizado');
            console.log(result.arregloColas)
      
            //comienza el funcionamiento de las colas tras actualizar
            if(result.arregloColas.length === 0){
              console.log("no hay tags en la cola") 
            }else{
              colasWebService();
            }
          });

          
        });
     });
  }
}