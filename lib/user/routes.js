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

    if (user) {
      user.authenticate(req.body.password, (err, valid) => {
        if (err) throw err;

        if (valid) {
          //throw user object on session so you can know whether user
          //is logged in, and you can use their user info later:
          req.session.user = user;
          console.log("HERE IS REQ.SESSION########", req.session);
          res.redirect('/');
        } else {
          res.redirect('/login');
        }
      })
    } else {
      res.redirect('/login');
    }
  });
});

router.post('/register', (req, res) => {
  if(req.body.password === req.body.verify) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;
      if (user) {
        user.authenticate(req.body.password, (err, valid) => {
          if (err) throw err;

          if (valid) {
            req.session.user = user;
            res.redirect('/');
          } else {
            res.message =  {
              message: "problem with email or password"
            }
            res.redirect('/login');
          }
        })
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

router.delete('/logout', (req, res) => {
  req.session.regenerate((err) => {
    if (err) throw err;
    res.send('you logged out sucka!!')
  })
})

module.exports = router;
