let currentLanguage = "en";
currentLanguage = sessionStorage.getItem('currentLanguage') || 'en';
//const textContainer = document.getElementById('textContainer'); // Acceder al contenedor de texto globalmente

function changeLanguage(lang) {
    fetch('./resources/json/lang.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            //console.log('JSON response:', response);
            //console.log(data);
            return response.json();
        })
        .then(data => {
            if (!data) {
                throw new Error('JSON data is undefined');
            }
            // Verificar si la clave 'lang' existe en el objeto data
            if (!data[lang]) {
                throw new Error(`Language '${lang}' not found in JSON`);
            }
            // Obtener todos los elementos con atributo data-translate
            const elements = document.querySelectorAll('[data-translate]');
            // Iterar sobre los elementos
            elements.forEach(element => {
                // Obtener la clave del elemento
                const key = element.getAttribute('data-translate');
                // Verificar si la clave 'key' existe en el objeto data[lang]
                if (!data[lang][key]) {
                    console.error(`Key '${key}' or language '${lang}' not found in JSON`);
                    return; // Salir de la iteración actual si la clave no existe
                }
                // Obtener el texto correspondiente al idioma seleccionado
                const text = data[lang][key];
                // Asignar el texto al elemento
                element.textContent = text;
                //textContainer.style.overflow = 'hidden';
                //textContainer.style.overflowWrap = 'break-word';
                //textContainer.style.whiteSpace = 'normal';
            });
        })
        .catch(error => console.error('Error fetching or parsing JSON:', error));
}


// Cargar lenguaje
changeLanguage(currentLanguage);

document.addEventListener('DOMContentLoaded', function() {
    var imgPower = document.getElementById('power');

    // Verificar si el elemento existe
    if (imgPower) {
        // Agregar un evento de click a la imagen
        imgPower.addEventListener('click', function() {
            // Redirigir al index.html al hacer clic en la imagen
            console.log("Power Clicked!");
            window.location.href = 'index.html';
        });
    } else {
        console.log("Element with ID 'power' does not exist.");
    }
    const enlaces = document.querySelectorAll('.mLanguage'); // Selecciona los enlaces con la clase mLanguage

    enlaces.forEach(function(enlace) {
        enlace.addEventListener('click', function(event) {
            event.preventDefault(); // Evita que el enlace redirija a la página
            //console.log('¡Se ha presionado el enlace!');
            
            // Cambiar el idioma
            if (currentLanguage === "en"){
                currentLanguage = "es";
            } else if (currentLanguage === "es"){
                currentLanguage = "en";
            }
            changeLanguage(currentLanguage);
            sessionStorage.setItem('currentLanguage', currentLanguage);
        });
    });
});

function copiarCodigo(botonClickado) {
    var code = botonClickado.parentElement.nextElementSibling.querySelector('pre code').textContent;

    var tempTextArea = document.createElement('textarea');
    tempTextArea.value = code;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
}


const downloadLinks = {
    tServices11: 'https://drive.google.com/uc?export=download&id=1FT56Wa-awr75KqKKsgmb0m3nVGixVpqo',
    tServices12: 'https://drive.google.com/uc?export=download&id=1wQSAZK7X28D54R6rZVBCMMpQRGETVKQu',
    tServices13: 'https://drive.google.com/uc?export=download&id=1BDQlYbJgn3FRh0NSbi9k2pD4VXwGHJDv',
    tServices14: 'https://drive.google.com/uc?export=download&id=1bn7DvBlca8kFHWPtzmFEx3odP_bk7Myy'
};

// Obtén todos los elementos a dentro del div con la clase "programacion-hmi"
const aElements = document.querySelectorAll('.programacion-hmi a');

// Itera sobre cada elemento a y agrega el enlace de descarga basado en el atributo data-translate
aElements.forEach((element) => {
    const translateKey = element.getAttribute('data-translate');
    const downloadLink = downloadLinks[translateKey];

    if (downloadLink) {
        // Establece el enlace de descarga en el atributo href
        element.setAttribute('href', downloadLink);
        element.setAttribute('download', '');

        // Opcional: Cambiar el cursor a pointer para indicar que es un enlace
        element.style.cursor = 'pointer';
    }
});

function buscarProyecto() {
    const projectNumber = document.getElementById("project-number").value;
    const resultDiv = document.getElementById("result");

    // Verifica si el número de proyecto tiene exactamente 10 dígitos
    if (projectNumber.length === 10) {
        // Si el número de proyecto tiene 10 dígitos, muestra un enlace de 
        if(currentLanguage == "es"){
            resultDiv.innerHTML = `<p>Documentación de proyecto "<Strong>${projectNumber}</Strong>" en proceso de subida. Por favor, vuelva más tarde.</p>`;
        }
        if(currentLanguage == "en"){
            resultDiv.innerHTML = `<p>Project documentation "<strong>${projectNumber}</strong>" is currently being uploaded. Please check back later.</p>`;
        }
        
        //resultDiv.innerHTML = `<p>Resultados para el proyecto: ${projectNumber}</p>
                               //<a href="descarga-${projectNumber}.pdf" download>Descargar información</a>`;
    } else {
        // Si no tiene 10 dígitos, muestra un mensaje de error
        if(currentLanguage == "es"){
            resultDiv.innerHTML = `<p>No se encontró información para el número de proyecto: <Strong>${projectNumber}</Strong></p>`;
        }
        if(currentLanguage == "en"){
            resultDiv.innerHTML = `<p>No information found for project number: <strong>${projectNumber}</strong></p>`;
        }
        
    }

    return false;  // Evita que la página se recargue
}
