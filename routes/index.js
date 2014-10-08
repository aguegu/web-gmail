var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res) {
  res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res){
  var user = {
    username:'admin',
    password:'admin'
  };
  if (req.body.username === user.username && req.body.password === user.password) {
    res.redirect('/home');
  }
  res.redirect('/login');
});

router.get('/home', function (req, res) {
  var user = {
    username:'admin',
    password:'admin'
  };
  res.render('home', {title: 'Home', user: user});
});

router.get('/logout', function (req, res) {
  res.redirect('/');
});

module.exports = router;
