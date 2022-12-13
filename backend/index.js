const express = require("express");
const mqtt = require("mqtt");
const mysql = require("mysql2");
const con = mysql.createConnection({
  database: "iot",
  host: "localhost",
  user: "root",
  password: "montaA*619", 
});

async function getTemperature() {
  const [res] = await con.promise().query('SELECT * FROM temperature');
  return res;
}
async function getPression() {
  const [res] = await con.promise().query('SELECT * FROM pression');
  return res;
}
async function geto2() {
  const [res] = await con.promise().query('SELECT * FROM oxygene');
  return res;
}
async function getsteps() {
  const [res] = await con.promise().query('SELECT * FROM steps');
  return res;
}
async function getfrequence() {
  const [res] = await con.promise().query('SELECT * FROM frequence');
  return res;
}
const {
  insertTemperature,
  inserto2,
  insertFrequence,
  insertPression,
  insertSteps,
} = require("./requests/insertion");

const app = express();

var client = mqtt.connect("mqtt://broker.mqttdashboard.com", {
  protocolId: "MQIsdp",
  protocolVersion: 3,
});
client.subscribe("hc/temp");
client.subscribe("hc/o2");
client.subscribe("hc/freq");
client.subscribe("hc/pres");
client.subscribe("hc/steps");

client.on("message", function (topic, message) {
  switch (topic) {
    case "hc/temp":
      insertTemperature(message.toString());
      break;
    case "hc/o2":
      inserto2(message.toString());
      break;
    case "hc/freq":
      insertFrequence(message.toString());
      break;
    case "hc/pres":
      insertPression(message.toString());
      break;
    case "hc/steps":
      insertSteps(message.toString());
      break;
  }
});

client.on("connect", function () {
  console.log("Connected to mqtt broker");
});

app.use(express.json());

app.get("/getpression", async function (req, res) {
 res.send(await getPression());

});
app.get("/gettemperature", async function  (req, res) {
 
  res.send(await getTemperature());

});
app.get("/geto2", async function (req, res) {
  res.send(await geto2());

});
app.get("/getsteps",async function (req, res) {
  res.send(await getsteps());

});
app.get("/getfrequence",async function (req, res) {
  res.send(await getfrequence());

});

app.listen(3000, () => console.log("Server started"));