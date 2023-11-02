var boton = "";

function crearFecha(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`;
}

let botonUnirse = document.querySelector('[jsname="Qx7uuf"]');

if(botonUnirse){
    console.log("se configuro el boton unirse"); //boton unirse reunion
    botonUnirse.addEventListener('click', function(){
        setTimeout(function(){
            configurarBoton();
        },1000);
    });
}

let botonCrear = document.querySelector('[jsname="CuSyi"]');

if(botonCrear){
    console.log("se configuro el boton crear"); //boton crear reunion

    botonCrear.addEventListener('click', function(){
        setTimeout(function(){
            configurarBoton();
        },1000);          
    });
}

//si va por el menu de 3 puntos
function configurarBoton(){
    boton = document.querySelector('[jsname="NakZHc"]'); //boton del menu

   //configura boton en caso de presion 3 puntos
    if(boton){
        console.log("se ha configurado el boton");
        boton.addEventListener('click', function() {
            
            setTimeout(function(){
                var botonIniciar = document.querySelector('[jsname="wcuPXe"]');
                 //boton iniciar grabacion
                if(botonIniciar){
                    console.log("Se configuro el boton de empezar")
                    botonIniciar.addEventListener('click', function(){
                        configurarBotonPreGrabacion()
                    })
                }else{
                    console.log("no se encontro el boton de grabacion");
                }
            }, 1000);

        });      
    }else{
      console.log("no se encontro el boton de menu");
    }

    var botonComponentes = document.querySelector('[jsname="A5il2e"]');
    
    if(botonComponentes){
        console.log("se configuro boton componentes");
        botonComponentes.addEventListener('click', function() {
            console.log("ay cabron");
        });    
        
    }

}

/* codigo cuando comienza la grabacion
                        var objeto = document.querySelector('[jsname="NeC6gb"]');
                        
                        if (objeto) {
                            var texto = objeto.textContent;
                            console.log(texto," fecha: ",crearFecha(new Date()));
                            chrome.runtime.sendMessage({ action: 'botonPresionado' });
                        } else {
                            console.log("No se encontró el elemento.");
                        }
*/

function configurarBotonPreGrabacion(){
    setTimeout(function(){
        let botonGrabacion = document.querySelector('[jsname="A0ONe"]');

        if(botonGrabacion){
            console.log("se configuro el boton grabacion"); //boton crear reunion
        
            botonGrabacion.addEventListener('click', function(){
                setTimeout(function(){
                    configurarGrabar();
                },1000);          
            });
        }  
    },1000);    

}

function configurarGrabar(){
    setTimeout(function(){
        let botonGrabacion = document.querySelector('button[data-idom-class="ksBjEc lKxP2d LQeN7 AjXHhf"][data-mdc-dialog-action="A9Emjd"]');
        if(botonGrabacion){
            console.log("se configuro el boton de iniciar grabacion final"); //boton crear reunion
        
            botonGrabacion.addEventListener('click', function(){
                console.log("se esta grabando")
            });
        }  
    },1000);    
}





/*
const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read`;

  // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);
}
*/