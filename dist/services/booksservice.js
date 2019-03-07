const cheerio = require('cheerio');
const requestPromise = require('request-promise');
const request = require('request');
const fetch = require('node-fetch');
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

            let bruteBooksData = [];
            $('.book-lang').map(function(index, element) {
                bruteBooksData.push($(this));
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
            console.log("Cabei qui");
        
        console.log('OVER');
        callback(bookList);
    }

}

async function searchBookIsbn(book, urlToSearchIsbn){

    let response = await fetch(urlToSearchIsbn);

    if (response.status == 200) {
        let siteString = await response.text();
        // siteString = siteString.toLowerCase();
        let tagIndex = siteString.indexOf('isbn')
        let tagIndexCapital = siteString.indexOf('ISBN')


        //just for logs
        let loginternalstring = '';
        //end

        if (tagIndex > -1) {
            let internalSubstring = siteString.substr(tagIndex, 50).trim();

            book.isbn = internalSubstring.replace(/\D+/g, "");

            loginternalstring = internalSubstring;
        }
        else if (tagIndexCapital > -1) {
            let internalSubstring = siteString.substr(tagIndexCapital, 50).trim();

            book.isbn = internalSubstring.replace(/\D+/g, "");

            loginternalstring = internalSubstring;
        }
        
        if (book.isbn.length != 13) {
            book.isbn = "Unavailable";
        }

        console.log('isbn ' + book.isbn + ' index found '+ tagIndex + ', ' + tagIndexCapital, '|' +  loginternalstring + '|' + urlToSearchIsbn);
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