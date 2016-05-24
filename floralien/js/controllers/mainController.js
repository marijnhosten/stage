(function () {
    "use strict";

    var mainController = function ($scope, $location) {


        if ($location.path().indexOf("step1_") == -1) {
            $scope.page = "main";
        }

        if ($location.path().indexOf("step1_") > -1) {
            loadJson(localStorage.getItem("lang"));
        }

        if ($location.path().indexOf("step2") > -1) {
            $(".logo img").attr("draggable", false);
            loadJson(localStorage.getItem("lang"));
            Slider.startSliders();
            Animations.slideInGame();

            var lockScreen = $(".lockScreen");
            lockScreen.css({'display': 'block'});

            var wait = setTimeout(function () {
                clearTimeout(wait);
                setTimer();
                lockScreen.css({'display': 'none'});
            }, 2000);

        }

        if ($location.path().indexOf("step3") > -1) {
            loadJson(localStorage.getItem("lang"));
            fillValues();
            Animations.slideInfo();


            setSmallTimer();
        }

        function setSmallTimer() {
            var tmrSmall = $(".timerKlein");

            tmrSmall.text("01:00");
            startSmallTimer(59, tmrSmall);

        }

        function loadPlant(arr) {
            calculateStadia(arr);
        }

        function calculateStadia(arr) {

            var hours, water, temp, licht, co2;

            $.each(arr, function (index, value) {
                if (index === 0) {
                    if (value === 8) {
                        hours = 0;
                    }
                    if (value <= 16 && value >= 13) {
                        hours = 0;
                    }
                    if (value === 9) {
                        hours = 1;
                    }
                    if (value === 10) {
                        hours = 2;
                    }
                    if (value === 11) {
                        hours = 4;
                    }
                    if (value === 12) {
                        hours = 5;
                    }
                }

                if (index === 1) {
                    if (value === 5 || value === 6) {
                        water = 1;
                    }
                    if (value === 7) {
                        water = 2;
                    }
                    if (value === 8) {
                        water = 3;
                    }
                    if (value === 9) {
                        water = 4;
                    }
                    if (value === 10) {
                        water = 5;
                    }
                }

                if (index === 2) {
                    if (value <= 18) {
                        temp = 1;
                    }
                    if (value > 25 && value < 31) {
                        temp = 2;
                    }
                    if (value > 21 && value < 24) {
                        temp = 3;
                    }
                    if (value > 17 && value < 21) {
                        temp = 4;
                    }
                    if (value > 19 && value < 22) {
                        temp = 5;
                    }
                }

                if (index === 3) {
                    if (value > 0 && value <= 5) {
                        licht = 1;
                    }
                    if (value > 5 && value <= 10) {
                        licht = 2;
                    }
                    if (value > 10 && value <= 15) {
                        licht = 4;
                    }
                }

                if (index === 4) {
                    if (value > 200 && value <= 400) {
                        co2 = 1;
                    }
                    if (value > 400 && value <= 600) {
                        co2 = 3;
                    }
                    if (value > 600 && value <= 900) {
                        co2 = 4;
                    }
                }

            });

            var originalArr = [hours, water, temp, licht, co2];
            var sortedArr = originalArr.sort(sortNumber);
            var winningPlantNumber = sortedArr[2];

            showYourPlant(winningPlantNumber);

        }

        function showYourPlant(plantNmbr) {

            var img = $(".winningPlant img");
            var vervanging = $(".vervangingPlant img");

            $(img[0]).animate({
                'opacity': 0
            }, 3000);

            if (plantNmbr === 3 || plantNmbr === 4) {
                $(vervanging[0]).css({

                    'top': '0'
                })
            }

            vervanging[0].src = "./dist/images/plant_0" + plantNmbr + ".jpg";

            if (plantNmbr === 3 || plantNmbr === 4) {
                $(vervanging[0]).css({
                    "position": "relative",
                    "top": "-40px",
                    "height": "650px"
                });
            }

            if (plantNmbr === 5) {
                $(vervanging[0]).css({
                    "position": "relative",
                    "top": "-60px",
                    "height": "670px"
                });
            }

            $(vervanging[0]).css({
                'opacity': 0
            });
            $(vervanging[0]).animate({
                'opacity': 1
            }, 3000);
        }

        function sortNumber(a, b) {
            return a - b;
        }

        function fillValues() {
            var clock = localStorage.getItem("clock");
            var rain = localStorage.getItem("rain");
            var temp = localStorage.getItem("temp");
            var sun = localStorage.getItem("sun");
            var co2 = localStorage.getItem("co2");
            Animations.step3Slider();

            $(".yourValue #clock").text(clock);
            $(".yourValue #rain").text(rain);
            $(".yourValue #temp").text(temp);
            $(".yourValue #sun").text(sun);
            $(".yourValue #co2").text(co2);

            var arr = [parseInt(clock), parseInt(rain), parseInt(temp), parseInt(sun), parseInt(co2)];
            loadPlant(arr);
        }

        function loadJson(lang) {

            $.ajax({
                type: "GET",
                url: "./dist/data/" + lang + ".json",
                async: true,
                dataType: "json",
                error: function (err) {
                    console.log(err);
                }
            }).done(function (data) {
                useData(data);
            });
        }

        function useData(data) {
            for (var i = 0, l = data.length; i < l; i++) {

                $(data[i].class).text(data[i].text);

                if (i == 7) {
                    $(data[i].class).html("<span>co<sub>2 </sub>").append(data[i].text + "</span>");
                }
            }
        }

        function setTimer() {
            var tmrStop = $("#tmrStop"), timerNode = $(".countdown"), upsidedown = $(".upsidedown"), infoText = $(".infoText");

            if ($location.path().indexOf("step2") > -1) {
                startTimer(29, timerNode, upsidedown, tmrStop);
            }

            timerNode.text("00:30");
            upsidedown.text("00:30");
        }

        function startSmallTimer(duration, display) {
            var timer = duration, minutes, seconds;
            var interval_id = setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.text(minutes + ":" + seconds);


                if (--timer < 0) {
                    clearInterval(interval_id);
                }
            }, 1000);
        }

        function startTimer(duration, display, upsidedown, tmrStop) {
            var timer = duration, minutes, seconds;
            var click = false;
            var interval_id = setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.text(minutes + ":" + seconds);
                upsidedown.text(minutes + ":" + seconds);


                if (--timer < 0) {
                    clearInterval(interval_id);
                    endGame(click);
                }
            }, 1000);

            tmrStop.click(function () {
                click = true;
                clearInterval(interval_id);
                endGame(click);
            });
        }

        function endGame(click) {

            saveData();
            Slider.stopSliders();

            if (click) {
                $scope.$apply(function () {
                    $location.path('/step3');
                });
            }


            var tmr = setTimeout(function () {
                clearTimeout(tmr);
                if (!click) {
                    $scope.$apply(function () {
                        $location.path('/step3');
                    });
                }
            }, 2000);

        }

        function saveData() {

            localStorage.setItem("clock", $("#clock")[0].innerHTML);
            localStorage.setItem("rain", $("#rain")[0].innerHTML);
            localStorage.setItem("temp", $("#temp")[0].innerHTML);
            localStorage.setItem("sun", $("#sun")[0].innerHTML);
            localStorage.setItem("co2", $("#co2")[0].innerHTML);
        }

        $scope.continue = function () {
            $("#end").css({'display': 'none'});
        };

        $scope.changeView = function (view, lang) {

            if (lang !== "false") {

                if (lang == "nl") {
                    localStorage.setItem("lang", lang);
                } else if (lang == "en") {
                    localStorage.setItem("lang", lang);
                }
            }
            $location.path(view);
        };
    };

    angular.module("app").controller("mainController", ["$scope", "$location", mainController]);
})();