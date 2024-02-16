app.controller('signupCtrl', ['$scope', '$http', '$cookies', '$cookieStore', function ($scope, $http, $cookies, $cookieStore) {
    "use strict";
    $scope.signup = function () {
        var el = '5fea10f9b07309ead88909855cfff695',
            firstname = $scope.firstname,
            lastname = $scope.lastname,
            company = $scope.businessname,
            email = $scope.email,
            password = $scope.password,
            params = {
                module: 'user',
                variable: email
            };
        
        $http.post(baselocation + "/api/v1/check_exist.php?m=" + el, params).success(function (response) {
            console.log(response);
            if (response[0].result) {
                var existing_ui = response[0].data[0].id;

                if (existing_ui.trim() === "") {
                    var userparams = {
                        firstname: firstname,
                        lastname: lastname,
                        username: email,
                        password: password,
                        type: 'client',
                        status: 2
                    };

                    $http.post(baselocation + "/api/v1/users.php?m=" + el + "&ui=0", userparams).success(function (response) {
                        console.log(response);
                        if (response[0].result) {
                            var user_id = response[0].data[0].id,
                                partnerparams = {
                                    user_id: user_id,
                                    name: company,
                                    email: email,
                                    status: 2
                                };

                            $http.post(baselocation + "/api/v1/clients.php?m=" + el + "&ui=" + user_id, partnerparams).success(function (response) {
                                console.log(response);
                                if (response[0].result) {

                                    var client_id = response[0].data[0].id,
                                        clientuserparams = {
                                            client_id: client_id,
                                            user_id: user_id
                                        };

                                    $http.post(baselocation + "/api/v1/client_users.php?m=" + el + "&ui=" + user_id, clientuserparams).success(function (response) {
                                        console.log(response);
                                        if (response[0].result) {
                                            var params = {
                                                user_id: user_id,
                                                client_id: client_id,
                                                module: 'Sign Up',
                                                activity: 'Sign Up',
                                                verb: 'Signed Up'
                                            };

                                            $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                                                console.log(response);
                                                if (response[0].result) {
                                                    
                                                    $scope.clientresponse("Registration successfully completed! Please wait for account verification and approval through the email address you provided.", 1);
                                                    
                                                    $cookieStore.put('user_id', user_id);
                                                    $cookieStore.put('client_id', client_id);
                                                    $cookieStore.put('user_type', 'client');
                                                    
                                                    setTimeout(function () {
                                                        window.location = "#login";
                                                    }, 5000);
                                                    
                                                } else {
                                                    $scope.clientresponse("Unexpected error encountered.", 0);
                                                }
                                            }).error(function (msg) {
                                                $scope.onError(msg);
                                            });
                                        } else {
                                            $scope.clientresponse("Unexpected error encountered.", 0);
                                        }
                                    }).error(function (msg) {
                                        $scope.onError(msg);
                                    });
                                    
                                } else {
                                    $scope.clientresponse("Unexpected error encountered.", 0);
                                }
                            }).error(function (msg) {
                                $scope.onError(msg);
                            });


                        } else {
                            $scope.clientresponse("Unexpected error encountered.", 0);
                        }

                    }).error(function (msg) {
                        $scope.onError(msg);
                    });
                    
                } else {
                    $scope.clientresponse("User already exists.", 0);
                }

            } else {
                $scope.clientresponse("Unexpected error encountered.", 0);
            }
          
        }).error(function (msg) {
            $scope.onError(msg);
        });

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