(function () {
    "use strict";

    var app = angular.module("app", ["ngRoute", "ngAnimate"]);

    app.config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "./dist/pages/intro.html",
                controller: 'mainController'
            })
            .when("/step1_1", {
                templateUrl: "./dist/pages/step1_1.html",
                controller: 'mainController'
            })
            .when("/step1_2", {
                templateUrl: "./dist/pages/step1_2.html",
                controller: "mainController"
            })
            .when("/step1_3", {
                templateUrl: "./dist/pages/step1_3.html",
                controller: "mainController"
            })
            .when("/step2", {
                templateUrl: "./dist/pages/step2.html",
                controller: "mainController"
            })
            .when("/step3", {
                templateUrl: "./dist/pages/step3.html",
                controller: "mainController"
            })
            .when("/end", {
                templateUrl: "./dist/pages/end.html",
                controller: "mainController"
            })
            .otherwise({
                redirectTo: "/"
            });
    }]);
})();