var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  connectionLimit: 1000,
  connectTimeout:60*60*1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout:60*60*1000,
  waitForConnections: true,
  database:'customer',
  multipleStatements: true,
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports= con;