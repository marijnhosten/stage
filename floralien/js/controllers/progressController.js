(function () {
    "use strict";

    var progressController = function ($scope, $location) {

        var lockScreen = $(".lockScreen");
        lockScreen.css({'display': 'block'});

        if ($location.path().indexOf("step1_1") > -1) {
            var clickOne = false;

            lockScreen.one("touchstart", function () {
                clickOne = true;
                clearTimeout(tmr1);
            });

            var tmr1 = setTimeout(function () {


                if (!clickOne) {
                    clearTimeout(tmr1);
                    $scope.$apply(function () {
                        $location.path('/step1_2');
                    });
                }
            }, 25000);

        }
        if ($location.path().indexOf("step1_2") > -1) {

            Animations.tutorialAnimations();

            var clickTwo = false;

            lockScreen.one("touchstart", function () {
                clickTwo = true;
                clearTimeout(tmr2);
            });

            var tmr2 = setTimeout(function () {

                if (!clickTwo) {
                    clearTimeout(tmr2);
                    $scope.$apply(function () {
                        $location.path('/step1_3');
                    });
                }
            }, 18000);
        }

        if ($location.path().indexOf("step1_3") > -1) {
            var clickThree = false;

            lockScreen.one("touchstart", function () {
                clickThree = true;
                clearTimeout(tmr3);
            });

            var tmr3 = setTimeout(function () {

                if (!clickThree) {
                    clearTimeout(tmr3);
                    $scope.$apply(function () {
                        $location.path('/step2');
                    });
                }
            }, 15000);
        }

        $scope.nextStep = function (view) {
            $location.path(view);
        };

    };


    angular.module("app").controller("progressController", ["$scope", "$location", progressController]);
})();