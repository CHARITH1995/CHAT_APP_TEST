var mysql = require('mysql');
require('dotenv').config()

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatapplication"
});
con.connect(function (err) {
    if (!err){
        console.log("Database Connection Created");
    }
    else{
        console.log('Connetion error occured' + err);
    }
});

module.exports = con;