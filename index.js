const restify = require('restify');
const fs = require('fs');
const config = require('./config');

var server = restify.createServer({ name: config.NAME })

// Get list of controllers
var controllers = {};
var controllers_path = process.cwd() + '/app/controllers';
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
server.get("/ping", function(req, res, next) {
	res.json({ code: "OK", message: "Hello world!" });
	next();
});

server.listen(config.PORT, () => {
    console.log('%s now listening on %s', server.name, config.URL);
})