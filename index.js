const restify = require('restify');
const fs = require('fs');
const config = require('./config');


var server = restify.createServer({ name: config.NAME })


// Get list of controllers
var controllers = {};
var controllers_path = process.cwd() + '/app/controller';
fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') != -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
    }
});


// Middleware
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ mapParams: true }));


// Backend API endpoints
server.get("/health", function (req, res, next) {
    res.json(200, "beep boop");
    next();
});


// server.get("/search", controllers.search)
server.get("/search", controllers.search.search);
server.get("/data", controllers.data.addData);
server.get("/delete", controllers.data.deleteData);


// Gets the server up and listening
server.listen(config.PORT, () => {
    console.log("%s listening at %s", server.name, server.url);
})