//require node modules
const http = require('http');

//Connection settings
const port = process.env.port || 5000;
const respond = require('./Lib/respond.js');

//Create Server
const server = http.createServer(respond);


//listen to client requestson the specific port and
//the port should be available
server.listen(port, () => {
    console.log(`listening to port ${port}`);
});