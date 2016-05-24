var fillData = (function () {
    "use strict";


    var loadName = function (name) {
        $('#userName').text(name);
    };

    var loadLocation = function (location) {
        $('#userLocation').text(location);
    };

    var loadDate = function () {
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = '0' + month;
        }

        $('#date').text(day + '/' + month + '/' + year);
    };

    var loadTime = function () {

        var date = new Date();
        var hour = date.getHours();
        var minutes = date.getMinutes();

        if(hour < 10){
            hour = '0' + hour;
        }

        if(minutes < 10){
            minutes = '0' + minutes;
        }

        $('.hour').text(hour);
        $('.minute').text(minutes);

        setInterval(function(){

            var date = new Date();
            var hour = date.getHours();
            var minutes = date.getMinutes();

            if(hour < 10){
                hour = '0' + hour;
            }

            if(minutes < 10){
                minutes = '0' + minutes;
            }

            $('.hour').text(hour);
            $('.minute').text(minutes);
        }, 1000);


    };

    return {
        loadName: loadName,
        loadLocation: loadLocation,
        loadDate: loadDate,
        loadTime: loadTime
    };

})();

module.exports = fillData;