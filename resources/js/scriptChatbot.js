import * as marked from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

localStorage.clear();
var typewriter;
var htmlContent;
let originalHeight;
let originalTop;
let typebox;
let originalBottom;
let historial = [];
var openailogo;
var prompt_one;
var prompt_two;
var prompt_three;
var prompt_four;
var contenidoFormateado;
let pone_cliked = false;
let ptwo_cliked = false;
let pthree_cliked = false;
let pfour_cliked = false;
let prompts;


// Función para cargar y asignar los valores de los prompts
async function cargarPrompts() {
  // Obtener los datos del archivo JSON usando fetch
  const response = await fetch('./resources/json/prompts.json');
  prompts = await response.json();
  console.log('Longitud de prompts:', prompts.length);
  // Asignar los valores de los prompts según lo requerido
  prompt_one.textContent = prompts.prompt1;
  const offset = 2;
  const promptNo = Object.keys(prompts).length
  // Obtener un número aleatorio entre 2 y 9 (ambos inclusive) para prompts 2, 3 y 4
  const randomPrompt2 = Math.floor(Math.random() * (promptNo - 1)) + offset; // Random entre 2 y 9
  let randomPrompt3, randomPrompt4;
  do {
    randomPrompt3 = Math.floor(Math.random() * (promptNo - 1)) + offset; // Random entre 2 y 9 (sin repetir el prompt 2)
  } while (randomPrompt3 === randomPrompt2);

  do {
    randomPrompt4 = Math.floor(Math.random() * (promptNo - 1)) + offset; // Random entre 2 y 9 (sin repetir prompt 2 y 3)
  } while (randomPrompt4 === randomPrompt2 || randomPrompt4 === randomPrompt3);

  // Asignar los valores de los prompts aleatorios
  console.log("Random Prompt 2:", randomPrompt2);
  console.log("Random Prompt 3:", randomPrompt3);
  console.log("Random Prompt 4:", randomPrompt4);
  prompt_two.textContent = prompts[`prompt${randomPrompt2}`];
  prompt_three.textContent = prompts[`prompt${randomPrompt3}`];
  prompt_four.textContent = prompts[`prompt${randomPrompt4}`];
}


