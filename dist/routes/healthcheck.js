var express = require('express');
var router = express.Router();

router.get('/',function(req, res) {
    
    var jsonResponse = {
        "APICheck": "Working correctly"
    }
        res.statusCode = 200;
        res.send(jsonResponse);
        res.end();
});

module.exports = router;
