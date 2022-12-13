const mysql = require("mysql");

var con = mysql.createConnection({
  database: "iot",
  host: "localhost",
  user: "root",
  password: "montaA*619",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to database!");
});

function insertTemperature(data) {
  var sql = `INSERT INTO temperature (time, value) VALUES ('${new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ")}', ${data})`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted into temperature");
  });
}
function insertFrequence(data) {
    var sql = `INSERT INTO frequence (time, value) VALUES ('${new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")}', ${data})`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted into frequence");
    });
  }

  function inserto2(data) {
    var sql = `INSERT INTO oxygene (time, value) VALUES ('${new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")}', ${data})`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted into oxygene");
    });
  }

  function insertSteps(data) {
    var sql = `INSERT INTO steps (time, value) VALUES ('${new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")}', ${data})`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted into steps");
    });
  }

  function insertPression(data) {
    var sql = `INSERT INTO pression (time, value) VALUES ('${new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")}', ${data})`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted into pression");
    });
  }
module.exports = {
  insertTemperature,
  inserto2,
  insertFrequence,
  insertPression,
  insertSteps
};
