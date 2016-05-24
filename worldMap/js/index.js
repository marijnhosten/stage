// entry point: world_map/dist/js/app.min.js

var geo = require("../../js/api/geoLocation.js");
var cycleLetters = require("../../js/animations/cycleLetters.js");
var fillData = require("../../js/data/fillData.js");
var headerAnim = require("../../js/animations/header.js");
var mapAnim = require("../../js/animations/map.js");

//cycleLetters.animateName("0x022EBC46");


headerAnim.slideIn();
geo.getLonLatFromCountry("Belgium");
fillData.loadName("Marijn Hosten");
fillData.loadLocation("Belgium");
fillData.loadDate();
fillData.loadTime();
mapAnim.slideIn();


setInterval(function(){
    location.reload();
}, 30000);
