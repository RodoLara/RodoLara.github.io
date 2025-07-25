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
                

                if (text === "Project Number" || text === "Número de Proyecto") {
                    // Asignar el texto en negritas
                    element.innerHTML = `<strong>${text}</strong>`;
                } else {
                    // Asignar el texto normalmente
                    element.textContent = text;
                }
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
    tServices11: 'https://drive.google.com/uc?export=download&id=1W6-it09XuEPraNBb3UkvUykE-nzfoE-X',
    tServices12: 'https://drive.google.com/uc?export=download&id=1VZiuwxz6S-OmeIUqZE1oVu8zZKTfdpzH',
    tServices13: 'https://drive.google.com/uc?export=download&id=1S0vJthoBGhmdkI0mHCXVLINRI0BI253B',
    tServices14: 'https://drive.google.com/uc?export=download&id=1P7LGzUlSdQ1JuF3wLFFI0A_pbhMtutIE'
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

    function enviarCodigo(codigo) {
        const url = 'https://backendrl-db-a5hygcb4fpfdf8as.southcentralus-01.azurewebsites.net/api/webpage_backend';
        //const url = 'https://app-backendrl.azurewebsites.net/api/webpage_backend?code=OTnBZhRJJDqdZUtYBbc1SDq1TjFvCoZLDJCKopNLX1EtAzFuQuim2A%3D%3D';
        let data = "Download" + currentLanguage + ":" + codigo; // El código que se enviará en el cuerpo
        message = [];
        message.push({ "role": "user", "content": data });
        console.log("Codigo:", message);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { // Captura el cuerpo de la respuesta
                    throw new Error(`Error en la red: ${response.status} - ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta recibida:', data);
            if (data.response === "No se encontró proyecto" || data.response === "Project not found"){
                if(currentLanguage == "es"){
                    resultDiv.innerHTML = `<p>No se encontró información para el número de proyecto: <Strong>${projectNumber}</Strong></p>`;
                }
                if(currentLanguage == "en"){
                    resultDiv.innerHTML = `<p>No information found for project number: <strong>${projectNumber}</strong></p>`;
                }
            }
            else{
                let partes = data.response.split(',');
                // Crear el texto y el enlace
                let texto = partes[0]; // Lo que está antes de la coma
                let enlace = partes[1]; // Lo que está después de la coma
                
                if(currentLanguage == "es"){
                    resultDiv.innerHTML = `<p>Documentación de proyecto "<Strong>${codigo}</Strong>" para descargar. Favor de hacer click y la descarga iniciará automáticamente:</p><br><a href="${enlace}" target="_blank" class="enlace-blanco">${texto}</a>`;
                }
                if(currentLanguage == "en"){
                    resultDiv.innerHTML = `<p>Project documentation for "<strong>${codigo}</strong>" to download. Please click, and the download will start automatically:</p><br><a href="${enlace}" target="_blank" class="enlace-blanco">${texto}</a>`;
                }
            }
            
        })
        .catch(error => {
            console.error('Error al enviar el código:', error);
        });
    }
    
    // Ejemplo de uso:
    const codigoProyecto = '1234567890';  // Código de 10 caracteres
    enviarCodigo(projectNumber);    
    

    // Verifica si el número de proyecto tiene exactamente 10 dígitos
    if (projectNumber.length === 10) {
        // Si el número de proyecto tiene 10 dígitos, muestra un enlace de 
        
        
        //resultDiv.innerHTML = `<p>Resultados para el proyecto: ${projectNumber}</p>
                               //<a href="descarga-${projectNumber}.pdf" download>Descargar información</a>`;
    } else {
        
    }

    return false;  // Evita que la página se recargue
}

