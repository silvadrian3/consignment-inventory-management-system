app.controller('forgotpasswordCtrl', ['$scope', '$http', '$cookies', '$cookieStore', function ($scope, $http, $cookies, $cookieStore) {
    "use strict";
    $scope.reset_password = function () {
		
        var el = '5fea10f9b07309ead88909855cfff695',
            chckd = true,
            params = {
                module: 'user',
                variable: $scope.username
            };

        $http.post(baselocation + "/api/v1/check_exist.php?m=" + el, params).success(function (response) {
            
            if (response[0].result) {
                var ui = response[0].data[0].id;

                if (isNaN(ui.trim()) || ui.trim() === '' || ui.trim() === undefined) {
                    chckd = false;
                    $scope.clientresponse("Username doesn't exists", 0);
                } else {
                    var params = {
                        user_id: ui
                    };
                    $http.put(baselocation + "/api/v1/password.php?m=" + el + "&action=resetPassword", params).success(function (response) {
                    
                        if (response[0].result) {
                        
                            var params = {
                                user_id: ui,
                                template: 'forgotpassword',
                                password: response[0].data
                            };

                            $http.post(baselocation + "/api/ctrl/emailtemplates.php?m=" + el, params).success(function (response) {
                                if (response[0].result) {
                                    var body = response[0].data[0].body,
                                        recipient = response[0].data[0].recipient,
                                        params = {
                                            from: 'sales@kleveraft.com',
                                            fromname: 'Kleveraft',
                                            subject: 'Reset Password',
                                            body: body,
                                            address: recipient
                                        };

                                    $http.post(baselocation + "/api/v1/sender.php?m=" + el, params).success(function (response) {
                                        if (response[0].result) {

                                            var params = {
                                                user_id: ui,
                                                module: 'Reset Password',
                                                activity: 'Reset Password',
                                                verb: 'Reset Password'
                                            };

                                            $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {

                                                if (response[0].result) {
                                                    $scope.clientresponse("Success! Your password will be sent to your email.", 1);

                                                    setTimeout(function () {
                                                        window.location = "#login";
                                                    }, 3000);
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
