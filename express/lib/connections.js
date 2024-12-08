const mysql      = require('mysql')
const nodemailer = require('nodemailer');
const lib        = require('./scripts')



var gmail = nodemailer.createTransport(credentials.gmail);

var db = mysql.createConnection(credentials.mysql)
db.connect(function(err){
    if (err){
      lib.error('error connecting:' + err.stack);
    }
    lib.success('CONNECTED WITH DATABASE');
  });
  


module.exports = {
    credentials,
    gmail,
    db,
}