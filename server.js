var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const boom = require('express-boom')
const qs = require('qs')
const fetch = require('node-fetch')
const jsonwebtoken = require('jsonwebtoken')
const crypto = require('crypto');
var socketIoJwtAuth = require('socketio-jwt-auth');
const ClusterCon = "mongodb+srv://admin:contra12345@colectivos-hgrqm.mongodb.net/test?retryWrites=true";
app.use(boom());
server.listen(3000);
const loc = io.of('/Location');
//const socket = io('/Elnsp');
//socket.join('some room');
/**
 * Environment Variables:
 * In a real scenario get them using process.env
 */

const FACEBOOK_APP_ID = '2332001133742939'
const FACEBOOK_APP_SECRET = '8385fb598e2b455b03bc3cef0d8eaf07'
const JWT_SECRET = 'ABRACADABRA'

/**
 * Constants
 */

const FACEBOOK_ACCESS_TOKEN_URL = 'https://graph.accountkit.com/v1.3/access_token'
const FACEBOOK_ME_URL = 'https://graph.accountkit.com/v1.3/me'

/**
 * Server Initialization
 */
console.log(GetPeople('1234'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/auth', async function (req, res) {
    //Obtiene los usuarios de la base de datos
    // const users = db.get('users')

    try {
      //
      const authInfo = await getFacebookToken(req.query.code)

    //   let user = users.find({ id: authInfo.id }).value()
        var userexist = GetPeople(authInfo.id);
        
       if (userexist==0) {
        const { phone } = await getFacebookMe(authInfo['access_token'])
        user = { id: authInfo.id, phone: phone }
        AddUser(user);
        // users.push(user).write()
        //user.id
       }
      
      const jwt = jsonwebtoken.sign({ sub: user.id }, JWT_SECRET)
      console.log(user.id);

      res.json({ jwt, user })
    } catch (err) {
      res.boom.unauthorized()
    }
});

// using middleware
io.use(socketIoJwtAuth.authenticate({
    secret: JWT_SECRET,
    algorithm: 'HS256'
  }, function(payload, done) {
    var id = payload.sub;
    console.log('Usuario: '+id+' verificado')
    return done(null, {id: id});
  }));

io.on('connection', function(socket) {
    console.log('Authentication passed!');
    // now you can access user info through socket.request.user
    // socket.request.user.logged_in will be set to true if the user was authenticated
    socket.emit('success', {
        message: 'success logged in!',
        user: socket.request.user
    });
    socket.on('updatingLocationDriver', (data)=>{
        UpdateLocation(data);        
        socket.broadcast.emit('updateLocationDriver',data); 
    });
        
    socket.on('GetLocation', id =>{
        var data = GetLocation(id);
        socket.broadcast.emit('Location',data);
    });

    socket.on('GetLocation', id =>{
        var data = GetLocation(id);
        socket.broadcast.emit('Location',data);
    });
});
// io.on('connection', function (socket) {
//     socket.on('AddData', (data) => {

//         AddData(data);
//     });

//     socket.on('updatingLocationDriver', (data) => {
//         socket.broadcast.emit('updateLocationDriver', data)
//         console.log("updateDriver enviado")
//     });
// });

async function getFacebookToken(code) {
    var accessToken = ['AA', FACEBOOK_APP_ID, FACEBOOK_APP_SECRET].join('|')
    var params = { grant_type: 'authorization_code', code, access_token: accessToken }
  
    const url = `${FACEBOOK_ACCESS_TOKEN_URL}?${qs.stringify(params)}`
    const headers = { 'Content-Type': 'application/json' }
    const res = await fetch(url, { headers })
     
    if (!res.ok) {
      
      throw Error(res.statusText)
    }
  
    return res.json()
}

async function getFacebookMe(token) {
    let hash = crypto.createHmac('sha256', FACEBOOK_APP_SECRET).update(token).digest('hex');
    var params = { access_token: token , appsecret_proof:hash }
  
    const url = `${FACEBOOK_ME_URL}?${qs.stringify(params)}`
    const headers = { 'Content-Type': 'application/json' }
  
    const res = await fetch(url, { headers })
  
    if (!res.ok) {
      throw Error(res.statusText)
    }
    return res.json()
}

