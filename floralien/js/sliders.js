var Slider = (function () {

    "use strict";

    var makeSlidersSlideable = function () {

        var sliders = [$("#slider1"), $("#slider2"), $("#slider3"), $("#slider4"), $("#slider5")];
        var thumbs = [$("#thumb1"), $("#thumb2"), $("#thumb3"), $("#thumb4"), $("#thumb5")];

        interact(".draggable").draggable({
            inertia: false,
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: {top: 0, left: 1, bottom: 0, right: 0}
            },
            autoScroll: false,
            max: Infinity,
            onmove: dragMoveListener,
            onend: function (event) {

            }
        });

        interact.maxInteractions(Infinity);

        function dragMoveListener(e) {
            var index = parseFloat(e.target.id.split('g')[1]) - 1;
            var thumb = "#thumb" + parseFloat(e.target.id.split('g')[1]);

            positionThumb(e, thumb, index);
            positionRangeValue(thumb, index);
            calculateValue(thumb, index);
        }


        $.each(thumbs, function (index, thumb) {
            sliders[index].on("mousedown", function (e) {
                positionThumb(e, thumb, index);
                positionRangeValue(thumb, index);
                calculateValue(thumb, index);
            });
        });


        function positionThumb(e, thumb, index) {

            var number = index + 1;
            var draggerWidth = $(".thumbDrag").css('width').split('p')[0];
            var xPos = (e.pageX - 380) - draggerWidth / 2;
            var thumbPos;

            if (xPos > -80 && xPos < 930) {

                $("#thumbDrag" + number).css({
                    "left": xPos
                });
                thumbPos = xPos + draggerWidth / 2 - 10;
                $(thumb).css({"left": thumbPos});
            }

            if (xPos <= -60) {

                $("#thumbDrag" + number).css({
                    "left": "-65px"
                });
                thumbPos = 0;
                $(thumb).css({"left": thumbPos});

            }

            if (xPos >= 910) {

                $("#thumbDrag" + number).css({
                    "left": 930
                });
                thumbPos = 980;
                $(thumb).css({"left": thumbPos});

            }

            var clipValue = (990 - $(thumb).position().left);
            $("#blackImg" + number).css({
                "-webkit-clip-path": "inset(0px " + clipValue + "px 0px 0px)"
            });


        }

        function positionRangeValue(thumb, index) {

            var value = $("#slider" + (++index) + " .rangeValue");
            var rangeLeft = value.position().left;
            var thumbLeft = $(thumb).position().left;

            if (rangeLeft > -100) {
                if (thumbLeft <= 980) {
                    value.css({
                        "left": thumbLeft - 95
                    });

                }
            }
        }

        function calculateValue(thumb, index) {

            var percentage = $(thumb).position().left / 915 * 100;
            var rangeValue = 0;

            if (index === 0) {
                rangeValue = Math.round(percentage / 100 * (16 - 8) + 8);
            }
            if (index === 1) {
                rangeValue = Math.round(percentage / 100 * (10 - 5) + 5);
            }
            if (index === 2) {
                rangeValue = Math.round(percentage / 100 * (30 - 10) + 10);
            }
            if (index === 3) {
                rangeValue = Math.round(percentage / 100 * (15 - 2) + 2);
            }
            if (index === 4) {
                rangeValue = Math.floor(Math.round(percentage / 100 * (894 - 380) + 380));
            }

            if (percentage > 0 && percentage < 101) {
                $("#slider" + (++index) + " .rangeValue .strong").text(rangeValue);
            }

        }
    };

    var makeSlidersUnslideable = function () {
        $(".endTimer").css({"display": "block"});
    };

    return {
        startSliders: makeSlidersSlideable,
        stopSliders: makeSlidersUnslideable
    };
})();
