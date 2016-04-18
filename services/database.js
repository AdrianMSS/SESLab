/**
* @description REST Api for the A team
* @author Adrián Sánchez <contact@imaginexyz.com>
*/

var mongo = require('mongodb'),
    nodemailer = require('nodemailer');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  
var uristring = 
  process.env.MONGODB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/SESLab-Curso';


mongo.MongoClient.connect(uristring, function(err, database) {
    if(!err) {
        db = database;
        console.log('Connected to the "SESLab-Curso" database');
    }
    else{
        console.log(404, 'Error Connecting to the "SESLab-Curso" database');
    }
});


//CRUD Administrador
exports.getSchedule = function(req,res) {
    db.collection('Schedule').find({}).toArray(function(err, doc){
        if(err) res.send(400, err);
        res.send(200, doc);
    })
}

exports.newSchedule = function(req, res) {
    var resource = req.body;
    db.collection('Ids').findAndModify({_id:1},{},{$inc:{schedule:1}},function(err, doc_ids) {
        if(err) {throw err;res.send(400, err);};
        resource["_id"] = doc_ids.value.schedule;
        db.collection('Schedule').insert(resource, function(error, doc_project){
            if(error) {throw error;res.send(400, error);};
            res.send(200, resource);
        })
    });
}

exports.editSchedule = function(req, res) {
    var resource = req.body,
        schedule = parseInt(req.body._id);
    db.collection('Schedule').update({_id:schedule}, resource, {upsert: true, new: true},function(err, doc) {
        if(err) {throw err;res.send(400, err);};
        res.send(200, resource);
    });
}

exports.removeSchedule = function(req, res) {
    var schedule = parseInt(req.body._id);
    db.collection('Schedule').findAndRemove({_id:schedule},function(err, result) {
        if(err) throw err;
        res.send(200, result);   
    });
}

//CRUD Usuarios
exports.getUsers = function(req,res) {
    res.send(200, {doc:"hola"});
    /*db.collection('Users').find({}).toArray(function(err, doc){
        if(err) res.send(400, err);
        res.send(200, doc);
    })*/
}

exports.newUsers = function(req, res) {
    var resource = req.body;
    db.collection('Ids').findAndModify({_id:1},{},{$inc:{users:1}},function(err, doc_ids) {
        if(err) {throw err;res.send(400, err);};
        resource["_id"] = doc_ids.value.users;
        db.collection('Users').insert(resource, function(error, doc_project){
            if(error) {throw error;res.send(400, error);};
            res.send(200, resource);
        })
    });
}

exports.editUsers = function(req, res) {
    var resource = req.body,
        users = parseInt(req.body._id);
    db.collection('Users').update({_id:users}, resource, {upsert: true, new: true},function(err, doc) {
        if(err) {throw err;res.send(400, err);};
        res.send(200, resource);
    });
}

exports.removeUsers = function(req, res) {
    var users = parseInt(req.body._id);
    db.collection('Users').findAndRemove({_id:users},function(err, result) {
        if(err) throw err;
        res.send(200, result);   
    });
}

/* Funciones Estudiantes */

exports.loginUser = function(req, res) {
    var mail = req.body.mail;
    db.collection('Users').findOne({mail:mail}, function(error, doc_user){
        if(error) {
            throw error;
            res.send(400, error);
        }
        else if(doc_user){
            res.send(200, doc_user);
        }
        else{
            res.send(500, null);
        }
    })
}

exports.studentsSchedule = function(req, res) {
    db.collection('Schedule').find({}).sort({"type":1,"date":1,"hour":1}).toArray(function(err, doc){
        if(err) res.send(400, err);
        res.send(200, doc);
    })
}

exports.studentsInfo = function(req, res) {
    db.collection('Users').findOne({_id:parseInt(req.query.id)}, function(err, doc){
        res.send(200, doc);
    })
}

exports.studentsSigned = function(req, res) {
    db.collection('Signed').find({}).sort({"type":1,"date":1,"hour":1}).toArray(function(err, doc){
        if(err) res.send(400, err);
        res.send(200, doc);
    })
}

