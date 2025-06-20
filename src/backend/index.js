//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;
var express = require("express");
var app = express();
var utils = require("./mysql-connector");

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static("/home/node/app/static/"));

//=======[ Main module code ]==================================================

app.get("/devices/", function (req, res, next) {
  utils.query("SELECT * FROM Devices", function (error, respuesta, campos) {
    if (error == null) {
      console.log(respuesta);
      res.status(200).send(respuesta);
    } else {
      console.log(error);
      res.status(409).send({ error: "Fallo la consulta" });
    }
  });
});

//Agregar un dispositivo. Por defecto, se agrega en estado apagado.
app.post("/devices/", function (req, res, next) {
  utils.query("INSERT INTO Devices (name, description, state, type) VALUES (?, ?, ?, ?)",[req.body.name,req.body.description,0,req.body.type], function (error, respuesta, campos) {
    if (error == null) {
      console.log(respuesta);
      res.status(200).send(respuesta);
    } else {
      console.log(error);
      res.status(409).send({ error: "Fallo la consulta" });
    }
  });
});

//Borra el dispositivo con el id indicado en el body.
app.delete("/devices/", function (req, res, next) {
  const consulta = "DELETE FROM Devices where id = " + req.body.id;
  console.log(consulta);
  utils.query(consulta, function (error, respuesta, campos) {
    if (req.body.id != undefined) {
      res.status(200).send({ saludo: "Borro " + req.body.id });
    } else {
      res.status(409).send({ error: "Falta el id" });
    }
  });
});

//Modifica un dispositivo existente.
app.put("/devices/", function (req, res, next) {
  const consulta =
    "UPDATE Devices SET name ='" +
    req.body.name +
    "',description='" +
    req.body.description +
    "',type=" +
    req.body.type +
    " WHERE id =" +
    req.body.id +
    ";";
  console.log(consulta);
  utils.query(consulta, function (error, respuesta, campos) {
    if (req.body.id != undefined) {
      res.status(200).send({ saludo: "Modifico " + req.body.id });
    } else {
      res.status(409).send({ error: "Falta el id" });
    }
  });
});

//Cambia el estado de un device entre encendido (100) y apagado (0) y valores intermedios si corresponde.
app.put("/devices/:id", function (req, res, next) {
  utils.query("UPDATE Devices SET state = ? where id=?", [req.body.state, req.params.id], function (error, respuesta, campos) {
    if (error == null) {
      console.log(respuesta);
      res.status(200).send(respuesta);
    } else {
      console.log(error);
      res.status(409).send({ error: "Fallo la consulta" });
    }
  });
});

app.listen(PORT, function (req, res) {
  console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
