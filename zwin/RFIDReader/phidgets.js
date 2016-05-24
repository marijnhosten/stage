/**
 * Created by arno.chauveau on 2/1/2016.
 */
const EventEmitter = require('events');
module.exports = new EventEmitter();

var os = require('os');
var settings = require('./settings');
var exec = require('child_process').spawn;

var Phidget = require('phidgetapi').RFID;
var RFID = new Phidget;

var RFIDConnectionSettings = {
    host: 'localhost',
    port: 5001,
    type: 'RFID'
};

function start() {
    runPhidgetsWebserver();
    connectToPhidgets();
}

module.exports.start = start;

function runPhidgetsWebserver() {
    console.log(os.type());
    if(os.type() == 'Windows_NT'){
        console.log('windows OS detected, starting phidgets webserver');
        exec(settings.PhidgetsPathWINDOWS)
    }
    else{
        console.log('NIX OS detected, starting phidgets webserver');
        //exec(settings.PhidgetsPathNIX);
    }
}

function connectToPhidgets() {

    RFID.connect(RFIDConnectionSettings);
    RFID.whenReady(setupBoard);
    RFID.whenDisconnected(disconnected);

    function setupBoard() {
        console.log('RFID reader connected, ready for reading');
        module.exports.emit('ready');
        RFID.observeBoard(onRFIDStateChanged);
        //turn on the antenna when available and blink the LED so we know it is ready.
        RFID.antennaOn = 1;
        RFID.LEDOn = 1;
        setTimeout(
            function () {
                RFID.LEDOn = 0;
            },
            250
        )
    }

    function onRFIDStateChanged() {

        module.exports.emit('state_changed',RFID);

    }

    function disconnected() {
        console.log('RFID connection lost. ');

    }

}


