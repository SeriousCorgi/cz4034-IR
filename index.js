const restify = require('restify');
const fs = require('fs');
const config = require('./config');


let server = restify.createServer({ name: config.NAME })


// Get list of controllers
let controllers = {};
let controllers_path = process.cwd() + '/app/controller';
fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') != -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
    }
});


// Middleware
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ mapParams: true, overrideParams: false }));
server.use(
    function crossOrigin(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
    }
);


// Backend API endpoints
server.get("/health", function (req, res, next) {
    res.json(200, "beep boop");
    next()
});

server.get("/all", controllers.search.getAll);
server.get("/search", controllers.search.search);

server.post("/add", controllers.data.addTweet);
server.post("/delete", controllers.data.deleteData);
server.post("/update", controllers.data.updateFav);


// Static content
server.get("/*", restify.plugins.serveStatic({
    directory: process.cwd() + "/view",
    default: 'index.html'
}));


// Gets the server up and listening
server.listen(config.PORT, () => {
    console.log("%s listening at %s", server.name, server.url);
})