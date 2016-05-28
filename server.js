'use strict';
var express = require('express');
var path = require('path');
var net = require('net');
var tls = require('tls');
var https = require('https');
var httpProxy = require('http-proxy');
var path = require('path');
var publicPath = path.resolve(__dirname, 'public');
var bodyParser = require('body-parser');
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var config = require('./config.json');
var fs = require('fs');
var S3FS = require('s3fs');
var multiparty = require('connect-multiparty')();

// We need to add a configuration to our proxy server,
// as we are now proxying outside localhost
var proxy = httpProxy.createProxyServer({
    changeOrigin: true
});

// var options = {
//    key: fs.readFileSync('./key.pem', 'utf8'),
//    cert: fs.readFileSync('./server.crt', 'utf8'),
//    requestCert: true,
//    NPNProtocols: ['http/2.0', 'spdy', 'http/1.1', 'http/1.0']
// };

var app = express();
// var httpsServer = https.createServer(options, app);
// var tlsServer = tls.createServer(options, function (cleartextStream) {
//     var cleartextRequest = net.connect({
//         port: 3000,
//         host: '127.0.0.1'
//     }, function () {
//         cleartextStream.pipe(cleartextRequest);
//         cleartextRequest.pipe(cleartextStream);
//     });
// });

//serving our index.html
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extened: true}));


//server/compiler.js runs webpack-dev-server which creates the bundle.js which index.html serves
//the compiler adds some console logs for some extra sugar
//notice that you will not see a physical bundle.js because webpack-dev-server runs it from memory
if (!isProduction) {
    var bundle = require('./server/compiler.js');
    bundle();
    // express now processes all requests to localhost:8080
    // app.all is a special routing method used for loading middleware functions
    app.all('/build/*', function(req, res) {
        proxy.web(req, res, {
            target: 'http://localhost:8080'
        });
    });
}


//THIS IS ALL FILE UPLOAD STUFFFFFF=============================================
var s3fsImplementation1 = new S3FS('hackerhabitatavatars', {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    endpoint: config.endpoint,
    region: config.region
});

var s3fsImplementation2 = new S3FS('hackerhabitatlistings', {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    endpoint: config.endpoint,
    region: config.region
});

app.use(multiparty);
app.post('/v1/ap', function(req, res) {
    var file = req.files.file;
    var stream = fs.createReadStream(file.path);

    return s3fsImplementation1.writeFile(file.originalFilename, stream)
        .then(function() {
            fs.unlink(file.path, function(err) {
                if (err) {
                    console.log('Error');
                }
                console.log('Success');
            });
            res.send('File Upload Complete');
        });
});

app.post('/v1/lp', function(req, res) {
    var file = req.files.file;
    var stream = fs.createReadStream(file.path);

    return s3fsImplementation2.writeFile(file.originalFilename, stream)
        .then(function() {
            fs.unlink(file.path, function(err) {
                if (err) {
                    console.log('Error');
                }
                console.log('Success');
            });
            res.send('File Upload Complete');
        });
});
//THIS IS ALL FILE UPLOAD STUFFFFFF=============================================


proxy.on('error', function(e) {
    console.log('Could not connect to proxy, please try again...');
});

app.listen(port, function() {
    console.log('Server running on port ' + port);
});
// httpsServer.listen(port, function () {
//   console.log('Server running on port ' + port);
// });
// tlsServer.listen(port, function () {
//   console.log('Server running on port ' + port);
// });
