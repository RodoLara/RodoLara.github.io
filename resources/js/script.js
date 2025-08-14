let currentLanguage; // Variable global accesible desde cualquier otro script

(function () {
  var link = document.querySelector('.mLanguage');
  if (!link) return;

  var path = location.pathname; // ej. /en/services.html
  var isEn = path.startsWith('/en/');
  var isEs = path.startsWith('/es/');

  // Detectar idioma actual
  if (isEn) {
    currentLanguage = "en";
  } else if (isEs) {
    currentLanguage = "es";
  } else {
    currentLanguage = "en"; // fallback si no hay carpeta
  }

  // Ajustar enlace y texto
  var target = isEn ? path.replace(/^\/en\//, '/es/') :
               isEs ? path.replace(/^\/es\//, '/en/') :
               '/en/';

  link.href = target;
  link.textContent = isEn ? 'ESPAÑOL' : 'ENGLISH';
  link.setAttribute('hreflang', isEn ? 'es' : 'en');
})();

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
        const url = 'https://backendrl-db-a5hygcb4fpfdf8as.southcentralus-01.azurewebsites.net/api/webpage_downloads?';
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

