//require url modules
const url = require('url');
// require path modules
const path = require('path');
// require fs modules
const fs = require('fs');

// required file exports
const breadCrumb = require('./breadcrumb.js');
const buildContent = require('./buildMainContent.js');
const getMimeType = require('./GetMimeTypeofFile.js');

// static base path: 
const staticBasePath = path.join(__dirname, '..', 'static');

const respond = (request, response) => {

    // for getting static path on the server, you need to decode the path provided in url
    let pathname = url.parse(request.url, true).pathname;
    
    // if favicon.ico then stops
    if (pathname === '/favicon.ico') return; 

    // provide static path to the pathname on server
    pathname = decodeURIComponent(pathname);
    const fullStaticPath = path.join(staticBasePath, pathname);

    //Can we find something in the fullStaticPath ?
    // if "NO" then we'll return 404 error page;
    if (!fs.existsSync(fullStaticPath)) {
        response.write('404 - File not found');
        response.end();
        return false;
    }

    let stat;        
    try {
        stat = fs.lstatSync(fullStaticPath);
        console.log(stat);
    } catch(err) {
        console.log(`lstatSync error: ${err}`);
    }

    //It is Directory
    if (stat.isDirectory()) {
        //get content from the template index.html
        let data = fs.readFileSync(path.join(staticBasePath, 'Project Files/index.html'), 'utf-8');
        response.statusCode = 200;
        
        const pathElements = pathname.split('/').reverse().filter(element => element !== '');

        let folderName;   
        if (pathElements.length == 0) folderName = 'Home';
        else folderName = pathElements[0];
        
        //set page title of current folder
        data = data.replace('page_title', folderName);

        //Build Breadcrumb
        data = data.replace('pathname', breadCrumb(pathname));

        // Build the content of the page with different files and folders       
        data = data.replace('main_content', buildContent(fullStaticPath, pathname));
        response.write(data);
        return response.end();
    }
    // If it is neither a file nor a directory
    // then send error 401 status code
    if (!stat.isFile()) {
        response.statusCode = 401;
        response.write(`<div class="alert alert-danger">
            Error ${response.statusCode}: Access Denied
        </div>`);
        return response.end();
    }

    //It is a file   
    //first, let's get the file extension
    let file_ext = path.extname(pathname);   
    console.log(file_ext);

    //get the file mime type and add it to the response header
    getMimeType(file_ext)
    .then(mime => {
        //store headers here
        let head = {};
        let options = {};

        let statusCode = 200;
        // set "Content-type for all file extension"
        head['Content-Type'] = mime;
        if (file_ext === '.docx') {
            head['Content-Disposition'] = 'inline';
        }
    
        //streaming method to read files
        const fileStream = fs.createReadStream(fullStaticPath, head);
        //Stream chunks to your response objects
        response.writeHead(statusCode, options);
        fileStream.pipe(response);

        //Events
        fileStream.on('close', () => {
            return response.end();
        });
        fileStream.on('error', () => {
            response.statusCode = 404;
            response.write(`${response.statusCode}: File Stream Error`);
            return response.end();
        });
    })  
    .catch(err => {
        response.statusCode = 500;
        response.write(`${response.statusCode} Internal Server Error`);
        console.log(err);
        return response.end();
    });
}

module.exports = respond;