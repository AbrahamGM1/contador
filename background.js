chrome.action.onClicked.addListener(function() {
  chrome.tabs.create({url: 'index.html'});
});

let popupWindow = null;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'botonPresionado') {
      console.log("el boton se presiono");
   
      if (popupWindow && !popupWindow.closed) {
         console.log("la ventana ya esta activa");
      } else {
      
        popupWindow = chrome.windows.create({
            url: 'popup.html',
            type: 'popup'
        });
      }

  }
});