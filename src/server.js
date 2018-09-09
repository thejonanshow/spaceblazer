const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');
const app = express();

app.use(express.static('assets/images'));
app.use(express.static('build'));
app.use(sslRedirect(['production'], 301));

export default app
