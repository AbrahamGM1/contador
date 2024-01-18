/**
 * este service worker se encargara de realizar las consultas relacionadas a las colas
 */
console.log("hola mundo")

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'nuevaLlamada') {

        console.log(message.idvideo);
    }
});
