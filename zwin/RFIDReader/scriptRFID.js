/**
 * Created by arno.chauveau on 1/6/2016.
 */
var https = require('https');
var settings = require('./settings');
var app = require('http').createServer();
var io = require('socket.io')(app);
var phidgets = require('./phidgets');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";//ocularium test server is self-signed

phidgets.start();
phidgets.on('ready', function () {
    phidgets.on('state_changed', onPhidgetStateChanged);
    function onPhidgetStateChanged(RFID) {

        //turn off the LED if no tag is present
        if (RFID.tagState == 0) {
            RFID.LEDOn = 1;
            return;
        }

        var tagIsValid = RFID.tag2 && RFID.tag2.tag != undefined;
        var isNotScanning = RFID.tagState == 1 && RFID.LEDOn == 1;
        if (tagIsValid && isNotScanning) {

            var presentTag = RFID.tag2.tag;
            RFID.LEDOn = 0;

            var hasClientsConnected = io.engine.clientsCount > 0;
            if (!hasClientsConnected) {
                console.log('tag scanned but no apps are online');
                return;
            }

            if (lastTag == presentTag) {
                console.log('same tag, sending message to the app');
                io.emit('same_tag');
                return;
            }
            getDataFromTagAsync(presentTag, onDataReceived);

            function onDataReceived(data) {

                var tagIsNotValid = data == null;

                //console.log(data);

                if (tagIsNotValid) {
                    console.log('invalid tag detected ' + RFID.tag2.tag);
                    io.emit('invalid_tag');
                    return;
                }

                console.log('new tag with id ' + presentTag + ' getting data from API');
                io.emit('new_tag', data);

                if (!currentTag)
                    currentTag = presentTag;
            }

        }
    }
});

var lastTag, currentTag = false;
startRFIDReader();
app.listen(8081);

console.log('Server started, awaiting app connection');

io.on('connection', socketConnected);

function startRFIDReader() {

}

function socketConnected(socket) {

    console.log('App connected');
    socket.on('message', function (data) {
        console.log(data.data);
    });
    socket.on('disconnect', onAppDisconnect);
    socket.on('game_over', onGameOver);

    function onGameOver(data) {
        (function (currentTag) {
            lastTag = currentTag;
        })(currentTag);

        var options = {
            hostname: settings.OculariumServerIP,
            path: '/ocularium/api/zwin/savescore/' + data.score + '/' + data.exhibitid + '/' + data.visitorid,
            method: 'GET',
            rejectUnauthorized: false
        };

        var req = https.get(options, onResponseReceived);
        req.on('error', onRequestError);

        function onResponseReceived(res) {
            socket.emit('score_saved_complete');
        }
        function onRequestError(error) {
            //socket.emit('score_saved_error');
        }
    }

    function onAppDisconnect() {
        console.log('app disconnected');
    }

}
function getDataFromTagAsync(tag, callback) {

    var options = {
        hostname: settings.OculariumServerIP,
        path: '/ocularium/api/zwin/get/' + tag + '/1',
        method: 'GET',
        rejectUnauthorized: false
    };
    console.log('tag detected, getting data');
    var req = https.get(options, onResponseReceived);

    req.on('error', onRequestError);

    function onResponseReceived(res) {
        var data = null;

        res.on('data', function (d) {
            if (!data) {
                data = new Buffer(d);
                return;
            }
            data = Buffer.concat([data, new Buffer(d)]);
        });

        res.on('end', function () {
            data = JSON.parse(data.toString()).data;

            callback(data);
        });
    }

    function onRequestError(error) {
        console.log('error');
    }
}






