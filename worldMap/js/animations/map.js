var Map = (function () {
    "use strict";

    var slideIn = function () {

        $("#latLine").animate({
            'top': '260px'
        }, 400);

        setTimeout(function () {
            $("#lonLine").animate({
                'left': '370px'
            }, 400);
        }, 50);

        animateCross();
    };

    function animateCross() {

        var left = 0, top = 0;

        setTimeout(function () {

            var split = $('#lonLat').text().split(' ');


            left = split[1].slice(0, -1);
            top = split[3].slice(0, -1);

            left = calculateLeft(left);
            top = calculateTop(top);

            $("#crossVertical").animate({
                'left': '1700px',
                'top': '600px',
                'opacity': 1
            }, 1000, function () {
                $(this).animate({
                    'left': '1100px',
                    'top': '400px'
                }, 1000, function () {


                    var vertTop = top - 150;

                    if (vertTop < 300) {

                        vertTop = 300;
                    }

                    if (vertTop > 525) {
                        vertTop = 525;
                    }

                    $(this).animate({
                        'top': vertTop + 'px',
                        'left': left + 'px',
                        'width': '2px'
                    }, 500, function () {
                        $(this).animate({
                            'opacity': 0
                        }, 250, function () {
                            $(this).animate({
                                'opacity': 1
                            }, 250);
                        });
                    });
                });
            });

            $("#crossHorizontal").animate({
                'top': '650px',
                'left': '1450px',
                'opacity': 1
            }, 1000, function () {
                $(this).animate({
                    'top': '630px',
                    'left': '950px'
                }, 1000, function () {


                    var horLeft = left - 150;

                    if (horLeft < 400) {
                        horLeft = 400;
                    }

                    if(horLeft > 1360){
                        horLeft = 1360;
                    }


                    $(this).animate({
                        'top': top + 'px',
                        'left': horLeft + 'px',
                        'height': '2px'
                    }, 500, function () {
                        $(this).animate({
                            'opacity': 0
                        }, 250, function () {
                            $(this).animate({
                                'opacity': 1
                            }, 250);
                        });
                    });
                });
            });

        }, 3000);


        /*setTimeout(function(){
            $("#crossHorizontal").animate({
                'left': '400px',
                'top': '350px',
                'opacity': 0,
                'height': '1px'
            });
        }, 30000);

        setTimeout(function(){
            $("#crossVertical").animate({
                'left': '300px',
                'top': '500px',
                'opacity': 0,
                'width': '1px'
            });
        }, 30000);*/
    }

    function calculateLeft(long) {

        var containerWidth = 1480;

        long = parseInt(long);


        long += 180;

        long = (((long * containerWidth) / 360) + 380);


        return long;
    }

    function calculateTop(lat) {


        var containerHeight = 745;


        if (lat.indexOf('-') === -1) {
            lat = "-" + lat;
        } else {
            lat = lat.split('-')[1];
        }

        lat = parseInt(lat);

        lat += 90;

        lat = (((lat * containerHeight) / 180) + 290);


        return lat;
    }

    return {
        slideIn: slideIn
    };

})();

module.exports = Map;