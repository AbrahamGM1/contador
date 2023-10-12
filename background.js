
/**
 * Recibe el mensaje de accion.js
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.button === "clicked")
        sendResponse({text: "goodbye"});
    }
  );
