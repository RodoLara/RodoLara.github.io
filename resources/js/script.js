let currentLanguage = "en";
currentLanguage = sessionStorage.getItem('currentLanguage') || 'en';

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
            });
        })
        .catch(error => console.error('Error fetching or parsing JSON:', error));
}


// Cargar lenguaje
changeLanguage(currentLanguage);

document.addEventListener('DOMContentLoaded', function() {
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
