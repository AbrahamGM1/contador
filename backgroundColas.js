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
      });c
      */
    }
  });

function guardarEnCola(id,arregloEtq){
  chrome.storage.local.get('arregloColas', function(result) {
    

    arregloEtq.forEach(element => {
      console.log(element, " agregado a colas")
      result.arregloColas.push(element)
    });
    
      
    chrome.storage.local.set({ 'arregloColas': result.arregloColas}, function() {
      console.log('Array actualizado');
      console.log(result.arregloColas)
    });
    
  });
}
