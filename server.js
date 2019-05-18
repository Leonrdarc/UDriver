var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('AddData', (data) => {

        AddData(data);
    });

    socket.on('updatingLocationDriver', (data) => {
        socket.broadcast.emit('updateLocationDriver', data)
        console.log("updateDriver enviado")
    });
});

function AddData(data) {
    console.log(data);
    var MongoClient = require('mongodb').MongoClient;
    //DbConnection
    //mongodb://localhost:27017

    //MongoClient.connect("mongodb+srv://admin:contra12345@colectivos-hgrqm.mongodb.net/test?retryWrites=true", function (err, client) {
    MongoClient.connect("mongodb://localhost:27017", function (err, client) {
        //Mongodb Cluster URL
        if (err) {
            console.log("Connection Failed :C")
            console.log(err);
            return 0;
        }
        else {
            var db = client.db('ColectivosDB'); //Base de datos objetivo

            console.log("Connected to db");

            //StartQuerys
            db.collection('users', function (err, collection) { //Insert
                collection.insert({
                    name: data.lat + data.lon
                });
                console.log('Success !')
                db.collection('users').count(function (err, count) {
                    if (err) throw err;

                    console.log('Total Rows: ' + count);
                    client.close;
                    return 1;
                });
            });


        }
    });
}

function AddUser(fname, lname, bday, cell, mail, pass, CC, Exp) { //Parametros de entrada
    //Retorna 0 si hubo error de conexión
    //Retorna 1 si el procedimiento se realizó correctamente
    //Retorna 2 si se encontró el mismo telefono
    var MongoClient = require('mongodb').MongoClient;
    //DbConnection
    //mongodb://localhost:27017

    MongoClient.connect("mongodb://localhost:27017", function (err, client) {
        //Mongodb Cluster URL
        if (err) {
            console.log("Connection Failed :C")
            console.log(err);
            return 0;
        }
        else {
            var db = client.db('ColectivosDB'); //Base de datos objetivo

            console.log("Connected to db");

            //StartQuerys
            db.collection('users', function (err, collection) { //Insert
                collection.insert({
                    name: fname,
                    lastname: lname,
                    Birthday: bday,
                    CellphoneNumber: cell,
                    Email: mail,
                    password: pass,
                    CCNumber: CC,
                    ExpDate: Exp
                });
                console.log('Success !')
                db.collection('users').count(function (err, count) {
                    if (err) throw err;

                    console.log('Total Rows: ' + count);
                    client.close;
                    return 1;
                });
            });


        }
    });

}

function AddDriver(fname, lname, bday, cell, mail, pass, cc, exp, lat, lon) { //Parametros de entrada
    //Retorna 0 si hubo error de conexión
    //Retorna 1 si el procedimiento se realizó correctamente
    //Retorna 2 si se encontró el mismo telefono
    var MongoClient = require('mongodb').MongoClient;
    //DbConnection
    //mongodb://localhost:27017

    MongoClient.connect("mongodb://localhost:27017", function (err, client) {
        //Mongodb Cluster URL
        if (err) {
            console.log("Connection Failed :C")
            console.log(err);
            return 0;
        }
        else {
            var db = client.db('ColectivosDB'); //Base de datos objetivo

            console.log("Connected to db");

            //StartQuerys
            db.collection('drivers', function (err, collection) { //Insert
                collection.insert({
                    name: fname,
                    lastname: lname,
                    birthday: bday,
                    cellphone: cell,
                    email: mail,
                    password: pass,
                    CCNumber: cc,
                    expDate: exp,
                    latitude: lat,
                    longitude: lon
                });
                console.log('Success !')
                return 1;
            });


        }
    });

}

function UpdateLocation(cell,data){ //Parametros de entrada
    //Retorna 0 si hubo error de conexión
    //Retorna 1 si el procedimiento se realizó correctamente
    //Retorna 2 si se encontró el mismo telefono
    var MongoClient = require('mongodb').MongoClient;
    //DbConnection
    //mongodb://localhost:27017
    console.log('Intentando actualizar ')
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
            db.collection('driverlocations', function (err, collection) { //Insert
                console.log('Celular: '+cell)
                console.log(data)
                collection.updateOne(
                    {cellphone: cell},
                    {$set: {lat: data.lat,long: data.lon}}

                )
                console.log('Success !')
                return 1;
            });
                  
                    
    }});
    
}