//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;
var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices/', function(req, res, next) {
    utils.query("SELECT * FROM Devices",function(error,respuesta,campos){
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Fallo la consulta"});
        }
    })
});

app.post('/devices/', function(req, res, next) {
    utils.query(
        "INSERT INTO `Devices` (`id`, `name`, `description`, `state`, `type`) VALUES ("
        +req.body.id+",'"+req.body.name+"','"+req.body.description+"',"+req.body.state+","+req.body.type+")", 
        function(error,respuesta,campos){
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Fallo la consulta"});
        }
    })
});

app.delete('/devices/',function(req,res,next){
    utils.query("DELETE FROM Devices where id = "+req.body.id, function(error,respuesta,campos) {
        if(req.body.id != undefined){
            res.status(200).send({saludo:"Borro "+req.body.id});
        }else{
            res.status(409).send({error:"Falta el id"});
        }
    })
});

app.put('/devices/',function(req,res,next){
    utils.query("UPDATE Devices SET name ='"+req.body.name+"',description='"+req.body.description+"',type="+req.body.type+" WHERE id ="+req.body.id+";", function(error,respuesta,campos) {
        if(req.body.id != undefined){
            res.status(200).send({saludo:"Modifico "+req.body.id});
        }else{
            res.status(409).send({error:"Falta el id"});
        }
    })
});

app.get('/devices/:id', function(req, res, next) {
    utils.query("SELECT * FROM Devices where id = "+req.params.id, function(error,respuesta,campos){
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Fallo la consulta"});
        }
    })
});

app.put('/devices/:id', function(req, res, next) {
    utils.query("UPDATE Devices SET state = 1-state where id= "+req.params.id, function(error,respuesta,campos){
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Fallo la consulta"});
        }
    })
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
