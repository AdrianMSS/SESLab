/**
* @description Module and archives used by the server
* @author Adrián Sánchez <sesamaua@gmail.com>
*/

//Required Modules
var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

//REST APIS
var  database = require('./services/database');

/*
Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11
Day of Week: 0-6*/
/*new cronJob('0 59 * * * *', function(){
        //console.log("CronJob")
        organizationImagine.hourScript();
    }, null, true, null);*/
 
var app = express();
app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
//app.use('/hwthon2015', express.static(__dirname + '/hwthon2015'));
app.use(express.static(__dirname + '/webpage'));
app.use('/inscripcion', express.static(__dirname + '/register'));
app.use('/admin', express.static(__dirname + '/admin'));

app.get('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/admin/schedule', database.getSchedule);
app.post('/admin/schedule', database.newSchedule);
app.put('/admin/schedule', database.editSchedule);
app.delete('/admin/schedule', database.removeSchedule);

app.get('/admin/users', database.getUsers);
app.post('/admin/users', database.newUsers);
app.put('/admin/users', database.editUsers);
app.delete('/admin/users', database.removeUsers);

app.get('/admin/signed', database.scheduleSigned);

app.post('/inscripcion/login', database.loginUser);
app.get('/inscripcion/schedule', database.studentsSchedule);
app.get('/inscripcion/user', database.studentsInfo);
app.get('/inscripcion/signed', database.studentsSigned);
app.post('/inscripcion/schedule', database.studentsSign);


/*app.post('/ElectronicsSolutionDevices/', function(res,req){
  database.newData(res,req,'ElectronicsSolutionDevices');
});
app.get('/ElectronicsSolutionDevices/', function(res,req){
  database.getData(res,req,'ElectronicsSolutionDevices');
});

    
app.post('/OvejasElectricas/', function(res,req){
  database.newData(res,req,'OvejasElectricas');
});
app.get('/OvejasElectricas/', function(res,req){
  database.getData(res,req,'OvejasElectricas');
});

    
app.post('/Bulldozer/', function(res,req){
  database.newData(res,req,'Bulldozer');
});
app.get('/Bulldozer/', function(res,req){
  database.getData2(res,req,'Bulldozer');
});

    
app.post('/SmarTicos/', function(res,req){
  database.newData(res,req,'SmarTicos');
});
app.get('/SmarTicos/', function(res,req){
  database.getData(res,req,'SmarTicos');
});

    
app.post('/InnovationSourceCode/', function(res,req){
  database.newData(res,req,'InnovationSourceCode');
});
app.get('/InnovationSourceCode/', function(res,req){
  database.getData(res,req,'InnovationSourceCode');
});

    
app.post('/Envitech/', function(res,req){
  database.newData(res,req,'Envitech');
});
app.get('/Envitech/', function(res,req){
  database.getData(res,req,'Envitech');
});

    
app.post('/Neotronic/', function(res,req){
  database.newData(res,req,'Neotronic');
});
app.get('/Neotronic/', function(res,req){
  database.getData(res,req,'Neotronic');
});

   
app.post('/InfotronicCircuits/', function(res,req){
  database.newData(res,req,'InfotronicCircuits');
});
app.get('/InfotronicCircuits/', function(res,req){
  database.getData2(res,req,'InfotronicCircuits');
});

    
app.post('/Float/', function(res,req){
  database.newData(res,req,'Float');
});
app.get('/Float/', function(res,req){
  database.getData(res,req,'Float');
});

    
app.post('/InDePro/', function(res,req){
  database.newData(res,req,'InDePro');
});
app.get('/InDePro/', function(res,req){
  database.getData(res,req,'InDePro');
});

    
app.post('/LaNaranjaMecanica/', function(res,req){
  database.newData(res,req,'LaNaranjaMecanica');
});
app.get('/LaNaranjaMecanica/', function(res,req){
  database.getData(res,req,'LaNaranjaMecanica');
});

    
app.post('/FrozenbyteKnights/', function(res,req){
  database.newData(res,req,'FrozenbyteKnights');
});
app.get('/FrozenbyteKnights/', function(res,req){
  database.getData(res,req,'FrozenbyteKnights');
});

    
app.post('/Iwa/', function(res,req){
  database.newData(res,req,'Iwa');
});
app.get('/Iwa/', function(res,req){
  database.getData(res,req,'Iwa');
});

    
app.post('/TeamCR/', function(res,req){
  database.newData(res,req,'TeamCR');
});
app.get('/TeamCR/', function(res,req){
  database.getData(res,req,'TeamCR');
});

    
app.post('/NovaMakers/', function(res,req){
  database.newData(res,req,'NovaMakers');
});
app.get('/NovaMakers/', function(res,req){
  database.getData(res,req,'NovaMakers');
});


app.post('/A/', function(res,req){
  database.newData(res,req,'A');
});
app.get('/A/', function(res,req){
  database.getData(res,req,'A');
});

    
app.post('/WIN/', function(res,req){
  database.newData(res,req,'WIN');
});
app.get('/WIN/', function(res,req){
  database.getData(res,req,'WIN');
});

    
app.post('/X/', function(res,req){
  database.newData(res,req,'X');
});
app.get('/X/', function(res,req){
  database.getData(res,req,'X');
});

    
app.post('/Y/', function(res,req){
  database.newData(res,req,'Y');
});
app.get('/Y/', function(res,req){
  database.getData(res,req,'Y');
});

    
app.post('/Z/', function(res,req){
  database.newData(res,req,'Z');
});
app.get('/Z/', function(res,req){
  database.getData(res,req,'Z');
});*/

app.get('*', function (req, res) {
    res.redirect('../#home', 404);
});

// Listening port
var port = Number(process.env.PORT || 9000);
app.listen(port);
console.log('Listening on port ' + port + '...');