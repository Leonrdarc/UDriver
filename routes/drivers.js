var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/getdriverlocation', function(req, res, next) {
    var id;
    GetDriver(id)
    res.send('respond with a resource');
  });

router.post('/addDriver',(req, res)=>{
    


})
//Añadir Conductor
function AddDriver(fname,lname,bday,cell,mail,pass,cc,exp,lat,lon){ //Parametros de entrada
    //Retorna 0 si hubo error de conexión
    //Retorna 1 si el procedimiento se realizó correctamente
    //Retorna 2 si se encontró el mismo telefono
    var MongoClient = require('mongodb').MongoClient;
    //DbConnection
    //mongodb://localhost:27017

    MongoClient.connect("mongodb://localhost:27017", function (err, client) {
                        //Mongodb Cluster URL
        if(err)
        {
            console.log("Connection Failed :C")
            console.log(err);
            return 0;
        }
        else
        {
            var db= client.db('ColectivosDB'); //Base de datos objetivo

            console.log("Connected to db"); 
    
            //StartQuerys
            db.collection('drivers', function (err, collection) { //Insert
                collection.insert({name: fname,
                                 lastname: lname,
                                 birthday: bday,
                                 cellphone:cell,
                                 email:mail,
                                 password:pass,
                                 CCNumber:cc,
                                 expDate:exp,
                                 latitude :lat,
                                 longitude:lon
                                 });
                console.log('Success !')
                return 1;
            });
                  
                    
    }});
    
}

//Actualizar Ubicacion
function UpdateLocation(cell,lat,lon){ //Parametros de entrada
    //Retorna 0 si hubo error de conexión
    //Retorna 1 si el procedimiento se realizó correctamente
    //Retorna 2 si se encontró el mismo telefono
    var MongoClient = require('mongodb').MongoClient;
    //DbConnection
    //mongodb://localhost:27017

    MongoClient.connect("mongodb://localhost:27017", function (err, client) {
                        //Mongodb Cluster URL
        if(err)
        {
            console.log("Connection Failed :C")
            console.log(err);
            return 0;
        }
        else
        {
            var db= client.db('ColectivosDB'); //Base de datos objetivo

            console.log("Connected to db"); 
    
            //StartQuerys
            db.collection('drivers', function (err, collection) { //Insert
                collection.updateOne(
                    {cellphone: cell},
                    {$set: {latitude: lat,longitude: lon}}

                )
                console.log('Success !')
                return 1;
            });
                  
                    
    }});
    
}

//Obtener Ubicacion
function GetDriver(cell){ //Parametros de entrada
    var MongoClient = require('mongodb').MongoClient;
    var driverdoc;
    //DbConnection
    //mongodb://localhost:27017
    //Retorna todo el documento que coincida con cellphone
    MongoClient.connect("mongodb://localhost:27017", function (err, client) {
                        //Mongodb Cluster URL
        if(err)
        {
            console.log("Connection Failed :C")
            console.log(err);
            return 0;
        }
        else
        {
            var db= client.db('ColectivosDB'); //Base de datos objetivo

            console.log("Connected to db"); 
    
            //StartQuerys
            db.collection('drivers', function (err, collection) { //Insert
                collection.find(function(err, driverdoc) {
                  {cellphone: cell}         
                });       
            });
            return driverdoc;
                    
    }});
    
}