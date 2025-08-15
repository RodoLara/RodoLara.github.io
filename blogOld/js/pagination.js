document.addEventListener('DOMContentLoaded', (event) => {
    const postsPerPage = 5;
    let currentPage = getQueryParam('page') ? parseInt(getQueryParam('page')) : 1;
    const posts = document.querySelectorAll('#post-list .post');
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const pagination = document.getElementById('pagination');
    const pageNumbers = document.getElementById('page-numbers');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const languageSwitch = document.getElementById('language-switch');

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

        pageNumbers.textContent = `${page} / ${totalPages}`;
        prevPageButton.disabled = page === 1;
        nextPageButton.disabled = page === totalPages;

        updateLanguageSwitchHref(page);
    }

    function updateLanguageSwitchHref(page) {
        let href = languageSwitch.getAttribute('href');
        if (href.includes('?')) {
            href = href.split('?')[0];
        }
        languageSwitch.setAttribute('href', `${href}?page=${page}`);
    }

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            updateURL(currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            updateURL(currentPage);
        }
    });

    function updateURL(page) {
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        window.history.pushState({}, '', url);
    }

    function getQueryParam(param) {
        let params = new URLSearchParams(window.location.search);
        return params.get(param);
    }

    showPage(currentPage);
});
