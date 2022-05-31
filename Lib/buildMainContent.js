// Required node modules
const fs = require('fs');
const path = require('path');
const child = require('child_process');
const { fileURLToPath } = require('url');

//Required file exports
const CalculateSize = require('./CalculateSizeofDirectory.js');

const buildContent = (fullStaticPath, pathname) => {

    console.log(fullStaticPath);
    let mainContent = [];
    // loop through folder elements inside the folder
    let items;
    try {
        items = fs.readdirSync(fullStaticPath);
        console.log(items);
        
    }catch(err) {
        return `<div class="alert alert-danger">Internal Server Error</div>`;
    }
    
    let rowNumber = 1;
    items.forEach(item => {
        //link and items
        const link = path.join(pathname, item);

        // Icons
        const fullPath = path.join(fullStaticPath, item);
        let stats, icon;
        try {
            stats = fs.lstatSync(fullPath);
        }catch(err) {
            return `<div class="alert alert-danger">Internal Server Error</div>`;
        }

        if (stats.isDirectory()) {
            icon = `<ion-icon name="folder-sharp"></ion-icon>`;
        }
        else if (stats.isFile()) {
            icon = `<ion-icon name="document"></ion-icon>`;
        }

        //Calculating sizes of files/folders
        let FileSize = 0;
        try {
            FileSize = CalculateSize(fullPath);
        } catch(err) {
            console.log(err);
        }

        // show the last modified time of files/folders 
        let timeStamp = stats.mtimeMs; // This is equivalent to Unix timestamp(last modified);
        let date = new Date(timeStamp); // Converting timestamp into a Date
        date = date.toLocaleString();

        if (items !== 'Project Files') {
            mainContent.push(`<tr>
                <td> ${rowNumber++} </td>
                <td> ${icon} <a href="${link}" target='${stats.isFile() ? "_blank" : ""}'> ${item} </a></td>
                <td> ${FileSize} </td>
                <td> ${date} </td>
            </tr>`);
        }
    });

    return mainContent;
}

module.exports = buildContent;