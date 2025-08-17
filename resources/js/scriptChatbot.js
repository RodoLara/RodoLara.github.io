import * as marked from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

sessionStorage.clear();
var typewriter;
var htmlContent;
let originalHeight;
let originalTop;
let newTop;
var heightDifference;
let typebox;
var textarea;
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
  const response = await fetch('/resources/json/prompts.json');
  const data = await response.json();

  // Detectar idioma del documento (soporta es, es-MX, en, etc.)
  const htmlLang = (document.documentElement.lang || 'en').toLowerCase();
  const langKey = htmlLang.startsWith('es') ? 'es' : 'en';

  // Soporte dual: JSON nuevo con {es, en} o JSON plano legacy con prompt1..promptN
  const promptsData = (data && (data.es || data.en)) 
    ? (data[langKey] || data.en || data.es) 
    : data;

  // Helper para obtener el mayor índice disponible (promptN) de forma robusta
  const promptKeys = Object.keys(promptsData).filter(k => k.toLowerCase().startsWith('prompt'));
  const maxIndex = promptKeys.length
    ? Math.max(...promptKeys.map(k => Number(k.replace(/^\D+/,'')).valueOf()))
    : 1;

  // Asignar prompt 1
  prompt_one.textContent = promptsData.prompt1 || '';

  // Config aleatorios (mantiene tu lógica original con offset=2)
  const offset = 2;
  const upperBound = Math.max(offset, maxIndex); // evita rango inválido si hubiera pocos prompts

  function randPrompt() {
    // número entero en [offset, upperBound]
    return Math.floor(Math.random() * (upperBound - offset + 1)) + offset;
  }

  // Selecciones únicas para 2, 3 y 4
  const used = new Set();
  let randomPrompt2 = randPrompt();
  used.add(randomPrompt2);

  let randomPrompt3;
  do { randomPrompt3 = randPrompt(); } while (used.has(randomPrompt3));
  used.add(randomPrompt3);

  let randomPrompt4;
  do { randomPrompt4 = randPrompt(); } while (used.has(randomPrompt4));
  used.add(randomPrompt4);

  // Logs
  console.log('Idioma detectado:', langKey);
  console.log('Prompts disponibles (máx índice):', maxIndex);
  console.log('Random Prompt 2:', randomPrompt2);
  console.log('Random Prompt 3:', randomPrompt3);
  console.log('Random Prompt 4:', randomPrompt4);

  // Asignar textos (fallback a cadena vacía si no existiera el índice)
  prompt_two.textContent = promptsData[`prompt${randomPrompt2}`] || '';
  prompt_three.textContent = promptsData[`prompt${randomPrompt3}`] || '';
  prompt_four.textContent = promptsData[`prompt${randomPrompt4}`] || '';
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
    const url = 'https://backendrl-db-a5hygcb4fpfdf8as.southcentralus-01.azurewebsites.net/api/webpage_backend?';
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
    textarea.style.height = (parseInt(originalHeight) - 0) + "px";
    verificarContenido();
    htmlContent.scrollTop = htmlContent.scrollHeight;

    historial = JSON.parse(sessionStorage.getItem('historial')) || [];
    historial.push({ "role": "user", "content": query });
    console.log("Formato en PLC:", historial);

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
        sessionStorage.setItem('historial', JSON.stringify(historial));
        historial = JSON.parse(sessionStorage.getItem('historial')) || [];

        contenidoFormateado = "<strong>FactoryAI: </strong>" + marked.parse(text) + "<br>";
        console.log("Contenido Formateado antes del reemplazo:", contenidoFormateado);
        chatAnswering = true;
        contenidoFormateado = contenidoFormateado.replace(/(<a href="mailto:.*?">)([^<]+)(<\/a>)/g, '$1<span style="color: greenyellow;">$2</span>$3');
        console.log("Contenido Formateado después del reemplazo:", contenidoFormateado);
        var langDetected = "";
        var counter = 1;
        contenidoFormateado = contenidoFormateado.replace(
            /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
            function (match, claseLenguaje, codigo) {
                langDetected = claseLenguaje;
                var botonId = 'copy-code-' + counter; // Genera un identificador único para cada botón
                counter++;
              return (
                `<div class="code-wrapper" data-language="${claseLenguaje}">` +
                `<div class="header"><p class="language-name">${claseLenguaje}</p>` +
                `<button id="${botonId}" onclick="copiarCodigo(this)">Copy Code</button></div>` + // Asigna el identificador único al botón
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
    //textarea = document.getElementById("pregunta");
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
    aboutButton.addEventListener('click', function (event) {
        const isHidden = window.getComputedStyle(infoBox).display === 'none';
        infoBox.style.display = isHidden ? 'block' : 'none';
        event.stopPropagation();
    });

    // Ocultar la ventana al hacer clic fuera de ella
    document.addEventListener('click', function(event) {
        if (!infoBox.contains(event.target) && event.target !== aboutButton) {
            infoBox.style.display = 'none'; // Ocultar la ventana si el clic no fue dentro de infoBox ni en el botón 'About'
        }
    });


    //textarea.style.height = (parseInt(originalHeight) - 0) + "px";
    //textarea.style.top = 'auto';
    //textarea.style.top = (parseInt(originalTop) - 1000) + "px";
    //textarea.style.color = 'whitesmoke';
    
    document.getElementById('pregunta').addEventListener('keydown', handleBackspace);
});

function decodeEntities(encodedString) {
    var txtarea = document.createElement('txtarea');
    txtarea.innerHTML = encodedString;
    return txtarea.value;
}

function handleBackspace(event) {
    // Verificar si se presionó la tecla Backspace
    if (event.key === 'Backspace') {
        // Aquí colocas el código que quieres ejecutar cuando se presiona Backspace
        //console.log('Se presionó Backspace');
        //newTop = newTop - heightDifference; // Ejemplo de ajuste de posición
    }
}


textarea = document.getElementById("pregunta");
let prevTextareaHeight = textarea.clientHeight;
originalHeight = textarea.clientHeight;
originalTop = textarea.clientTop;
originalBottom = textarea.clientHeight - 40;// - textarea.clientTop;
newTop = originalTop;

var containerHeight = textarea.parentElement.clientHeight;

// Obtener la posición del textarea respecto al borde superior del contenedor
var textareaTop = textarea.offsetTop;

// Calcular el valor de 'bottom' en relación con el contenedor
var bottomValue = containerHeight - (textareaTop + textarea.clientHeight);

//console.log('Bottom:', bottomValue);
//console.log("Original Height:", originalHeight, "Original Top:", originalTop, "Original Bottom:", originalBottom);
textarea.style.color = '#808080';
textarea.style.height = 'auto';
textarea.style.height = (parseInt(originalHeight) - 0) + "px";
//textarea.style.bottom = 'auto';

textarea.style.top = 'auto';
textarea.style.top = (parseInt(originalTop)-8) + "px";
//textarea.style.color = 'whitesmoke';
var imagen = document.getElementById("boton");


// Función para verificar el contenido del textarea y cambiar la imagen
function verificarContenido() {
    var texto = textarea.value.trim(); // Obtener el contenido del textarea y eliminar espacios en blanco al inicio y al final
    //console.log("Mensaje Principal", texto);
    if (texto.length > 0 && texto !== "Mensaje" && texto !== "Message") {
        imagen.src = "/resources/images/chatbot/SendArrow.png";
    } else {
        imagen.src = "/resources/images/chatbot/SendArrowGray.png";
    }
}
verificarContenido();

// Agregar el evento input al textarea para llamar a la función verificarContenido() cuando el usuario ingrese texto
//textarea.addEventListener("input", verificarContenido);

textarea.addEventListener('focus', function() {
    // Borrar el texto inicial cuando se activa el foco
    if (textarea.value === "Mensaje"){
        textarea.value = '';
        textarea.style.height = (parseInt(originalHeight) - 0) + "px";
    }
    //else if (textarea.value === ""){
    //    console.log("Original Height2:", originalHeight);
    //    console.log("TextArea:", textarea.style.height);
    //    textarea.style.height = (parseInt(originalHeight) - 0) + "px";
    //    textarea.style.top = (parseInt(originalTop) - 40) + "px";
    //    textarea.style.color = 'whitesmoke';
    //}
    textarea.style.color = 'whitesmoke';
});

textarea.addEventListener('blur', function() {
    // Borrar el texto inicial cuando se activa el foco
    //console.log("Original Height2:", originalHeight);
    //console.log("TextArea:", textarea.style.height);
    var cursorPosition = textarea.selectionStart;

    // Verificar si el cursor está en la posición 0,0
    if (cursorPosition === 0) {
        textarea.style.height = (parseInt(originalHeight) - 0) + "px";
        textarea.style.top = (parseInt(originalTop)-8) + "px";
        newTop = 0;
    }
    //textarea.style.height = (parseInt(originalHeight) - 0) + "px";
    //textarea.style.bottom = (parseInt(originalBottom)) + "px";
    window.scrollTo(0, 0);
});

document.getElementById('pregunta').addEventListener('input', function() {
    verificarContenido();

    
    // Guardar la altura original
    var originalHeight = this.clientHeight;

    // Establecer la altura a 'auto' para calcular la altura real
   
    var currentHeight = parseInt(this.style.height) || this.clientHeight;
    // Calcular la nueva altura basada en el contenido actual
    var newHeight = Math.min(70, this.scrollHeight); // Limitar la altura a 100px como máximo
    console.log("NewHeight", newHeight, "StyleHeight", currentHeight);
    if (newHeight > currentHeight) {
    //    // Establecer la nueva altura solo si es mayor que la anterior
        this.style.height = newHeight + 'px';
    }
    //this.style.height = 'auto';
    // Calcular la diferencia de altura
    heightDifference = newHeight - originalHeight;
    console.log("OriginalHeight:", originalHeight, "PrevTextHeight", prevTextareaHeight);
    //console.log("NewHeight Method", newHeight, "NewHeightDifference", heightDifference, "originalheight", originalHeight, "originalTop",originalTop);
    // Mover el textarea hacia arriba para mantenerlo en su posición original
    //if (newHeight == 70){
        //if (this.scrollHeight > this.clientHeight) { 
        //    if (newHeight < 100){
        //        if (newTop < -25){
        //            newTop = -25;
        //        } else {
        //            if (newTop >= 0){
        //                newTop = -1;
        //            } else {
        //                document.onkeydown = function(event) {
        //                    event = event || window.event; // Para compatibilidad con navegadores antiguos
        //                    if (event.key === "Enter" && event.shiftKey) {
        //                        console.log("Enter + Shift presionado");
        //                        newTop = newTop - heightDifference + 10;
        //                        this.style.top = newTop + 'px';
        //                        // Aquí colocas el código que deseas ejecutar cuando se presiona Enter y Shift
        //                    } else {
        //                        console.log("Otra tecla presionada");
        //                        // Aquí puedes manejar otras teclas o realizar otras acciones
        //                    }
        //                };
        //                //adjustNewTop();
        //                
        //                console.log("Textarea se hace grande", newTop);
        //            }
        //        }
        //    } else {
        //        newTop = -25;
        //    }
        //} else if (originalHeight < prevTextareaHeight) {
        //    //newTop = newTop - heightDifference - 11;
        //    //console.log('El textarea se está haciendo más pequeño', newTop);
        //}

    //this.style.top = newTop + 'px';
    //console.log("OrigialTop", originalTop, "newTop", this.style.top);
    // Actualizar la altura anterior con la altura actual para futuras comparaciones
    prevTextareaHeight = originalHeight;
    //}
    //else if (newHeight == 85){
    //    this.style.bottom = parseInt(originalBottom + 10) + 'px';
    //}
    //else if (newHeight == 100){
    //    this.style.bottom = parseInt(originalBottom + 25) + 'px';
    //}
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
        mantenerPantallaEncendida();
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
        //setTimeout(function() {
        //  // Obtener el botón "Copy Code" después de que Typewriter termine de escribir
        //  var copyButton = document.getElementById('copy-code');
        //  if (copyButton !== null) {
        //    // Si el botón existe, agregar el controlador de eventos
        //    copyButton.addEventListener('click', function() {
        //      // Aquí puedes realizar la acción que deseas al hacer clic en "Copy Code"
        //      console.log('Hiciste clic en Copy Code');
        //      copiarCodigo();
        //      // Por ejemplo, copiar el código al portapapeles
        //    });
        //  }
        //}, 10000);
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
    quitarBloqueoPantalla();
});

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
console.log("Is Mobile:", isMobile);//

document.addEventListener('keydown', function(event) {
    if (event.key === "Enter" && !event.shiftKey && !isMobile) {
      // Aquí colocas el código que quieres ejecutar cuando se presione Enter sin Shift
      console.log('Enter presionado sin Shift');
      event.preventDefault();
      enviarPregunta()
      textarea.value = '';
      textarea.setSelectionRange(0, 0);
    }
});

function unescapeHTML(str) {
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || div.innerText || "";
}

// Mantener la pantalla encendida
function mantenerPantallaEncendida() {
  if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen')
      .then((wakeLockObj) => {
        console.log('Pantalla mantenida encendida');
      })
      .catch((err) => {
        console.error('No se pudo mantener la pantalla encendida:', err);
      });
  } else {
    console.warn('La API de bloqueo de pantalla no está disponible en este navegador.');
  }
}
  
