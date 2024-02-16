app.controller('partnersCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type');
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-partners').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/clients.php?m=" + el).success(function (response) {
            if (response[0].result) {
                $scope.partners = response[0].data;
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        setTimeout(function () {
            $('#tbl_records').dataTable({
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [-1]}]
            });
            
            $('#page-wrapper').show();
            loadpage();
        }, 500);
    });
    
    $scope.single_action = function (cat, id) {
        if (cat === 'r') { //read
            window.location = "#/partner/view/" + id;
        } else if (cat === 'u') { //update
            window.location = "#/partner/edit/" + id;
        } else if (cat === 'd') { //delete
            if (confirm("Are you sure you want to delete this Partner?")) {
                
                $http.put(baselocation + "/api/v1/clients.php?m=" + el + "&ui=" + ui + "&client_id=" + id + "&action=remove").success(function (response) {
                    if (response[0].result) {
                        var params = {
                            user_id: ui,
                            client_id: ci,
                            module: 'Partners',
                            activity: 'Archive',
                            verb: 'Archived a Partner'
                        };

                        $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                            if (response[0].result) {
                                $scope.clientresponse("Partner successfully deleted.", 1);

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
        } else if (cat === 'a') { //delete
            if (confirm("Are you sure you want to approve this Partner?")) {
                
                $http.put(baselocation + "/api/v1/clients.php?m=" + el + "&ui=" + ui + "&client_id=" + id + "&action=approve").success(function (response) {
                    var params = {
                        client_id: id,
                        template: 'approvepartner'
                    };
                    
                    $http.post(baselocation + "/api/ctrl/emailtemplates.php?m=" + el, params).success(function (response) {
                        if (response[0].result) {
                            var body = response[0].data[0].body,
                                recipient = response[0].data[0].recipient,
                                params = {
                                    from: 'support@mybmapp.net',
                                    fromname: 'BMapp Support Team',
                                    subject: 'Welcome to ',
                                    body: body,
                                    address: recipient
                                };

                            $http.post(baselocation + "/api/v1/sender.php?m=" + el, params).success(function (response) {
                                if (response[0].result) {
                                    var params = {
                                        user_id: ui,
                                        client_id: ci,
                                        module: 'Partners',
                                        activity: 'Approved',
                                        verb: 'Approved a Partner'
                                    };

                                    $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                                        if (response[0].result) {
                                            $scope.clientresponse("Partner successfully approved.", 1);

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

                        } else {
                            $scope.clientresponse("Unexpected error encountered.", 0);
                        }
                    }).error(function (msg) {
                        $scope.onError(msg);
                    });
                    
                }).error(function (msg) {
                    $scope.onError(msg);
                });
                
                
            }
        }
    };
    
}]);

//Add
app.controller('addPartnerCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type');
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-partners').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    $scope.checkPartnerExst = function () {
        
        if ($scope.name !== "" && $scope.name !== undefined) {
            var params = {
                    module: 'partner',
                    variable: $scope.name
                };

            $http.post(baselocation + "/api/v1/check_exist.php?m=" + el, params).success(function (response) {
                if (response[0].result) {

                    if (response[0].data[0].row !== 0) {
                        alert('Partner Name already exists.');
                        $scope.name = "";
                        angular.element('#name').focus();
                    }

                } else {
                    $scope.clientresponse("Unexpected error encountered.", 0);
                }

            }).error(function (msg) {
                $scope.onError(msg);
            });
        }    
    };
    
    $scope.checkUserExst = function () {
        
        if ($scope.email !== "" && $scope.email !== undefined) {
            var params = {
                    module: 'user',
                    variable: $scope.email
                };

            $http.post(baselocation + "/api/v1/check_exist.php?m=" + el, params).success(function (response) {
                console.log(response);
                if (response[0].result) {
                    var ui = response[0].data[0].id;

                    if (ui.trim() != '') {
                        alert('Username already exists.');
                        $scope.email = "";
                        angular.element('#email').focus();
                    }

                } else {
                    $scope.clientresponse("Unexpected error encountered.", 0);
                }

            }).error(function (msg) {
                $scope.onError(msg);
            });
        }    
    };
    
    $scope.addPartner = function () {
        angular.element('#btn_save').css("pointer-events", "none");
        var userparams = {
                firstname: $scope.representative_firstname,
                lastname: $scope.representative_lastname,
                username: $scope.email,
                password: $scope.password,
                type: 'client'
            };
        
        $http.post(baselocation + "/api/v1/users.php?m=" + el + "&ui=" + ui, userparams).success(function (response) {
            if (response[0].result) {
                var user_id = response[0].data[0].id,
                    partnerparams = {
                        user_id: user_id,
                        name: $scope.name,
                        phone: $scope.phone,
                        mobile: $scope.mobile,
                        email: $scope.email,
                        address: $scope.address,
                        facebook: $scope.facebook,
                        instagram: $scope.instagram,
                        twitter: $scope.twitter
                    };
                
                $http.post(baselocation + "/api/v1/clients.php?m=" + el + "&ui=" + ui, partnerparams).success(function (response) {
                    if (response[0].result) {
                        
                        var client_id = response[0].data[0].id,
                            clientuserparams = {
                                client_id: client_id,
                                user_id: user_id
                            };
                        
                        $http.post(baselocation + "/api/v1/client_users.php?m=" + el + "&ui=" + ui, clientuserparams).success(function (response) {
                            if (response[0].result) {
                                
                                var params = {
                                    user_id: user_id,
                                    template: 'addpartner',
                                    username: $scope.email,
                                    password: $scope.password
                                };

                                $http.post(baselocation + "/api/ctrl/emailtemplates.php?m=" + el, params).success(function (response) {
                                    if (response[0].result) {
                                        var body = response[0].data[0].body,
                                            recipient = response[0].data[0].recipient,
                                            params = {
                                                from: 'sales@kleveraft.com',
                                                fromname: 'KleveRaft',
                                                subject: 'Welcome to KleveRaft\'s Inventory System',
                                                body: body,
                                                address: recipient
                                            };
                                        $http.post(baselocation + "/api/v1/sender.php?m=" + el, params).success(function (response) {
                                            if (response[0].result) {
                                                var params = {
                                                    user_id: ui,
                                                    client_id: ci,
                                                    module: 'Partners',
                                                    activity: 'Add',
                                                    verb: 'Added a Partner'
                                                };

                                                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                                                    if (response[0].result) {
                                                        $scope.clientresponse("Partner successfully added.", 1);
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
        
    };
    
    $scope.gotoList = function () {
        window.location = "#partners";
    };
     
    setTimeout(function () {
        loadpage();
    }, 500);
    
}]);

//View
app.controller('viewPartnerCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        v_id = $routeParams.id,
        na = 'N/A';
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-partners').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        $http.get(baselocation + "/api/v1/clients.php?m=" + el + "&client_id=" + v_id).success(function (response) {
            if (response[0].result) {
                
                if (response[0].data[0].name !== "") {
                    $scope.name = response[0].data[0].name;
                } else {
                    $scope.name = na;
                }

                if (response[0].data[0].representative_firstname !== "") {
                    $scope.representative_firstname = response[0].data[0].representative_firstname;
                } else {
                    $scope.representative_firstname = na;
                }

                if (response[0].data[0].representative_lastname !== "") {
                    $scope.representative_lastname = response[0].data[0].representative_lastname;
                } else {
                    $scope.representative_lastname = na;
                }

                if (response[0].data[0].email !== "") {
                    $scope.email = response[0].data[0].email;
                } else {
                    $scope.email = na;
                }

                if (response[0].data[0].phone_no !== "") {
                    $scope.phone = response[0].data[0].phone_no;
                } else {
                    $scope.phone = na;
                }

                if (response[0].data[0].mobile_no !== "") {
                    $scope.mobile = response[0].data[0].mobile_no;
                } else {
                    $scope.mobile = na;
                }

                if (response[0].data[0].address !== "") {
                    $scope.address = response[0].data[0].address;
                } else {
                    $scope.address = na;
                }
                
                if (response[0].data[0].facebook !== "") {
                    $scope.facebook = response[0].data[0].facebook;
                } else {
                    $scope.facebook = na;
                }
                
                if (response[0].data[0].instagram !== "") {
                    $scope.instagram = response[0].data[0].instagram;
                } else {
                    $scope.instagram = na;
                }
                
                if (response[0].data[0].twitter !== "") {
                    $scope.twitter = response[0].data[0].twitter;
                } else {
                    $scope.twitter = na;
                }
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
    });
    
    $scope.gotoUpdate = function () {
        window.location = "#/partner/edit/" + v_id;
    };
    
    $scope.gotoList = function () {
        window.location = "#partners";
    };
    
    setTimeout(function () {
        loadpage();
    }, 500);
    
    
}]);

//Edit
app.controller('editPartnerCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        v_id = $routeParams.id;
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-partners').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/clients.php?m=" + el + "&client_id=" + v_id).success(function (response) {
            if (response[0].result) {
                $scope.user_id = response[0].data[0].user_id;
                $scope.name = response[0].data[0].name;
                //$scope.representative_id = response[0].data[0].representative_id;
                $scope.representative_firstname = response[0].data[0].representative_firstname;
                $scope.representative_lastname = response[0].data[0].representative_lastname;
                $scope.email = response[0].data[0].email;
                $scope.phone = response[0].data[0].phone_no;
                $scope.mobile = response[0].data[0].mobile_no;
                $scope.address = response[0].data[0].address;
                $scope.facebook = response[0].data[0].facebook;
                $scope.instagram = response[0].data[0].instagram;
                $scope.twitter = response[0].data[0].twitter;
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        setTimeout(function () {
            loadpage();
        }, 500);
        
    });
      
    $scope.updatePartner = function () {
        var params = {
                user_id: $scope.user_id,
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
                mobile: $scope.mobile,
                address: $scope.address,
                facebook: $scope.facebook,
                instagram: $scope.instagram,
                twitter: $scope.twitter,
                type: 'client'
            };
            
        $http.put(baselocation + "/api/v1/clients.php?m=" + el + "&ui=" + ui + "&client_id=" + v_id + "&action=profile", params).success(function (response) {
            if (response[0].result) {
                var params = {
                    user_id: $scope.user_id,
                    firstname: $scope.representative_firstname,
                    lastname: $scope.representative_lastname
                };

                $http.put(baselocation + "/api/v1/users.php?m=" + el + "&ui=" + ui, params).success(function (response) {
                    if (response[0].result) {
                        var params = {
                            user_id: ui,
                            client_id: ci,
                            module: 'Partners',
                            activity: 'Update',
                            verb: 'Updated a Partner Details'
                        };

                        $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                            if (response[0].result) {
                                $scope.clientresponse("Partner details successfully updated.", 1);
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

            } else {
                $scope.clientresponse("Unexpected error encountered.", 0);
            }

        }).error(function (msg) {
            $scope.onError(msg);
        });
        
    };
    
    $scope.gotoList = function () {
        window.location = "#partners";
    };
    
}]);