function AddUser(data) { //Parametros de entrada
  //Retorna 0 si hubo error de conexión
  //Retorna 1 si el procedimiento se realizó correctamente
  //Retorna 2 si se encontró el mismo telefono
  var MongoClient = require('mongodb').MongoClient;
  //DbConnection
  //mongodb://localhost:27017

  MongoClient.connect(ClusterCon, function (err, client) {
      //Mongodb Cluster URL
      if (err) {
          console.log("Connection Failed :C")
          console.log(err);
          return 0;
      }
      else {
          var db = client.db('ColectivosDB'); //Base de datos objetivo

          console.log("Connected to db");
          console.log("Intentando crear");

          //StartQuerys
          db.collection('People', function (err, collection) { //Insert
              collection.insert({
                 FBID:data.id,
                 phone:data.phone,
              });
              console.log('Success !')
              db.collection('People').count(function (err, count) {
                  if (err) throw err;

                  console.log('Total Rows: ' + count);
                  client.close;
                  return 1;
              });
          });


      }
  });

}

function UpdateLocation(data){ //Parametros de entrada
  //Retorna 0 si hubo error de conexión
  //Retorna 1 si el procedimiento se realizó correctamente
  var MongoClient = require('mongodb').MongoClient;
  //DbConnection
  //mongodb://localhost:27017
  //mongodb+srv://admin:contra12345@colectivos-hgrqm.mongodb.net/test?retryWrites=true
  console.log('Intentando actualizar ')
  MongoClient.connect(ClusterCon, function (err, client) {
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
          //var ObjectID = require('mongodb').ObjectID; Search by ObjectID
          console.log("Connected to db"); 
          //StartQuerys
          try {
          db.collection('DriverLoc', function (err, collection) { //Insert
              collection.updateOne(
                  {FBID: data.key},
                  {$set: {latitude: data.lat,longitude: data.lon}}
              )               
             
          });
      } catch (e) {
          return 0;
          console.log(e);
       }
                
       return 1;    
  }});
  
}

function GetLocation(id){
  var MongoClient = require('mongodb').MongoClient;
  console.log('Intentando actualizar ')
  MongoClient.connect(ClusterCon, function (err, client) {
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
          //var ObjectID = require('mongodb').ObjectID; Search by ObjectID
          console.log("Connected to db"); 
          //StartQuerys
          try {
              db.collection("DriverLoc").findOne({FBID: id}, function(err, result) {
                  if (err) throw err;
                  return result;
                  db.close();
                }); 
      } catch (e) {
          console.log(e);
       }
                
                  
  }});
}

function GetPeople(id){
    //-1 si hay error
    //1 si se encuentra
    // 0 si no se encontró
      var MongoClient = require('mongodb').MongoClient;
      console.log('Intentando encontrar ')
      MongoClient.connect(ClusterCon, function (err, client) {
                          //Mongodb Cluster URL
          if(err)
          {
              console.log("Connection Failed :C")
              console.log(err);
              return -1;
          }
          else
          {
              var db= client.db('ColectivosDB'); //Base de datos objetivo
              //var ObjectID = require('mongodb').ObjectID; Search by ObjectID
              console.log("Connected to db"); 
              //StartQuerys
              try {
                db.collection('Person', function (err, collection) { //Insert
                    if(collection.find({FBID: id}) == null) {
                        return 0;
                      }
                      else{

                        return 1;
                      }
                });
                
          } catch (e) {
              console.log(e);
           }
                    
                      
      }});
}

function GetRoute(id){
  var MongoClient = require('mongodb').MongoClient;
  console.log('Intentando actualizar ')
  MongoClient.connect(ClusterCon, function (err, client) {
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
          //var ObjectID = require('mongodb').ObjectID; Search by ObjectID
          console.log("Connected to db"); 
          //StartQuerys
          try {
              db.collection("Routes").findOne({routeID: id}, function(err, result) {
                  if (err) throw err;
                  return result;
                  db.close();
                }); 
      } catch (e) {
          console.log(e);
       }
                
                  
  }});
}

function GetAsgR (id){
  var MongoClient = require('mongodb').MongoClient;
  console.log('Intentando actualizar ')
  MongoClient.connect(ClusterCon, function (err, client) {
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
          //var ObjectID = require('mongodb').ObjectID; Search by ObjectID
          console.log("Connected to db"); 
          //StartQuerys
          try {
              dbo.collection("Routes").findOne({routeID: id}, function(err, result) {
                  if (err) throw err;
                  return result;
                  db.close();
                }); 
      } catch (e) {
          console.log(e);
       }
                
                  
  }});
}