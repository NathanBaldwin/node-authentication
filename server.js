'use strict'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');


app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/register', (req, res) => {
  res.render('register');
})

app.post('/login', (req, res) => {
  res.redirect('/');
})

app.post('/register', (req, res) => {
  if(req.body.password === req.body.verify) {
    res.redirect('/');
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Get it right!'
    });
  }
})


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})