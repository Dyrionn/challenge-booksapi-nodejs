var express = require('express');
var router = express.Router();
const requestPromise = require('request-promise');
var booksservice = require('../services/booksservice')


router.post('/book', function(req, res, next) {
    booksservice.Add(req.body, function(callback){
        var response = "";
    
        try {
            res.statusCode = callback.statusCode;
            response = callback.body[Object.keys(callback.body).length -1];
            console.log(response + " statuscode: " + res.statusCode);
        } catch (error) {
            res.statusCode = 500;
            response = new Error('[{"Message": "Failure during ' + callback.body.method + ' request => ' + callback.body.uri + '},{"Error: ' + error.toString() + '}]');
        }
    
        res.send(response);
        res.end();
    });
});

router.get('/books/all', function(req, res, next) {
    booksservice.getAll(function(callback){
        var response = "";
    
        try {
            res.statusCode = callback.statusCode;
            response = callback.body;
            console.log(response + " statuscode: " + res.statusCode);
        } catch (error) {
            res.statusCode = 500;
            response = new Error('[{"Message": "Failure during ' + callback.body.method + ' request => ' + callback.body.uri + '},{"Error: ' + error.toString() + '}]');
        }
    
        res.send(response);
        res.end();
    });
})

router.get('/books/:id', function(req, res, next) {
    booksservice.getById(req.params.id, function(callback){
        var response = "";
    
        try {
            res.statusCode = callback.statusCode;
            response = callback.body;
            console.log(response + " statuscode: " + res.statusCode);
        } catch (error) {
            res.statusCode = 500;
            response = new Error('[{"Message": "Failure during ' + callback.body.method + ' request => ' + callback.body.uri + '},{"Error: ' + error.toString() + '}]');
        }
    
        res.send(response);
        res.end();
    });
});

router.get('/books', function(req, res, next) {

    booksservice.getFromExternalSource(function(callback){

        if (callback == null | callback == undefined) {
            res.statusCode = 500;
            res.send(new Error('[{"Message": "Failure during external source request"}]'));
            res.end();
        }
        
        res.send(callback);
        res.end();
    });
});

module.exports = router;