// Quitar el bloqueo de pantalla
function quitarBloqueoPantalla() {
  if ('wakeLock' in navigator && navigator.wakeLock.wakeLockObj) {
    navigator.wakeLock.wakeLockObj.release()
      .then(() => {
        console.log('Bloqueo de pantalla quitado');
      })
      .catch((err) => {
        console.error('No se pudo quitar el bloqueo de pantalla:', err);
      });
  } else {
    console.warn('No se encontró un bloqueo de pantalla activo.');
  }
}


// Define una función para manejar el ajuste de newTop
function adjustNewTop() {
    //console.log("Nuevos Tops");
    //document.addEventListener('keydown', function(event) {
    //    if (event.key === "Enter" && event.shiftKey) {
    //        console.log("NEW NEW NEW");
    //        //newTop = newTop - heightDifference + 10;
    //    } else if (event.key === 'Backspace') {
    //        // Aquí colocas el código que quieres ejecutar cuando se presiona Backspace
    //        //newTop = newTop + heightDifference;
    //        //console.log("BackspaceTop", newTop);
    //    }
    //});
}

let prevWidth = window.innerWidth;
let prevHeight = window.innerHeight;

window.addEventListener('resize', function() {
    if (window.innerWidth < prevWidth || window.innerHeight < prevHeight) {
        console.log('La ventana se está haciendo más pequeña');
    }

    // Actualizar los valores previos con los nuevos valores
    prevWidth = window.innerWidth;
    prevHeight = window.innerHeight;
});