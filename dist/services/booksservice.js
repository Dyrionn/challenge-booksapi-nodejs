const cheerio = require('cheerio');
const requestPromise = require('request-promise');
const fetch = require('node-fetch');
const serviceUtils = require('../utils/service-utils')

const firebaseServer = 'https://challenge-books-api.firebaseio.com/Team-Awesome/Books';

exports.Add = function(book, externalCallback){
   
    handleFirebaseRequests('GET',function(callback){
        if(callback.body == null){
                 var placeHolderObject = [{"title":"placeholder","description":"placeholder","isbn":"0000000000000","language":"EN","id":"000"}];
                handleFirebaseRequests('PUT', function(response){
                    handleFirebaseRequests('GET',function(callback){
                        var list = callback.body;
                        book.id = list.length.toString().padStart(3, '0');
                        list.push(book);
            
                        handleFirebaseRequests('PUT', externalCallback ,null, null, list);
                    });
                }, null, null, placeHolderObject)
        }else{
            var list = callback.body;
            book.id = list.length.toString().padStart(3, '0');
            list.push(book);

            handleFirebaseRequests('PUT', externalCallback ,null, null, list);
        };
    });
};

exports.getAll = function(callback){
    handleFirebaseRequests('GET', callback);
}

exports.getById = function(id, callback){
    handleFirebaseRequests('GET', callback, "", id);
}

exports.getFromExternalSource = async function(callback){

    var bookList = [];
    let response = await fetch("https://kotlinlang.org/docs/books.html");

    let body = await response.text();

    if (response.status == 200) {
        const $ =  cheerio.load(body);

            let bruteBooksData = $('.book-lang').map(function(){
                return $(this);
            });

            for (let i = 0; i < bruteBooksData.length; i++) {

                var id = null;
                var title = $(bruteBooksData[i])
                    .prev()
                    .text();

                var description = $(bruteBooksData[i])
                    .next()
                    .next()
                    .text()
                    .replace(/\s\s+/g,'');

                var urlToSearchIsbn = $(bruteBooksData[i])
                    .next()
                    .attr('href');

                var language = $(bruteBooksData[i])
                    .text()
                    .toUpperCase()

                var book = {
                    "id": id,
                    "title": title,
                    "description": description,
                    "isbn": urlToSearchIsbn,
                    "language": language
                }

                await searchBookIsbn(book, urlToSearchIsbn)

                bookList.push(book);
            }
            
        var haveIsbn = await bookList.filter(x => x.isbn != "Unavailable");
        var donthaveIsbn = await bookList.filter(x => x.isbn == "Unavailable");
        console.log(haveIsbn.length + 'haveIsbn');
        console.log(donthaveIsbn.length + 'donthaveIsbn')

        callback(bookList);
    }
}

async function searchBookIsbn(book, urlToSearchIsbn){
    try {
        let response = await fetch(urlToSearchIsbn);

        if (response.status == 200) {
            let responseBodyString = await response.text();

            book.isbn = await serviceUtils.findNumberAroundTag(responseBodyString, 'isbn', false);
            
            if (book.isbn == "") {
                book.isbn = await serviceUtils.findNumberAroundTag(responseBodyString, 'isbn', true);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

function handleFirebaseRequests(httpMethod, callback, firebaseUrlParams = null, resource = null, json = ""){
    var options = "";
    if (firebaseUrlParams == null) {
        firebaseUrlParams = "";
    }

    if (json != "" & json != null & httpMethod != "GET") {
        options = {
            method: httpMethod,
            resolveWithFullResponse: true,
            uri: firebaseServer + '/.json' + firebaseUrlParams,
            json: true // Automatically stringifies the body to JSON
        };
        options.body = json;
    }else{
        options = {
            method: httpMethod,
            resolveWithFullResponse: true,
            uri: firebaseServer + '/.json' + firebaseUrlParams,
            json: true // Automatically stringifies the body to JSON
        };
    }

    if (resource != null) {
        options.uri = firebaseServer + '/' + resource + '/.json' + firebaseUrlParams;
    }

    requestPromise(options)
        .then((response) => {
            if (callback != null) {
                callback(response);
            }
        }).catch((err) => {
            console.log(err);
            throw new Error('[{"Message": "Failure during ' + httpMethod + ' request => ' + options.uri + '"},{"Error: "' + err + '"}]');
    });
}