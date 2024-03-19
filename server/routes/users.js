var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')




router.get('/', function(req, res, next) {
    // retrieves the data from the database
    res.json({})
});

router.post('/', function(req, res) {
    const data = req.body;
    console.log('Received form data:', data);

    // add this collection to the database
    // database connection
    mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
    const db = mongoose.connection
    db.on('error', (error) => console.log(error))
    db.once('open', () => console.log('Connected to Database'))

    res.sendStatus(200);
  });


module.exports = router;