function enviarPregunta() {
    if (window.getComputedStyle(openailogo).visibility === "visible"){
        console.log("Prompt_one:", prompt_one.textContent);
        openailogo.style.visibility = "hidden";
        prompt_one.style.visibility = "hidden";
        prompt_two.style.visibility = "hidden";
        prompt_three.style.visibility = "hidden";
        prompt_four.style.visibility = "hidden";
    }
    htmlContent.scrollTop = htmlContent.scrollHeight;
    verificarContenido()
    const url = 'https://app-backendrl.azurewebsites.net/api/webpage_backend?code=OTnBZhRJJDqdZUtYBbc1SDq1TjFvCoZLDJCKopNLX1EtAzFuQuim2A%3D%3D';
    var preguntaElemento = document.getElementById('pregunta');
    const respuestaElemento = document.getElementById('respuesta');
    
    if (pone_cliked === true){
        console.log("Prompt_one:", prompt_one.value);
        preguntaElemento.value = prompt_one.textContent;
        pone_cliked = false;
    }
    if (ptwo_cliked === true){
        preguntaElemento.value = prompt_two.textContent;
        ptwo_cliked = false;
    }
    if (pthree_cliked === true){
        preguntaElemento.value = prompt_three.textContent;
        pthree_cliked = false;
    }
    if (pfour_cliked === true){
        preguntaElemento.value = prompt_four.textContent;
        pfour_cliked = false;
    }

    const query = preguntaElemento.value.trim();

    if (!query) {
        alert("Por favor, escribe una pregunta.");
        return;
    }
    if (query.length > 2000) {
        alert("La pregunta es demasiado larga. Por favor, escribe una pregunta más corta.");
        textarea.value = '';
        return; // Detiene la ejecución de la función si la pregunta es demasiado larga
    }
    isDragging = false;
    isTouching = false;
    //Pasa la pregunta a la ventana de arriba
    contenidoFormateado = "<strong>Tú: </strong>" + marked.parse(preguntaElemento.value.replace(/\n/g, "<br>")) + "<br>";
    //contenidoFormateado = contenidoFormateado.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g,"'");
    pasteText(contenidoFormateado);
    document.getElementById("pregunta").value = "";
    verificarContenido();
    htmlContent.scrollTop = htmlContent.scrollHeight;

    historial = JSON.parse(localStorage.getItem('historial')) || [];
    historial.push({ "role": "user", "content": query });


    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(historial),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let text = data.response;
        historial.push({ role: "system", content: text });
        localStorage.setItem('historial', JSON.stringify(historial));
        historial = JSON.parse(localStorage.getItem('historial')) || [];

        contenidoFormateado = "<strong>FactoryAI: </strong>" + marked.parse(text) + "<br>";
        console.log("Contenido Formateado antes del reemplazo:", contenidoFormateado);
        chatAnswering = true;
        contenidoFormateado = contenidoFormateado.replace(/(<a href="mailto:.*?">)([^<]+)(<\/a>)/g, '$1<span style="color: greenyellow;">$2</span>$3');
        console.log("Contenido Formateado después del reemplazo:", contenidoFormateado);
        var langDetected = "";
        contenidoFormateado = contenidoFormateado.replace(
            /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
            function (match, claseLenguaje, codigo) {
                langDetected = claseLenguaje;
                
              return (
                `<div class="code-wrapper" data-language="${claseLenguaje}">` +
                `<div class="header"><p class="language-name">${claseLenguaje}</p>` +
                `<button id="copy-code">Copy Code</button></div>` +
                match +
                "</div>"
              );
            }
        );
        // Suponiendo que has realizado todos los reemplazos necesarios en contenidoFormateado
        var lenguajesComunes = ['javascript', 'python', 'java', 'html', 'css', 'php', 'c', 'c++', 'ruby', 'swift', 'typescript', 'shell', 'go', 'rust', 'objective-c', 'kotlin', 'scala', 'arduino', 'sql', 'markdown', 'cpp'];
        var options = { language: langDetected };
        console.log('Lenguaje detectado:', options);
        // Definir la expresión regular para buscar y reemplazar el contenido dentro de las etiquetas <code></code>
        var regex = /<code.*?>([\s\S]*?)<\/code>/g;
        // Aplicar el resaltado de sintaxis solo a los bloques de código dentro de <code></code>
        contenidoFormateado = contenidoFormateado.replace(regex, function(match, code) {
            code = code.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g,"'");
            console.log("Código:", code);
            if (lenguajesComunes.includes(langDetected.toLowerCase())) {
                var highlightedCode = hljs.highlight(code, options).value;
                // Devolver el código resaltado dentro de las etiquetas <code></code>
                return '<code class="hljs">' + highlightedCode + '</code>';
            } else {
                // Si el lenguaje no está en la lista de los más comunes, devolver el código sin resaltar
                return '<code>' + code + '</code>';
            }
        });
        typeText(contenidoFormateado);
        chatAnswering = false;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('htmlContent').innerHTML = "Hubo un error al obtener la respuesta.";
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('boton').addEventListener('click', enviarPregunta);
    typebox = document.getElementById("type");
    //originalBottom = typebox.style.bottom;
    openailogo = document.getElementById('openai');
    prompt_one = document.getElementById('pone');
    prompt_two = document.getElementById('ptwo');
    prompt_three = document.getElementById('pthree');
    prompt_four = document.getElementById('pfour');
    //autosize(textarea);

    cargarPrompts();
    var aboutButton = document.getElementById('About');
    var infoBox = document.getElementById('infoBox');

    // Mostrar o ocultar la ventana al hacer clic en el botón 'About'
    aboutButton.addEventListener('click', function(event) {
        infoBox.style.display = infoBox.style.display === 'none' ? 'block' : 'none'; // Alternar la visibilidad del infoBox
        event.stopPropagation(); // Evitar que el clic se propague al documento
    });

    // Ocultar la ventana al hacer clic fuera de ella
    document.addEventListener('click', function(event) {
        if (!infoBox.contains(event.target) && event.target !== aboutButton) {
            infoBox.style.display = 'none'; // Ocultar la ventana si el clic no fue dentro de infoBox ni en el botón 'About'
        }
    });


    textarea.style.height = (parseInt(originalHeight) - 100) + "px";
    textarea.style.top = (parseInt(originalTop) - 40) + "px";
    textarea.style.color = 'whitesmoke';
});

