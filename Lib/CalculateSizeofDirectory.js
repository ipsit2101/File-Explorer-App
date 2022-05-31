// Required node modules
const fs = require("fs");
const path = require("path");

// returns an array of files present in directory of a folder recursively;
const getAllFiles = (fullPath, arrayOfFiles) => {
  
    // if fullPath of a file is provided
    if (fs.statSync(fullPath).isFile()) {
        arrayOfFiles.push(fullPath);
        return arrayOfFiles;
    }  

  // for folders
  files = fs.readdirSync(fullPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(fullPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath + "/" + file, arrayOfFiles);
    } 
    else arrayOfFiles.push(path.join(fullPath, file));
  });

  return arrayOfFiles;
}

//converting size into human readable format
const convertBytes = (bytes) => {

    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "N/A";

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) {
      return bytes + " " + sizes[i];
    }   
    return (bytes/Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
  }

  const CalculateFileSize = (directoryPath) => {
    let arrayOfFiles = [];
    getAllFiles(directoryPath, arrayOfFiles);
    
    let totalSize = 0;
    arrayOfFiles.forEach(filePath => {
      totalSize += fs.statSync(filePath).size;
    });
  
    return convertBytes(totalSize);
  }

  // module exports
  module.exports = CalculateFileSize;