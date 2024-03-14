const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var router = express.Router();

app.use(bodyParser.json());

app.post('/api/healthform', (req, res) => {
  const formData = req.body;
  console.log('Received form data:', formData);
  // Process the form data, store it, etc.
  res.sendStatus(200); // Send a success status code back to the client
});


module.exports = router;
