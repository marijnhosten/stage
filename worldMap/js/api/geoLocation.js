var GeoLocation = (function(){

    "use strict";
    // http://dev.virtualearth.net/REST/v1/Locations?countryRegion=countryRegion
    // &adminDistrict=adminDistrict&locality=locality&postalCode=postalCode&addressLine=addressLine
    // &userLocation=userLocation&userIp=userIp&usermapView=usermapView&includeNeighborhood=includeNeighborhood
    // &maxResults=maxResults&key=BingMapsKey

    var BING_MAPS_KEY = "&key=Hm0a1KFz9EV8IAqJEajc~xUj9JXZBCNuXAEAsYiVovw~AsX-y_j7KiiYVNzTCkZmx62dBQgEcyRaNAHOVJS8sDyhOqxOz5haFCsdpXtDVcmc";
    var BING_URL = "http://dev.virtualearth.net/REST/v1/Locations?countryRegion=";

    var init = function(){};


    var getLongLatFromCountry = function(country){

        var url = BING_URL + country + BING_MAPS_KEY + "&jsonp=?";

        $.getJSON(url, function(result) {
            var lon, lat;

            lat = Math.round( result.resourceSets[0].resources[0].geocodePoints[0].coordinates[0] * 100) / 100;
            lon = Math.round(result.resourceSets[0].resources[0].geocodePoints[0].coordinates[1] * 100) / 100;


            $('#lonLat').text('Long: ' + lon + '° Lat: '  + lat + '°');
        });
    };


    return {
        init: init,
        getLonLatFromCountry: getLongLatFromCountry
    };

})();

module.exports = GeoLocation;