function decodeEntities(encodedString) {
    var txtarea = document.createElement('txtarea');
    txtarea.innerHTML = encodedString;
    return txtarea.value;
}

function copiarCodigo() {
    // Encuentra el elemento 'pre' relacionado con el botón
    console.log("Funcion de Copiar Codigo")
    var code = document.querySelector('.code-wrapper pre').textContent;

    // Crea un elemento textarea temporal y copia el texto
    var tempTextArea = document.createElement('textarea');
    tempTextArea.value = code;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
}

var textarea = document.getElementById("pregunta");
originalHeight = textarea.clientHeight;
originalTop = textarea.clientTop;
originalBottom = textarea.clientHeight - textarea.clientTop;
console.log("Original Height:", originalHeight, "Original Top:", originalTop, "Original Bottom:", originalBottom);
textarea.style.color = '#808080';
var imagen = document.getElementById("boton");


// Función para verificar el contenido del textarea y cambiar la imagen
function verificarContenido() {
    var texto = textarea.value.trim(); // Obtener el contenido del textarea y eliminar espacios en blanco al inicio y al final
    console.log("Mensaje Principal", texto);
    if (texto.length > 0 && texto !== "Mensaje") {
        imagen.src = "./resources/images/chatbot/SendArrow.png";
    } else {
        imagen.src = "./resources/images/chatbot/SendArrowGray.png";
    }
}
verificarContenido();

// Agregar el evento input al textarea para llamar a la función verificarContenido() cuando el usuario ingrese texto
//textarea.addEventListener("input", verificarContenido);

textarea.addEventListener('focus', function() {
    // Borrar el texto inicial cuando se activa el foco
    if (textarea.value === "Mensaje"){
        textarea.value = '';
    }
    console.log("Original Height2:", originalHeight);
    console.log("TextArea:", textarea.style.height);
    textarea.style.height = (parseInt(originalHeight) - 100) + "px";
    textarea.style.top = (parseInt(originalTop) - 40) + "px";
    textarea.style.color = 'whitesmoke';
});

textarea.addEventListener('blur', function() {
    // Borrar el texto inicial cuando se activa el foco
    console.log("Original Height2:", originalHeight);
    console.log("TextArea:", textarea.style.height);
    textarea.style.height = (parseInt(originalHeight) - 100) + "px";
    textarea.style.top = (parseInt(originalTop) - 15) + "px";
    window.scrollTo(0, 0);
});

document.getElementById('pregunta').addEventListener('input', function() {
    verificarContenido();
    // Restablecer la altura a automático
    if (this.scrollHeight > this.clientHeight) { 
        this.style.height = 'auto'; // Restablecer la altura a 'auto' para calcular la altura real
        var newHeight = this.scrollHeight > 30 ? 30 : this.scrollHeight; // Limitar la altura a 180px si es mayor
        this.style.height = newHeight + 'px'; // Establecer la nueva altura

        // Calcular la diferencia de altura y ajustar la posición superior
        console.log("Before Top", this.style.top);
        var heightDifference = newHeight - this.clientHeight;
        this.style.top = '-' + parseInt((heightDifference) - 100) + 'px'; // Ajustar la posición superior

        console.log("New Height:", newHeight, "Height Difference:", heightDifference);
        console.log("New Top:", this.style.top);
    }
});

if (!typewriter){
        console.log("Typewriter created!");
        htmlContent = document.getElementById('htmlContent');
        typewriter = new Typewriter(htmlContent, {
        loop: false,
        delay: 15,
        autoStart: false, // No iniciar automáticamente
        cursor: "_",
        stringSplitter: (string) => string.split("") // Velocidad en milisegundos por caracter (aproximadamente 60 caracteres por segundo)
    });
}

