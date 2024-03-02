function lazyLoadImagesAndParallax() {
    var scrollTop = window.scrollY;
    var windowHeight = window.innerHeight;
    var parallaxLayers = document.querySelectorAll('.parallax-layer');

    parallaxLayers.forEach(function(layer) {
        var layerTop = layer.offsetTop;
        var layerHeight = layer.offsetHeight;

        // Verificar si la capa está dentro de la ventana de visualización
        //if (layerTop < scrollTop + windowHeight && layerTop + layerHeight > scrollTop) {
            // Si la capa está dentro de la ventana de visualización, cargar la imagen
            var imageUrl = layer.style.backgroundImage.replace('url("', '').replace('")', '');
            if (imageUrl === '' || imageUrl === 'none') {
                var newImageUrl = layer.getAttribute('data-image-url');
                layer.style.backgroundImage = 'url("' + newImageUrl + '")';
            }

            // Calcular la posición de parallax
            var speed = parseFloat(layer.getAttribute('data-parallax-speed')); // Obtener la velocidad de parallax del atributo data
            var yPos = -(scrollTop * speed * 0.5);
            
            // Aplicar transformación CSS para el efecto de parallax
            layer.style.transform = 'translateY(' + yPos + 'px)';
        //}
    });

    // Llamar a la función de nuevo en el próximo cuadro de animación
    requestAnimationFrame(lazyLoadImagesAndParallax);
}

// Llamar a la función por primera vez al cargar la página
window.addEventListener('load', lazyLoadImagesAndParallax);

// Llamar a la función de nuevo en el próximo cuadro de animación
requestAnimationFrame(lazyLoadImagesAndParallax);
