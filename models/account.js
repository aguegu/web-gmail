var mongoose = require('mongoose');

module.exports = mongoose.model('Account',{
  access_token:   String,
  token_type:     String,
  id_token:       String,
  refresh_token:  String,
  expiry_date:    Number,
});
