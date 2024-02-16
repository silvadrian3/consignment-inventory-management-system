app.controller('mainCtrl', ['$scope', '$http', '$cookies', '$cookieStore', function ($scope, $http, $cookies, $cookieStore) {
    "use strict";

    angular.element(document).ready(function () {
        
        if (($cookieStore.get('user_id') !== "" && $cookieStore.get('user_id') !== undefined) && ($cookieStore.get('client_id') !== "" && $cookieStore.get('client_id') !== undefined)) {
            
            var el = '5fea10f9b07309ead88909855cfff695',
                ui = $cookieStore.get('user_id'),
                ci = $cookieStore.get('client_id'),
                type = $cookieStore.get('user_type');
            
            $http.get(baselocation + "/api/v1/users.php?m=" + el + "&user_id=" + ui).success(function (response) {
                console.log(response);
                if (response[0].result) {
                    $scope.firstname = response[0].data[0].firstname;
                    $scope.lastname = response[0].data[0].lastname;
                    $scope.username = response[0].data[0].email;
                }
                
            }).error(function (msg) {
                $scope.onError(msg);
            });
            
            $http.get(baselocation + "/api/v1/clients.php?m=" + el + "&client_id=" + ci).success(function (response) {
                console.log(response);
                if (response[0].result) {
                    $scope.client_name = response[0].data[0].name;
                }
                
            }).error(function (msg) {
                $scope.onError(msg);
            });
            
        } else {
            window.location = "../#/login?account=false";
        }
        
    });

    $scope.logout = function () {
        if (confirm("Are you sure you want to log out?")) {
            window.location = "../#logout";
        }
    };
    
    $scope.onError = function (msg) {
        $scope.clientresponse("Unexpected error encountered. " + msg, 0);
    };
    
    $scope.clientresponse = function (msg, status) {
        $scope.result_msg = msg;
        $scope.display_result = true;
        $(window).scrollTop(0);
        
        if (status === 1) {
            $scope.success = true;
            $scope.failed = false;
            return true;
        } else {
            $scope.failed = true;
            $scope.success = false;
            return false;
        }
    };
}]);