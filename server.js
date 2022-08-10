const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
const session = require('express-session');
const webPush = require('web-push');
const cors = require('cors');

const app = express();

/*
* The public and private keys are hard-coded here but should be generated only once using
* the `generateVAPIDKeys()` method: https://github.com/web-push-libs/web-push#generatevapidkeys
* */
const publicKey = 'BGByiWdMxciiNJkqcAzGoZpS4JHmhKZsjWXNvte52AqXd_8ACgNL2iFG6L-VLEq3vleg2bM8MuW7Hb3P85cA_Qo';
const privateKey = 'zQDqrROWVmzNCGwIoGn-2HyzVi15KhpziZ7gsMOVUBg';

app.use(methodOverride());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '5mb'}));

app.use(cors({
  credentials: true
}));

app.use(session({
  secret: 'webpushdemo-secret',
  resave: true,
  saveUninitialized: true
}));

app.use(errorHandler());

app.get('/public-key', (req, res) => {
  res.json({publicKey: publicKey});
});

app.post('/send-message', (req, res) => {
  const {pushSubscription, title, message, delay = 0, interaction} = req.body;
  const payload = JSON.stringify({title, message, interaction});

  const options = {
    vapidDetails: {
      subject: 'mailto:example_email@example.com',
      publicKey,
      privateKey
    },
    TTL: 60
  };

  setTimeout(async () => {
    try {
      const response = await webPush.sendNotification(
        pushSubscription,
        payload,
        options
      );

      console.log('notification sent', response);
      res.sendStatus(201);
    }
    catch (error) {
      console.log('notification error', error);
      res.status(error.code).send({error});
    }
  }, delay);

});

const server = https.createServer({
    key: fs.readFileSync('ssl/private-key.pem'),
    cert: fs.readFileSync('ssl/localhost-cert.pem')
  },
  app
);

const port = 3000;

server.listen(port, '0.0.0.0', () => {
  console.log(`Push server running on port ${port}`);
});

module.exports = app;
