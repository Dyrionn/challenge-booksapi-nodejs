const requestPromise = require('request-promise');
const firebaseServer = 'https://challenge-books-api.firebaseio.com/Team-Awesome/Books';

exports.Add = function(book, externalCallback){
   
    handleHttpRequests('GET',function(callback){
        console.log('Aqui!');
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

exports.getFromExternalSource = function(){
    return '{"Message": A lot of books!!!}';
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

    console.log(json);
    console.log(options.uri);

    requestPromise(options)
        .then((response) => {
            if (callback != null) {
                callback(response);
            }
        }).catch((err) => {
            throw new Error('[{"Message": "Failure during ' + httpMethod + ' request => ' + options.uri + '},{"Error: ' + err.toString() + '}]');
    });
}