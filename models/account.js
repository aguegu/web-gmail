var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  title:      String,
  password:   String,
  token: {
    type: Schema.Types.ObjectId,
    ref: 'Token'
  }
});

var Account = mongoose.model('Account', schema, 'account');

module.exports = Account;
