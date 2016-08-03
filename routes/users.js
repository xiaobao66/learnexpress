var express = require('express');
var users = express.Router();

users.use(function (req, res, next) {
    req.requestTime = Date.now();
    next();
});

users.get('/:id', function (req, res, next) {
    if (req.params.id != 0) {
        next('route');
    } else {
        next();
    }
}, function (req, res) {
    res.send('special log in at ' + req.requestTime);
});

users.get('/:id', function (req, res) {
    res.send('normal log in at ' + req.requestTime);
});

users.get('/', function (req, res) {
    res.send('welcome to log');
});

module.exports = users;