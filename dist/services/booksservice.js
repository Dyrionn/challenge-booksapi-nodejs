const cheerio = require('cheerio');
const requestPromise = require('request-promise');
const firebaseServer = 'https://challenge-books-api.firebaseio.com/Team-Awesome/Books';

exports.Add = function(book, externalCallback){
   
    handleHttpRequests('GET',function(callback){
        if(callback.body == null){
                 var placeHolderObject = [{"title":"placeholder","description":"placeholder","isbn":"0000000000000","language":"EN","id":"000"}];
                handleHttpRequests('PUT', function(response){
                    handleHttpRequests('GET',function(callback){
                        var list = callback.body;
                        book.id = list.length.toString().padStart(3, '0');
                        list.push(book);
            
                        handleHttpRequests('PUT', externalCallback ,null, null, list);
                    });
                }, null, null, placeHolderObject)
        }else{
            var list = callback.body;
            book.id = list.length.toString().padStart(3, '0');
            list.push(book);

            handleHttpRequests('PUT', externalCallback ,null, null, list);
        };
    });
};

exports.getAll = function(callback){
    handleHttpRequests('GET', callback);
}

exports.getById = function(id, callback){
    handleHttpRequests('GET', callback, "", id);
}

exports.getFromExternalSource = function(callback){

    var bookList = [];
    requestPromise({
        method: 'GET',
        resolveWithFullResponse: true,
        uri: "https://kotlinlang.org/docs/books.html"})
        .then((response) => {

            if (response.statusCode == 200) {
                const $ =  cheerio.load(response.body);

                // var bookList = [];
                $('.book-lang').each(function(i, el){
                    var id = null;
                    var title = $(el)
                        .prev()
                        .text();

                    var description = $(el)
                        .next()
                        .next()
                        .text()
                        .replace(/\s\s+/g,'');

                    var urlToSearchIsbn = $(el)
                        .next()
                        .attr('href');

                    var language = $(el)
                        .text()
                        .toUpperCase();

                    var book = {
                        "id": id,
                        "title": title,
                        "description": description,
                        "isbn": urlToSearchIsbn,
                        "language": language
                    }

                    bookList.push(book);
                })
            }
            callback(bookList)
        })
        // .then(() => {
            
        //     bookList.forEach(function(item){
        //         requestPromise({
        //             method: 'GET',
        //             resolveWithFullResponse: true,
        //             uri: item.isbn})
        //         .then((response)=>{
        //             if (response.statusCode == 200) {
        //                 const siteString = response.body;
        //                 const tagIndex = siteString.indexOf('isbn')
        //                 const tagIndexCapital = siteString.indexOf('ISBN')

        //                 if (tagIndex > -1) {
        //                     var internalSubstring = siteString.substr(tagIndex, 50);
        //                     // isbn = internalSubstring.replace(/\D+/);
        //                     item.isbn = internalSubstring.replace(/[^0-9]+/);
        //                     //.replace(/\D+/g, '');
        //                 }else if (tagIndexCapital > -1) {
        //                     item.isbn = siteString.substr(tagIndexCapital, 50);
        //                 }
                        
        //                 if (item.isbn.length != 13) {
        //                     item.isbn = "Unavailable";
        //                 }

        //                 console.log('isbn ' + item.isbn + ' index found '+ tagIndex + ', ' + tagIndexCapital);
        //             }
        //         })
        //     })
        //     // var str = "Hello world!";
        //     // console.log(str.substring(1, 4));
        //     // .catch((err)=> {
        //     //     console.log('[{"Message": "Error during request => ' + urlToSearchIsbn + '"}]');
        //     // });
        // })
        .catch((err) => {
            throw new Error('[{"Message": "Failure during webpage scraping"}]');
    });
}

function handleHttpRequests(httpMethod, callback, firebaseUrlParams = null, resource = null, json = ""){
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