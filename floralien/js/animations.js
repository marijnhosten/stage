var Animations = (function () {
    "use strict";

    var step3Slider = function () {
        genericSlider("#/", "#loadingEnd");
    };

    function genericSlider(nextStep, id) {
        var fg = $(id), val = 140;
        fg.css({
            'width': '0',
            "-webkit-clip-path": "inset(0px 0px 0px 0px)"
        });

        var intervalId = setInterval(function () {
            val -= 1;
            fg.css({
                'width': '140px',
                "-webkit-clip-path": "inset(0px " + val + "px 0px 0px)"
            });

            if (val === 0) {
                clearInterval(intervalId);
                fg.css({
                    'width': '0',
                    "-webkit-clip-path": "inset(0px 0px 0px 0px)"
                });
                document.location.href = nextStep;
            }
        }, 430);
    }

    var tutorialAnimations = function () {
        var white = $(".scene");
        var startLeft = "21.5%";

        startThumbAnimations();

        if (document.location.href.indexOf("step1_2") > -1) {
            var anim1 = setTimeout(function () {
                dragToRight(white, 90);
                dragToRight(white, 75);
                dragToRight(white, 90);
                clearTimeout(anim1);
            }, 2000);
        }


        if (document.location.href.indexOf("step1_2") > -1) {
            var anim2 = setTimeout(function () {
                prepareAnim(white, 30, startLeft);
                dragToRight(white, 40);
                clearTimeout(anim2);
            }, 7000);
        }


        if (document.location.href.indexOf("step1_2") > -1) {
            var anim3 = setTimeout(function () {
                prepareAnim(white, 65, startLeft);
                dragToRight(white, 35);
                clearTimeout(anim3);
            }, 9500);
        }

        if (document.location.href.indexOf("step1_2") > -1) {
            var finish = setTimeout(function () {
                finishAnim(white);
                clearTimeout(finish);
            }, 12500);
        }
    };

    function dragToRight(white, distance) {
        white.animate({
            left: distance + "%"
        }, 1500, function () {
        });
    }

    function prepareAnim(white, top, startLeft) {
        white.animate({
            left: startLeft,
            top: top + "%"
        }, 1500, function () {

        });
    }

    function finishAnim(white) {
        white.animate({
            left: '84%',
            top: '85%'
        }, 2000);
    }


    function startThumbAnimations() {


        if (document.location.href.indexOf("step1_2") > -1) {
            var anim2 = setTimeout(function () {
                thumbAnimation($("#tutorThumb2"), 2, 41, 250);
                clearTimeout(anim2);
            }, 8500);
        }

        /*if(document.location.href.indexOf("step1_2")>-1) {
         var anim3 = setTimeout(function () {
         thumbAnimation($("#tutorThumb3"), 3, 85, 630);
         clearTimeout(anim3);
         }, 11000);
         }*/

        if (document.location.href.indexOf("step1_2") > -1) {
            var anim4 = setTimeout(function () {
                thumbAnimation($("#tutorThumb4"), 4, 30, 165);
                clearTimeout(anim4);
            }, 11500);
        }

        /*if(document.location.href.indexOf("step1_2")>-1) {
         var anim5 = setTimeout(function () {
         thumbAnimation($("#tutorThumb5"), 5, 40, 240);
         clearTimeout(anim5);
         }, 20000);
         }*/
    }

    function thumbAnimation(thumb, index, thumbDistance, valDistance) {
        positionThumb(thumb, thumbDistance, index);
        positionRangeValue(index, valDistance);
    }

    function positionThumb(thumb, thumbDistance, index) {

        calculateValue(thumb, index);
        clipSlider(thumb, index);

        thumb.animate({
            left: thumbDistance + "%"
        }, 1500);
    }

    function clipSlider(thumb, index) {

        var clipValue = 0, i = 3000;

        if (document.location.href.indexOf("step1_2") > -1) {
            var interval = setInterval(function () {

                clipValue = (860 - thumb.position().left);
                $("#tutBlackImg" + index).css({
                    "-webkit-clip-path": "inset(0px " + clipValue + "px 0px 0px)"
                });
                i -= 3;
                if (i === 0) clearInterval(interval);


            }, 10);
        }
    }

    function positionRangeValue(index, distance) {

        var value = $("#tutSlider" + index + " .rangeValue");

        value.animate({
            left: distance + "%"
        }, 1500);
    }

    function calculateValue(thumb, index) {

        var percentage, rangeValue = 0, i = 3000;

        if (document.location.href.indexOf("step1_2") > -1) {
            var interval = setInterval(function () {

                percentage = thumb.position().left / 800 * 100;

                if (index === 1) {
                    rangeValue = Math.round(percentage / 100 * (16 - 8) + 8);
                }
                if (index === 2) {
                    rangeValue = Math.round(percentage / 100 * (10 - 5) + 5);
                }
                if (index === 3) {
                    rangeValue = Math.round(percentage / 100 * (30 - 10) + 10);
                }
                if (index === 4) {
                    rangeValue = Math.round(percentage / 100 * (15 - 2) + 2);
                }
                if (index === 5) {
                    rangeValue = Math.floor(Math.round(percentage / 100 * (894 - 380) + 380));
                }

                if (percentage > 0 && percentage < 101) {
                    $("#tutSlider" + index + " .rangeValue .strong").text(rangeValue);
                }

                i -= 30;

                if (i === 0) clearInterval(interval);
            }, 100);
        }
    }

    var slideInGame = function () {
        var blocks = $(".game");

        $.each(blocks, function () {
            slideInBlock(blocks);
        });

    };

    function slideInBlock(blocks) {

        $(blocks[0]).animate({
            'width': '100%'
        }, 500);

        var tmr1 = setTimeout(function () {
            $(blocks[1]).animate({
                'width': '100%'
            }, 500);
            clearTimeout(tmr1);
        }, 100);

        var tmr2 = setTimeout(function () {
            $(blocks[2]).animate({
                'width': '100%'
            }, 500);
            clearTimeout(tmr2);
        }, 200);

        var tmr3 = setTimeout(function () {
            $(blocks[3]).animate({
                'width': '100%'
            }, 500);
            clearTimeout(tmr3);
        }, 300);

        var tmr4 = setTimeout(function () {
            $(blocks[4]).animate({
                'width': '100%'
            }, 500);
            clearTimeout(tmr4);
        }, 400);


    }

    var slideInInfo = function () {
        var blocks = $(".end");
        $.each(blocks, function () {
            slideInEndblock(blocks);

        });
    };

    function slideInEndblock(blocks) {
        $(blocks[0]).animate({
            'width': '100%'
        }, 500);

        var tmr1 = setTimeout(function () {
            $(blocks[1]).animate({
                'width': '100%'
            }, 500);
            clearTimeout(tmr1);
        }, 100);

        var tmr2 = setTimeout(function () {
            $(blocks[2]).animate({
                'width': '100%'
            }, 500);
            clearTimeout(tmr2);
        }, 200);

        var tmr3 = setTimeout(function () {
            $(blocks[3]).animate({
                'width': '100%'
            }, 500);
            clearTimeout(tmr3);
        }, 300);

        var tmr4 = setTimeout(function () {
            $(blocks[4]).animate({
                'width': '100%'
            }, 500);
            clearTimeout(tmr4);
        }, 400);


        //var tmr5 = setTimeout(function () {
        $(blocks[5]).animate({
            'opacity': 1
        }, 500);
        //clearTimeout(tmr5);
        //}, 500);

        var tmr6 = setTimeout(function () {
            $(blocks[6]).animate({
                'opacity': 1
            }, 500);
            clearTimeout(tmr6);
        }, 100);

        var tmr7 = setTimeout(function () {
            $(blocks[7]).animate({
                'opacity': 1
            }, 500);
            clearTimeout(tmr7);
        }, 200);

        var tmr8 = setTimeout(function () {
            $(blocks[8]).animate({
                'opacity': 1
            }, 500);
            clearTimeout(tmr8);
        }, 300);

        var tmr9 = setTimeout(function () {
            $(blocks[9]).animate({
                'opacity': 1
            }, 500);
            clearTimeout(tmr9);
        }, 400);
    }

    return {
        step3Slider: step3Slider,
        tutorialAnimations: tutorialAnimations,
        slideInGame: slideInGame,
        slideInfo: slideInInfo
    };

})();


