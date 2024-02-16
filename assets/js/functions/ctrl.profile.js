app.controller('profileCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    prepage();
    
    angular.element('.nav-li').removeClass('active');
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type');
    
    //$filter('date')(new Date(), "dd/MM/yyyy");
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/users.php?m=" + el + "&user_id=" + ui).success(function (response) {
console.log(response);
            if (response[0].result) {
                $scope.user_id = response[0].data[0].id;
                $scope.firstname = response[0].data[0].firstname;
                $scope.lastname = response[0].data[0].lastname;
                $scope.username = response[0].data[0].email;
                $scope.password = "****************************************";
                
                /**
                if (response[0].data.birthday !== "0000-00-00") {
                    $scope.birthday = $filter('date')(response[0].data.birthday, "MM/dd/yyyy");
                }
                */
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        setTimeout(function () {
            loadpage();
        }, 500);
    });
    
    
    $scope.updateProfile = function () {
        var params = {
                user_id: $scope.user_id,
                firstname: $scope.firstname,
                lastname: $scope.lastname
            };
        
        $http.put(baselocation + "/api/v1/users.php?m=" + el + "&ui=" + ui, params).success(function (response) {
console.log(response);
            if (response[0].result) {
                var params = {
                        user_id: ui,
                        client_id: ci,
                        module: 'Profile',
                        activity: 'Update',
                        verb: 'Updated User Profile'
                    };

                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
console.log(response);
                    if (response[0].result) {
                        $scope.clientresponse("Profile successfully updated.", 1);
            
                        setTimeout(function () {
                            location.reload();
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
        
    };
    
    $scope.showChangePass = function () {
        window.location = "#changepassword";
    };
    
}]);


app.controller('changepasswordCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type');
    
    $scope.incorrectpassword = false;
    $scope.passwordmismatch = false;
    
    angular.element('.nav-li').removeClass('active');
    
    $scope.checkpassword = function () {
        
        var currentpassword = $scope.currentpassword;
        
        if (currentpassword !== undefined && currentpassword !== "") {
            $http.get(baselocation + "/api/v1/password.php?m=" + el + "&action=checkPassword&password=" + currentpassword + "&ui=" + ui).success(function (response) {
                console.log(response);
                if (response[0].result) {
                    $scope.incorrectpassword = false;
                } else {
                    $scope.incorrectpassword = true;
                }
                
            }).error(function (msg) {
                $scope.onError(msg);
            });
        } else {
            $scope.incorrectpassword = false;
        }
    };
    
    $scope.comparepasswords = function () {
        
        var newpassword = $scope.newpassword,
            retypepassword = $scope.reenterpassword;
        
        if ((newpassword !== undefined && newpassword !== "") && (retypepassword !== undefined && retypepassword !== "")) {
            if (newpassword !== retypepassword) {
                $scope.passwordmismatch = true;
            } else {
                $scope.passwordmismatch = false;
            }
        } else {
            $scope.passwordmismatch = false;
        }
        
    };
    
    $scope.changepassword = function () {
        
        if (!$scope.incorrectpassword && !$scope.passwordmismatch) {
            var params = {
                    user_id: ui,
                    client_id: ci,
                    password: $scope.newpassword
                };
            
            $http.put(baselocation + "/api/v1/password.php?m=" + el + "&action=changePassword", params).success(function (response) {
console.log(response);
                if (response[0].result) {
                    var params = {
                            user_id: ui,
                            client_id: ci,
                            module: 'Profile',
                            activity: 'Change Password',
                            verb: 'Changed Password'
                        };

                    $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
console.log(response);
                        if (response[0].result) {
                            $scope.clientresponse("Password successfully updated! Next time you log in, use your new password.", 1);

                            setTimeout(function () {
                                location.reload();
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
        }
        
    };
    
    $scope.cancel = function () {
        window.location = "#profile";
    };
    
    setTimeout(function () {
        loadpage();
    }, 500);
    
}]);
