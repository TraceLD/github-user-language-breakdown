const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const getAvatar = require('./modules/getAvatar.js');
const getLang = require('./modules/getLang.js');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.post('/api/avatar', (req, res) => {
  getAvatar(req.body.post).then(function (result) {
    res.send(`${result}`);
  });
});

app.post('/api/languages', (req, res) => {
  getLang.getLang(req.body.post).then(function (result) {
    if (result.length === 0) {
      res.send("No repositories found.",
      );
    } else {
      res.send(
        `${result}`,
      );
    }
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));