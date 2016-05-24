/**
 * Created by arno.chauveau on 4/19/2016.
 */

var https = require('https');
var path = require("path");
var express = require('express');
var app = express();

app.listen(3000);
//10.200.10.6:8088

app.use(express.static(__dirname + '/../js'));
app.use(express.static(__dirname + '/../css'));
app.use("/assets", express.static(__dirname + '/../assets'));
app.get('/', function (req, resp) {
    resp.sendFile(path.join(__dirname + '/../index.html'));
});
app.get('/XManagerWeb/Xynco/handlers/assets.ashx', function (req, resp) {


    var options = {
        hostname: 'rna.barco.com',
        path: '/XManagerWeb/Xynco/handlers/assets.ashx?method=' + req.query.method + '&nid=' + req.query.nid,
        method: 'GET',
        rejectUnauthorized: false
    };
    var data = null;
    var req = https.get(options, onResponseReceived);

    req.on('error', onRequestError);

    function onResponseReceived(res) {


        res.on('data', function (d) {
            if (!data) {
                data = new Buffer(d);
                return;
            }
            data = Buffer.concat([data, new Buffer(d)]);
        });

        res.on('end', function () {
            if(data){
                data = JSON.parse(data.toString());
                console.log(data);
                resp.json(data);
            }

        });
    }

    function onRequestError(error) {
        console.log(error);
    }

});
