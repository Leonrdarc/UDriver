function AddUser(fname,lname,bday,cell,mail,pass,CC,Exp){ //Parametros de entrada
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
            db.collection('users', function (err, collection) { //Insert
                collection.insert({name: fname,
                                 lastname: lname,
                                 Birthday: bday,
                                 CellphoneNumber:cell,
                                 Email:mail,
                                 password:pass,
                                 CCNumber:CC,
                                 ExpDate:Exp
                                 });
                console.log('Success !')
                db.collection('users').count(function (err, count) {
                    if (err) throw err;
                    
                    console.log('Total Rows: ' + count);
                    client.close;
                    return 1;
                });
            });
                  
                    
    }});
    
}