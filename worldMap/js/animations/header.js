var Header = (function () {
    "use strict";

    var slideIn = function () {

        var borders = $("#title");

        $(borders).animate({
            'width': '95%'
        }, 1500, 'linear');

        var nameWidth = 0;
        var nameInterval = setInterval(function () {

            $('#targetName').css({
                'width': nameWidth + 'px'
            });

            if (nameWidth < 740) {
                nameWidth += 10;

            } else {
                clearInterval(nameInterval);
            }

        }, 50);

        var dateWidth = 0;
        var dateInterval = setInterval(function () {

            $('#dateP').css({
                'width': dateWidth + 'px'
            });

            if (dateWidth < 250) {
                dateWidth += 10;

            } else {
                clearInterval(dateInterval);
            }
        }, 50);

        var locationWidth = 0;

        setTimeout(function () {

            var locationInterval = setInterval(function () {

                $('#locationName').css({
                    'width': locationWidth + 'px'
                });

                if (locationWidth < 650) {
                    locationWidth += 10;

                } else {
                    clearInterval(locationInterval);
                }

            }, 50);
        }, 3000);

        /*setTimeout(function(){
            $('#locationName').css({
                'width': '0'
            });
        }, 30000);*/

        var coordWidth = 0;
        var coordInterval = setInterval(function () {

            $('#coordP').css({
                'width': coordWidth + 'px'
            });

            if (coordWidth < 250) {
                coordWidth += 10;

            } else {
                clearInterval(coordInterval);
            }
        }, 50);


        setTimeout(function(){

            var lonWidth = 0;
            var lonInterval = setInterval(function () {

                $('#lonLat').css({
                    'width': lonWidth + 'px'
                });

                if (lonWidth < 550) {
                    lonWidth += 10;

                } else {
                    clearInterval(lonInterval);
                }
            }, 50);

        }, 1000);

        var localTimeWidth = 0;
        var localTimeInterval = setInterval(function () {

            $('#localTimeH').css({
                'width': localTimeWidth + 'px'
            });

            if (localTimeWidth < 130) {
                localTimeWidth += 10;

            } else {
                clearInterval(localTimeInterval);
            }
        }, 50);

        $('#time').animate({
            'opacity': 1
        }, 1000);

        $('#cycle').animate({
            'opacity': 0.6
        }, 1000);

    };

    return {
        slideIn: slideIn
    };

})();

module.exports = Header;