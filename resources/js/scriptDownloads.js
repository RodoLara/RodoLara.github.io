function buscarProyecto() {
    const projectNumber = document.getElementById("project-number").value;
    const resultDiv = document.getElementById("result");

    // Verifica si el número de proyecto tiene exactamente 10 dígitos
    if (projectNumber.length === 10) {
        // Si el número de proyecto tiene 10 dígitos, muestra un enlace de descarga
        resultDiv.innerHTML = `<p>Descargas de proyecto "<Strong>${projectNumber}</Strong>" en proceso de subida</p>`;
        //resultDiv.innerHTML = `<p>Resultados para el proyecto: ${projectNumber}</p>
                               //<a href="descarga-${projectNumber}.pdf" download>Descargar información</a>`;
    } else {
        // Si no tiene 10 dígitos, muestra un mensaje de error
        resultDiv.innerHTML = `<p>No se encontró información para el número de proyecto: <Strong>${projectNumber}</Strong></p>`;
    }

    return false;  // Evita que la página se recargue
}
