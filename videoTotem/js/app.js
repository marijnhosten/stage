require('./screensaver');

var menu = require('./menu');
var exploreBarco = require('./exploreBarco/exploreBarco');
var registration = require('./registration/registration');
var barcoApi = require('./BarcoAPI/barcoApi.js');
var navCircles = require('./navCircles.js');

menu.on('exploreBarcoClicked', onExploreBarcoClicked);
menu.on('registrationClicked', onregistrationClicked);

$('#screensaver').on('click', onExploreBarcoClicked);

barcoApi.start();



function onExploreBarcoClicked() {
    $("#screensaver").addClass('page_hidden');
    showName();
    exploreBarco.start();
}
function onregistrationClicked() {
    showName();
    registration.start();
    registration.on('finished', registration.finish);
}

function showName() {
    $('.nameContainer').removeClass('hidden');
}
