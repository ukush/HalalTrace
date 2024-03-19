var express = require('express');
var router = express.Router();


router.get('/nft', function(req, res, next) {
    res.json(data)
});

router.post('/nft', function(req, res) {
    data = req.body;
    console.log('Received form data:', data);
    res.sendStatus(200); // Send a success status code back to the client
  });

module.exports = router;