function typeText(newText) {
    if (newText) {
        
        console.log("Typestring:", newText);
        if (!typewriter) {
            console.log("Stopped");
        }
        let duration = newText.length * 15; // 15 es el delay en milisegundos

        // Iniciar la vibración en intervalos de 50 ms durante la duración del texto
        
        let intervalId = setInterval(() => {
            navigator.vibrate(50);
        }, 50);

        // Detener la vibración cuando el texto termine de escribirse
        setTimeout(() => {
            clearInterval(intervalId);
        }, duration);
        typewriter.typeString(newText).start();
        htmlContent.scrollTop = htmlContent.scrollHeight;
        setTimeout(function() {
            // Obtener el botón "Copy Code" después de que Typewriter termine de escribir
            var copyButton = document.getElementById('copy-code');
            if (copyButton !== null) {
              // Si el botón existe, agregar el controlador de eventos
              copyButton.addEventListener('click', function() {
                // Aquí puedes realizar la acción que deseas al hacer clic en "Copy Code"
                console.log('Hiciste clic en Copy Code');
                copiarCodigo();
                // Por ejemplo, copiar el código al portapapeles
              });
            }
          }, 10000);
    }
}

function pasteText(newText) {
    if (newText) {
        console.log("Typestring:", newText);
        if (!typewriter) {
            console.log("Stopped");
        }
        typewriter.pasteString(newText).start();
        htmlContent.scrollTop = htmlContent.scrollHeight;
    }
}

var isTouching = false; // Variable para indicar si se está tocando la pantalla
var isDragging = false;
var chatAnswering = false;
document.addEventListener('touchstart', function() {
    isTouching = true; // Cuando se detecta un toque, cambiar el valor de isTouching a true
});

document.addEventListener('wheel', function(event) {
    // Verificar si el evento incluye dos dedos (deltaY con valor diferente de 0)
    if (event.deltaY && event.deltaY !== 0) {
        // Código a ejecutar cuando se detecta el arrastre con dos dedos en el touchpad
        isDragging = true;
    }
});

// Función que se ejecutará cada 500 milisegundos si no se está tocando la pantalla
var intervalID = setInterval(function() {
    if (!isTouching && !isDragging) { // Verificar si no se está tocando la pantalla
        htmlContent = document.getElementById('htmlContent');
        htmlContent.scrollTop = htmlContent.scrollHeight;
    }
}, 250);


document.getElementById('pone').addEventListener('click', () => {
    console.log('Se hizo clic en el primer prompt');
    pone_cliked = true; 
    enviarPregunta()
});

document.getElementById('ptwo').addEventListener('click', () => {
    ptwo_cliked = true; 
    enviarPregunta()
});

document.getElementById('pthree').addEventListener('click', () => {
    pthree_cliked = true; 
    enviarPregunta()
});

document.getElementById('pfour').addEventListener('click', () => {
    pfour_cliked = true; 
    enviarPregunta()
});

// Esperar a recibir el texto procesado del segundo script
document.addEventListener('highlightDone', (event) => {
    contenidoFormateado = event.detail.highlighted;

    contenidoFormateado = contenidoFormateado.replace(/(<a href="mailto:.*?">)([^<]+)(<\/a>)/g, '$1<span style="color: greenyellow;">$2</span>$3');
    console.log("Contenido Formateado después del reemplazo:", contenidoFormateado);

    typeText(contenidoFormateado);
    chatAnswering = false;
});

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
console.log("Is Mobile:", isMobile);

document.addEventListener('keydown', function(event) {
    if (event.key === "Enter" && !event.shiftKey && !isMobile) {
      // Aquí colocas el código que quieres ejecutar cuando se presione Enter sin Shift
      console.log('Enter presionado sin Shift');
      enviarPregunta()
    }
});

function unescapeHTML(str) {
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || div.innerText || "";
}