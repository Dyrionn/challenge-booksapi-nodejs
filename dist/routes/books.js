var express = require('express');
var router = express.Router();
var booksservice = require('../services/booksservice')


router.post('/book', function(req, res, next) {
    console.log('3000 / book');
    booksservice.Add(req.body, function(callback){
        var response = "";
    
        try {
            res.statusCode = callback.statusCode;
            response = callback.body;
            console.log(response + " statuscode: " + res.statusCode + callback.body);
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

    var jsonResponse = "";

    try {
        jsonResponse = booksservice.getById(req.params.id)
        res.statusCode = 200;
    } catch (error) {
        console.error(error);
        jsonResponse = error.toString();
        res.statusCode = 500;
    }

    res.send(jsonResponse);
    res.end();
});

module.exports = router;
