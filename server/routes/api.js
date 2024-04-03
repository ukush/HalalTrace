var express = require('express');
var router = express.Router();


router.get('/farming', function(req, res, next) {
    res.json({})
});

router.post('/farming', function(req, res) {
    data = req.body;
    console.log('Received form data:', data);
    res.sendStatus(200); // Send a success status code back to the client
  });

  router.get('/slaughter', function(req, res, next) {
    res.json({})
});

router.post('/slaughter', function(req, res) {
    data = req.body;
    console.log('Received form data:', data);
    res.sendStatus(200); // Send a success status code back to the client
  });

  router.get('/processing', function(req, res, next) {
    res.json({})
});

router.post('/processing', function(req, res) {
    data = req.body;
    console.log('Received form data:', data);
    res.sendStatus(200); // Send a success status code back to the client
  });

  router.get('/distribution', function(req, res, next) {
    res.json({})
});

router.post('/distribution', function(req, res) {
    data = req.body;
    console.log('Received form data:', data);
    res.sendStatus(200); // Send a success status code back to the client
  });

  router.get('/retail', function(req, res, next) {
    res.json({})
});

router.post('/retail', function(req, res) {
    data = req.body;
    console.log('Received form data:', data);
    res.sendStatus(200); // Send a success status code back to the client
  });

module.exports = router;
