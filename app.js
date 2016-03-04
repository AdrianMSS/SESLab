/**
* @description Module and archives used by the server
* @author Adrián Sánchez <asanchez@seslab.org>
*/

//Required Modules
var express = require('express'),
    bodyParser = require('body-parser');

var app = express();
app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser());

app.use(express.static(__dirname + '/webpage'));


app.get('/aulavirtual', function (req, res) {
    res.writeHead(301,
	  {Location: 'http://seslab.org/aulavirtual/'}
	);
	res.end();
});

app.get('/aulavirtual/*', function (req, res) {
    res.writeHead(301,
	  {Location: 'http://seslab.org/aulavirtual/'}
	);
	res.end();
});

app.get('*', function (req, res) {
    res.redirect('/index.html', 404);
});

// Listening port
var port = Number(process.env.PORT || 9000);
app.listen(port);
console.log('Listening on port ' + port + '...');