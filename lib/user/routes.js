const express = require('express');
const router = express.Router();

const User = require('./model');

router.get('/login', (req, res) => {
  res.render('login');
})

router.get('/register', (req, res) => {
  res.render('register');
})

router.post('/login', (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if(err) throw err;
    //throw user object on session so you can use it later:
    req.session.user = user;
    res.redirect('/');
  })
})

router.post('/register', (req, res) => {
  if(req.body.password === req.body.verify) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;
      if (user) {
        res.redirect('/login');
      } else {
        User.create(req.body, (err, user) => {
          res.redirect('/login');
        })
      }
    })
    //res.redirect('/');
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Get it right!'
    });
  }
});

module.exports = router;
