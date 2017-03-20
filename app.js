require('./api/data/db');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var routes = require('./api/routes');

app.set('port', (process.env.PORT || 1337));

app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use('/api', routes);

var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    console.log('Server start on port:', port);
});