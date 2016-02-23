'use strict'
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');//creates connect.sid cookie
const RedisStore = require('connect-redis')(session); //what is happening here?
const methodOverride = require('method-override');
const passport = require('passport'); //express oath module


const userRoutes = require('./lib/user/routes');
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret';
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: SESSION_SECRET, //creates session object on req (logged below)
  // cookie: {maxAge: 60000}
  store: new RedisStore //res store stores our session info in a place that
  //isn't in node's memory. It's in the redis database on your memory, not node's memory.
  //So, if we restart our server, we'll still have our user data.
}));

app.use(methodOverride('_method'));

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


app.use((req, res, next) => {
  res.locals.user = req.session.user || { email: 'Guest' };
  //res.locals is unique to user. Everyone can see app.locals.
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(userRoutes);

app.get('/', (req, res) => {
  res.render('index');
});
//kdljf

mongoose.connect('mongodb://localhost:27017/nodeauth', (err) => {
  if (err) throw err;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  })
})
