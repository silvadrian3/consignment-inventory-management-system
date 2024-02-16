var app = angular.module("myApp", ["ngRoute", "ngCookies"]);
app.config(function ($routeProvider) {
    "use strict";
    $routeProvider

        .when("/", {
            template: "",
            cache : false,
            controller : "indexCtrl"
        })

        .when("/login", {
            templateUrl : "login.html",
            cache : false,
            controller : "loginCtrl"
        })

        .when("/logout", {
            templateUrl : "logout.html",
            cache : false,
            controller : "logoutCtrl"
        })

        .when("/signup", {
            templateUrl : "signup.html",
            cache : false,
            controller : "signupCtrl"
        })

        .when("/forgotpassword", {
            templateUrl : "forgotpassword.html",
            cache : false,
            controller : "forgotpasswordCtrl"
        });

});

app.controller('indexCtrl', ['$scope', function ($scope) {
    "use strict";
    angular.element(document).ready(function () {
        window.location = "#/login";
    });
}]);

app.run(function ($rootScope, $templateCache) {
    "use strict";
    $rootScope.$on('$viewContentLoaded', function () {
        $templateCache.removeAll();
    });
});