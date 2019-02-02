var express = require('express');
var router = express.Router();
//var booksservice = require('../services/booksservice')

router.get('/book', function(req, res, next) {
    
    var jsonResponse = {
        "Message": "just a book!"
    }

    res.statusCode = 200;
    res.send(jsonResponse);
    res.end();
});

router.get('/books/:id', function(req, res, next) {

    var jsonResponse = {
        "Message": 'Here is your book : ' + req.params.id
    }
    
    res.statusCode = 200;
    res.send(jsonResponse);
    res.end();
});

router.get('/books', function(req, res, next) {

    var jsonResponse = {
        "Message": "a lot of books!!!"
    }
    
    res.statusCode = 200;
    res.send(jsonResponse);
    res.end();
});

module.exports = router;
