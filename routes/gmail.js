var express = require('express');
var router = express.Router();

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var cs = require('../client_secret.json');
var oauth2Client = new OAuth2(cs.client_id, cs.client_secret, cs.redirect_url);

var Account = require('../models/account');

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  approval_prompt: 'force',
  scope: [
    'https://www.googleapis.com/auth/plus.profile.emails.read',
    'https://mail.google.com/',
  ]
});

router.get('/login', function (req, res) {
  res.redirect(url);
});

router.get('/login/authorized', function (req, res) {
  var code = req.query.code;
  console.log(code);
  oauth2Client.getToken(code, function(err, tokens) {
    oauth2Client.setCredentials(tokens);
    console.log(tokens);
    var account = Account(tokens);
    account.save();

    google.plus('v1').people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
      if (err) {
        console.log('An error occured', err);
        return;
      }
      console.log(profile);
    });
    res.end('authorized');
  });
});


module.exports = router;
