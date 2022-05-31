//Required node modules
const https = require('https');

const mimeUrl = 'https://gist.githubusercontent.com/AshHeskes/6038140/raw/27c8b1e28ce4c3aff0c0d8d3d7dbcb099a22c889/file-extension-to-mime-types.json';
//const mimeUrl = require('./MimeType.json');
console.log(mimeUrl);

const getMimeType = (file_ext) => {
    return new Promise((resolve, reject) => {

        https.get(mimeUrl, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(`Error: Failed to load mime type of JSON file ${response.statusCode}`);
                return false;
            }

            // You will recieve data by chunks
            let data = '';
            response.on('data', (chunks) => {
                data += chunks;
            });

            // Once you recieve all chunks of data
            response.on('end', () => {
                resolve(JSON.parse(data)[file_ext]);
            });

        }).on('error', (e) => {
            console.error(e);
        });
    });
}

module.exports = getMimeType;