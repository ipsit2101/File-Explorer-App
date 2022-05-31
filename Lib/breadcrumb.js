const path = require('path');

const buildBreadCrumb = (pathname) => {

    const pathChunks = pathname.split('/').filter((ele) => ele !== '');

    let link = '/';
    let breadcrumb = '<li class="breadcrumb-item active" aria-current="page"><a href="/">Home</a></li>';
    pathChunks.forEach(element => {
        link = path.join(link, element);

        // appending items with link in the breadcrumb
        if (pathChunks.indexOf(element) !== pathChunks.length -1) {
            breadcrumb += `<li class="breadcrumb-item active" aria-current="page"><a href="${link}">${element}</a></li>`;
        }
        else breadcrumb += `<li class="breadcrumb-item active" aria-current="page">${element}</li>`;
    });

    return breadcrumb;
}

module.exports = buildBreadCrumb;