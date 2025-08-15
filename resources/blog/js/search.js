document.addEventListener('DOMContentLoaded', async (event) => {
    const postsPerPage = 5;
    let currentPage = getQueryParam('page') ? parseInt(getQueryParam('page')) : 1;
    const posts = document.querySelectorAll('#post-list .post');
    console.log(`Found ${posts.length} posts`);
    posts.forEach(post => {
        console.log(post.outerHTML);
    });

    const totalPages = Math.ceil(posts.length / postsPerPage);

    const pagination = document.getElementById('pagination');
    const pageNumbers = document.getElementById('page-numbers');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const languageSwitch = document.getElementById('language-switch');

    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    const archiveToggle = document.getElementById('archive-toggle');
    const categoriesToggle = document.getElementById('categories-toggle');
    const archiveSection = document.getElementById('archive');
    const categoriesSection = document.getElementById('categories');

    let activeHashtag = getQueryParam('hashtag');
    let searchQuery = getQueryParam('query');

    if (archiveToggle && categoriesToggle && archiveSection && categoriesSection) {
        archiveToggle.addEventListener('click', () => {
            archiveSection.classList.toggle('active');
            categoriesSection.classList.remove('active');
        });

        categoriesToggle.addEventListener('click', () => {
            categoriesSection.classList.toggle('active');
            archiveSection.classList.remove('active');
        });
    }

    document.querySelectorAll('.category-link').forEach(categoryElement => {
        categoryElement.addEventListener('click', function(event) {
            event.preventDefault();
            const category = this.getAttribute('data-category').toLowerCase();
            console.log(`Category clicked: ${category}`);
            filterByCategory(category);
        });
    });

    function filterByCategory(category) {
        let found = false;
        console.log(`Filtering by category: ${category}`);
        posts.forEach(post => {
            const postCategories = post.getAttribute('data-categories');
            console.log(`Post categories: ${postCategories}`);
            if (postCategories) {
                const categoriesArray = postCategories.toLowerCase().split(',').map(item => item.trim());
                console.log(`Categories array: ${categoriesArray}`);
                if (categoriesArray.includes(category)) {
                    post.style.display = 'block';
                    found = true;
                } else {
                    post.style.display = 'none';
                }
            } else {
                post.style.display = 'none';
            }
        });

        if (!found) {
            document.getElementById('no-results').style.display = 'block';
        } else {
            document.getElementById('no-results').style.display = 'none';
        }

        togglePagination(false);
    }

    if (searchButton && searchBar) {
        searchButton.addEventListener('click', executeSearch);
        searchBar.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                executeSearch();
            }
        });

        if (searchQuery) {
            searchBar.value = searchQuery;
            executeSearch();
        } else if (activeHashtag) {
            filterByHashtag(activeHashtag);
        } else {
            showPage(currentPage);
        }
    }

    function showPage(page) {
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;

        posts.forEach((post, index) => {
            if (index >= start && index < end) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });

        if (pageNumbers) {
            pageNumbers.textContent = `${page} / ${totalPages}`;
        }

        if (prevPageButton) {
            prevPageButton.disabled = page === 1;
        }

        if (nextPageButton) {
            nextPageButton.disabled = page === totalPages;
        }

        togglePagination(true);
        updateLanguageSwitchHref(page);
    }

    function filterByHashtag(hashtag) {
        let found = false;
        posts.forEach(post => {
            let postHashtags = post.getAttribute('data-hashtags') ? post.getAttribute('data-hashtags').toLowerCase().split(',') : [];
            if (postHashtags.includes(hashtag.toLowerCase())) {
                post.style.display = 'block';
                found = true;
            } else {
                post.style.display = 'none';
            }
        });

        if (pagination) {
            pagination.style.display = found ? 'block' : 'none';
        }

        if (document.getElementById('no-results')) {
            document.getElementById('no-results').style.display = found ? 'none' : 'block';
        }

        togglePagination(false);
    }

    function togglePagination(show) {
        if (pagination) {
            pagination.style.display = show ? 'block' : 'none';
        }
    }

    function updateLanguageSwitchHref(page) {
        if (!languageSwitch) return;

        let href = languageSwitch.getAttribute('href');
        let params = new URLSearchParams();
        if (activeHashtag) {
            params.set('hashtag', activeHashtag);
        } else {
            params.set('page', page);
        }
        languageSwitch.setAttribute('href', `${href.split('?')[0]}?${params.toString()}`);
    }

    if (prevPageButton) {
        prevPageButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
                updateURL(currentPage);
            }
        });
    }

    if (nextPageButton) {
        nextPageButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
                updateURL(currentPage);
            }
        });
    }

    function updateURL(page) {
        const url = new URL(window.location);
        if (activeHashtag) {
            url.searchParams.set('hashtag', activeHashtag);
        } else {
            url.searchParams.set('page', page);
        }
        window.history.pushState({}, '', url);
    }

    function getQueryParam(param) {
        let params = new URLSearchParams(window.location.search);
        return params.get(param);
    }

    document.querySelectorAll('.hashtag').forEach(hashtagElement => {
        hashtagElement.addEventListener('click', function(event) {
            event.preventDefault();
            activeHashtag = this.innerText.toLowerCase().substring(1);
            let currentLang = document.documentElement.lang; // Obtiene el idioma actual de la página
            let indexPath = currentLang === 'en' ? '/en/blog/index.html' : '/es/blog/index.html';
            const url = new URL(window.location);
            url.pathname = indexPath;
            url.searchParams.set('hashtag', activeHashtag);
            window.location.href = url.toString();
        });
    });

    async function getSynonyms(word) {
        try {
            const lang = document.documentElement.lang; // Obtener el idioma del HTML actual
            const vocab = lang === 'en' ? 'en' : 'es'; // Configurar el vocabulario en función del idioma

            console.log(`Fetching synonyms for: ${word} in language: ${vocab}`);
            const response = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&v=${vocab}`);
            console.log(`Response status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Response data:", data);
            return data.map(item => item.word);
        } catch (error) {
            console.error("Error fetching synonyms:", error);
            return [];
        }
    }

    function stemWord(word) {
        // Implementación básica de stemming, puedes usar una librería de stemming si prefieres.
        return word.replace(/(ing|ed|ly|es|s)$/, '');
    }

    function fuzzyMatch(text, query) {
        const words = query.split(' ');
        return words.some(word => text.includes(word));
    }

    async function executeSearch() {
        let query = document.getElementById('search-bar').value.toLowerCase();
        let keywords = query.split(' '); // Divide la consulta de búsqueda en palabras clave
        let expandedQuery = new Set(keywords);

        // Obtener sinónimos y aplicar stemming para cada palabra en la consulta
        for (const word of keywords) {
            const synonyms = await getSynonyms(word);
            synonyms.forEach(synonym => expandedQuery.add(stemWord(synonym)));
            expandedQuery.add(stemWord(word));
        }

        const processedQuery = Array.from(expandedQuery).join(' ');
        let found = false;

        posts.forEach(function(post) {
            let title = post.querySelector('h2').innerText.toLowerCase();
            let summary = post.querySelector('p').innerText.toLowerCase();
            let postHashtags = post.getAttribute('data-hashtags') ? post.getAttribute('data-hashtags').toLowerCase().split(',') : [];
            let isMatch = processedQuery.split(' ').some(keyword => title.includes(keyword) || summary.includes(keyword) || fuzzyMatch(postHashtags.join(' '), keyword));

            if (isMatch) {
                post.style.display = 'block';
                found = true;
            } else {
                post.style.display = 'none';
            }
        });

        if (document.getElementById('no-results')) {
            document.getElementById('no-results').style.display = found ? 'none' : 'block';
        }

        updateURLWithQuery(query);
        togglePagination(false);
    }

    function updateURLWithQuery(query) {
        const url = new URL(window.location);
        url.searchParams.set('query', query);
        window.history.pushState({}, '', url);
    }

    window.addEventListener('popstate', (event) => {
        activeHashtag = getQueryParam('hashtag');
        searchQuery = getQueryParam('query');
        currentPage = getQueryParam('page') ? parseInt(getQueryParam('page')) : 1;
        if (searchQuery) {
            searchBar.value = searchQuery;
            executeSearch();
        } else if (activeHashtag) {
            filterByHashtag(activeHashtag);
        } else {
            showPage(currentPage);
        }
    });

    // Mostrar/Ocultar el menú en móviles
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Manejo de clics en enlaces de archivos
    document.querySelectorAll('.archive-link').forEach(function(archiveLink) {
        archiveLink.addEventListener('click', function(event) {
            event.preventDefault();
            let year = this.getAttribute('data-year');
            let month = this.getAttribute('data-month');
            filterByArchive(year, month);
        });
    });

    function filterByArchive(year, month) {
        let found = false;

        posts.forEach(function(post) {
            let postYear = post.getAttribute('data-year');
            let postMonth = post.getAttribute('data-month');

            if (postYear === year && postMonth === month) {
                post.style.display = 'block';
                found = true;
            } else {
                post.style.display = 'none';
            }
        });

        if (document.getElementById('no-results')) {
            document.getElementById('no-results').style.display = found ? 'none' : 'block';
        }

        togglePagination(false);
    }
});

function addProgressIndicatorGradualColor() {
    // Crear el elemento de la barra de progreso
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.position = 'fixed';
    progressBar.style.top = 0;
    progressBar.style.left = 0;
    progressBar.style.width = '0%'; // La barra comienza vacía
    progressBar.style.height = '4px';
    progressBar.style.zIndex = '9999';
    document.body.appendChild(progressBar);

    // Función para actualizar el ancho y el color de la barra de progreso
    function updateProgressBar() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

        // Calcular el color basado en el porcentaje de desplazamiento
        const hue = (240 * (1 - scrollPercentage / 100)).toFixed(0); // 240 a 0 (Violeta a Rojo)
        progressBar.style.width = scrollPercentage + '%';
        progressBar.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    }

    // Agregar el listener de scroll para actualizar la barra de progreso
    window.addEventListener('scroll', updateProgressBar);
}

// Llamar a la función para agregar el indicador de progreso
addProgressIndicatorGradualColor();

