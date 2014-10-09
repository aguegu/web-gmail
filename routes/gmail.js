var express = require('express');
var router = express.Router();

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var cs = require('../client_secret.json');
var oauth2Client = new OAuth2(cs.client_id, cs.client_secret, cs.redirect_url);

var Token = require('../models/token');
var Account = require('../models/account');

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  approval_prompt: 'force',
  scope: [
    'https://www.googleapis.com/auth/plus.profile.emails.read',
    'https://mail.google.com/',
  ]
});

router.get('/auth', function (req, res) {
  res.redirect(url);
});

router.get('/authorized', function (req, res) {
  var code = req.query.code;
  console.log(code);
  oauth2Client.getToken(code, function(err, tokens) {
    var token = Token(tokens);
    token.save();
    res.redirect('/gmail/register/' + token._id);
  });
});

router.get('/register/:oid', function (req, res, next) {
  console.log(req.params.oid);
  Token.findById(req.params.oid, function (err, token) {
    if (err)
      return next(err);

    if (!token)
      return next(Error({message: 'no such token', status: 404}));

    var oc = new OAuth2(cs.client_id, cs.client_secret, cs.redirect_url);
    oc.setCredentials({
      expiry_date: token.expiry_date,
      access_token: token.access_token,
      refresh_token: token.refresh_token
    });

    google.plus('v1').people.get({ userId: 'me', fields: 'emails', auth: oc }, function(err, profile) {
      if (err)
        return next(err);

      var email = profile.emails.filter(function(e) {
        return e.type == 'account'
      })[0].value;

      if (token.access_token != oc.credentials.access_token) {
        Token.findByIdAndUpdate(token._id, oc.credentials, function (err, doc) {
          if (err)
            return next(err);
        });
      }

      // weird that findByIdAndUpdate only works if callback exists.

      res.render('login', { title: 'Login', email: email, expiry_date: new Date(oc.credentials.expiry_date) });
    });
  });
});


module.exports = router;
