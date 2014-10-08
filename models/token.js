var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  access_token:   String,
  token_type:     String,
  id_token:       String,
  refresh_token:  String,
  expiry_date:    Number,
});

var Token = mongoose.model('Token', schema, 'token');

module.exports = Token;
