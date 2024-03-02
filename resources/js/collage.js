
// Obtener todas las imágenes
const imagenes = document.querySelectorAll('img');

// Índice para mantener el seguimiento de la imagen actual
let indice = 0;
let maxscroll = window.innerHeight;
let noimages = 40;
let gap = maxscroll / noimages;
let i = 0;
var scrollPosition = 0;
let ubicontenedor = 0;
let imageContainers;
// Función para cambiar la opacidad de las imágenes de forma animada
function cambiarOpacidad() {
    scrollPosition = window.scrollY;// + window.innerHeight;
    if (i >= imagenes.length){
        i = 0;
    }
    const currgap = (gap * (i)) + ubicontenedor - 100;
    //console.log(scrollPosition,currgap,window.innerHeight);

    var rect = imageContainers[i].getBoundingClientRect();
    var vhValue = 30;
    var pxValue = (vhValue * window.innerHeight) / 100;
    if (!isEndOfDocument()) {
        if (scrollPosition >= rect.top + pxValue) {
            // Si el scroll está más allá de la posición de la imagen actual, hacerla visible
            if (imagenes[i].style.opacity !== '1') {
                imagenes[i].style.opacity = '1';
                imagenes[i].style.visibility = "visible";
            }
        } else {
            // Si el scroll está antes de la posición de la imagen actual, ocultarla
            if (imagenes[i].style.opacity !== '0') {
                imagenes[i].style.opacity = '0';
            }
        }
        i++;
    }
    else{
        for (let j = 0; j < imagenes.length; j++){
            imagenes[j].style.opacity = '1';
            imagenes[j].style.visibility = "visible";
        }
            
            // Realizar acciones adicionales aquí si se alcanza el final del documento
    }
}

// Función para animar las imágenes de forma continua
function animar() {
    // Cambiar la opacidad de las imágenes
        // Realiza tus tareas aquí
        cambiarOpacidad();

    // Programa el próximo fotograma
    requestAnimationFrame(animar);
}

// Iniciar la animación


function obtenerAltura() {
    var collageHeight = document.querySelector('.collage');
    var contenedorHeight = collageHeight.offsetHeight; // Altura del contenedor
    var ventanaHeight = window.innerHeight; // Altura de la ventana del navegador}
    var contenedor = document.querySelector('.collage');
    var rect = contenedor.getBoundingClientRect();
    ubicontenedor = rect.top;
    //console.log(ubicontenedor);
    //console.log('Altura de la ventana:', ventanaHeight);
}

// Llama a la función cuando la página se carga por completo
window.onload = obtenerAltura;


function isElementVisible(el) {
    var rect = el.getBoundingClientRect();
    
    return (
        rect.top <= window.innerHeight
    )
    ;
}

// Función para manejar el evento de scroll
function handleScroll() {
    var contenedor = document.querySelector('.collage');
    if (isElementVisible(contenedor)) {
        // El contenedor es visible en la pantalla, haz lo que necesites aquí
        //console.log("El contenedor es visible");
        animar();
    }
}

// Agregar un event listener al evento de scroll
window.addEventListener('scroll', handleScroll);

document.addEventListener("DOMContentLoaded", function() {
    // Selecciona todos los elementos .image-container
    imageContainers = document.querySelectorAll('.image-container');
    for (let j = 0; j < imagenes.length; j++){
        imagenes[j].style.visibility = "hidden";
    }
});


function isEndOfDocument() {
    return (window.innerHeight + window.scrollY + 3) >= document.documentElement.scrollHeight;
}


