/**
 * Se crea un elemento tipo botón que se encontrará sobrepuesto por encima de todas las páginas web
 */
let button = document.createElement("button")
button.id = "botonPicame"
button.innerText = "Iniciar grabación"
document.getElementsByTagName("body")[0].appendChild(button)

/**
 * Le damos una función al botón
 */
button.addEventListener('click',()=>{
    //HACER QUE FUNCIONE EL CONTADOR

    //........

    //Le manda el mensaje al background
    chrome.runtime.sendMessage({button:"clicked"}, function(response){
        console.log(response.text);
    })

});
