require('../watchfile')
var express = require('express');
var router = express.Router();
//var mockjs = require('mockjs');

router.all('/*', function(req, res, next) {
    var text, request = global.request;
    var filename = 'settings/request.json';

    if(global.res){
        res.status(global.res.status);
        res.end(global.res.text);
        return false;
    }

    res.setHeader('Content-Type', 'text/json');
    
    var url = req.url,
        method = req.method.toUpperCase();
    if(request[url] && request[url][method]) {
        res.status(200);
        res.end(JSON.stringify(request[url][method]));
    } else {
        res.status(404);
        if(!request[url]) {
            res.end(JSON.stringify({
                error: 'router ' + req.url + ' not found'
            }))
        } else if(!request[url][method]) {
            res.end(JSON.stringify({
                error: method + ' method does not exist in router ' + req.url
            }));
        } else {
            res.end(JSON.stringify({
                error: 'unknown error'
            }))
        }
    }
});

module.exports = router;