exports.studentsSign = function(req, res) {
    var users = parseInt(req.body.student),
        dateArray = [];
    db.collection('Signed').remove({user:users},function(err, result) {
        if(err) throw err;
        else{
            req.body.signed.forEach(function(element, index){
                var type = parseInt(element.split('D')[0]),
                    date = element.split('D')[1].split('H')[0],
                    hour = parseInt(element.split('H')[1]),
                    user = parseInt(req.body.student),
                    signedArray = [req.body.schedules[type].name, date, hour+':00'],
                    resource = {type:type, date:date, hour:hour, user:user, _id:0};
                dateArray.push(signedArray);
                db.collection('Ids').findAndModify({_id:1},{},{$inc:{signed:1}},function(err, doc_ids) {
                    if(err) {throw err;res.send(400, err);};
                    resource["_id"] = doc_ids.value.signed;
                    db.collection('Signed').insert(resource, function(error, doc_project){
                        if(error) {throw error;res.send(400, error);};
                    })
                });
            });
            var mailText = "Inscripción a los módulos prácticos realizada correctamente. Los horarios seleccionados son:<br><br>";
            dateArray.forEach(function(signed){
                mailText += '<b>' + signed[0] + "</b> el " + signed[1] + " a las " + signed [2] +".<br>";
            });
            mailText += "<br>Le agradecemos su puntualidad a las sesiones prácticas.<br><br>Saludos.";
            var mailOptions = {
                 to: req.body.mail, // receiver
                 subject: 'SESLab: Inscripción a los módulos prácticos', // subject
                 html: mailText // body
                 };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                  console.log(error);
                  res.send(400);
                }else{
                  console.log('Message sent: ' + info.response);
                  res.send(200, {Status:"OK"});
                }
            });
        } 
    });
}

exports.scheduleSigned = function(req, res) {
    db.collection('Schedule').aggregate([
    {$match:{}},
    {$group:{'_id':{'code':'$code','name':'$name','description':'$description','type':'$type'}}},
    { "$sort": { "_id.type": 1 } }], function(err, doc_res) {
        if(err) throw err;
        if (!doc_res) {
            console.log("No document found");
        }           
        else {
            var schedules = {};
            doc_res.forEach(function(element, index){
                schedules[element._id.type] = element._id;
            });
            db.collection('Signed').find({}).sort({"type":1,"date":1,"hour":1}).toArray(function(err2, doc2){
                if(err2) res.send(400, err2);
                var students = {};
                db.collection('Users').find({}).toArray(function(err3, doc3){
                    if(err3) res.send(400, err3);
                    doc3.forEach(function(student){
                        students[student._id] = student;
                    });
                    res.send(200, {signed:doc2, schedules:schedules, students:students});
                })           
            })           
        }
    });
}

/*db.collection('MetricasAutomoviles').aggregate([
    {$match:{ID:req.body.car}},
    {$group:{'_id':{'ID':'$ID','month':'$month','year':'$year'}, 'totalPaid':{$sum:'$amount'}, 'totalLiters':{$sum:'$liters'}, 'firstKm':{$min:'$km'}, 'lastKm':{$max:'$km'}}},
    { "$sort": { "_id.month": 1 } }], function(err, doc_res) {

        if(err) throw err;

        if (!doc_res) {
            console.log("No document found");
            
        }           
        else {
            res.send(200, doc_res);
        }
    });*/


/* Info Util para Utilizar NodeMailer, OAuth2 y Gmail

http://stackoverflow.com/questions/24098461/nodemailer-gmail-what-exactly-is-a-refresh-token-and-how-do-i-get-one
https://developers.google.com/identity/protocols/OAuth2

*/

var generator = require('xoauth2').createXOAuth2Generator({
    user: 'lab.sistemas.electronicos@gmail.com',
    clientId: '998247946859-v42tdkca84l13v7kd3bohk3kvlduldev.apps.googleusercontent.com',
    clientSecret: 'a74y01J4pEyNxWL2fsRhIQ2y',
    refreshToken: '1/WI6bEgvnWwRA9HFbbPPGjGoOisi_slec-WpmexUp5Vs',
    accessToken: 'ya29..vgJf0FtHP_i3IfeiMszBg8Xhvw9HkqmHLGWFcJNjADJTLRuPF1Lro3cPMEvFofoaPA' // optional
});

generator.on('token', function(token){
});

var transporter = nodemailer.createTransport(({
    service: 'gmail',
    auth: {
        xoauth2: generator
    }
}));

