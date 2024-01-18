/**
 * este service worker se encargara de realizar las consultas relacionadas a las colas
 */
console.log("hola mundo")

/**
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
      });
      */
    }
  });

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'nuevaLlamada') {

        console.log("llego a archivo de colas los siguientes datos: ")
        console.log(message.idvideo);
        console.log(message.arreglo);
    }
});
