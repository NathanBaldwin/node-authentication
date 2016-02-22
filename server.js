'use strict'
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session); //what is happening here?

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret';
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: SESSION_SECRET, //creates session object on req (logged below)
  // cookie: {maxAge: 60000}
  store: new RedisStore
}));

app.use((req, res, next) => {
  req.session.visits = req.session.visits || {};
  req.session.visits[req.url] = req.session.visits[req.url] || 0;
  req.session.visits[req.url]++
  //we want the session object to be saved even if we restart server
  //need to create some persistenct logic
  //two popular modules for this: connect-mongo, connect-redis
  //redis is in-memory storage (faster), connect-mongo stores in mongo(slower bc of disk access time)

  console.log(req.session);
  next();
})

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
