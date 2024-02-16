app.controller('deliveriesCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    prepage();
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-deliveries').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '',
        removedcats = [];

    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
    
    angular.element(document).ready(function () {
        $http.get(baselocation + "/api/v1/deliveries.php?m=" + el + isClient).success(function (response) {
console.log(response);
            
            if (response[0].result) {
                $scope.deliveries = response[0].data;
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
    
    $('#chkAll').click(function (event) {
        if (this.checked) {
            $('.check_item').each(function () {
                this.checked = true;
            });
        } else {
            $('.check_item').each(function () {
                this.checked = false;
            });
        }
    });
    
    $scope.checkCB = function (evt) {
        if (this.checked === false) {
            $("#chkAll")[0].checked = false;
        }
        
        if ($('.check_item:checked').length === $('.check_item').length) {
            $("#chkAll")[0].checked = true;
        } else {
            $("#chkAll")[0].checked = false;
        }
    };
    
    $scope.single_action = function (cat, id) {
        if (cat === 'r') { //read
            window.location = "#/delivery/view/" + id;
        } else if (cat === 'u') { //update
            window.location = "#/delivery/edit/" + id;
        } else if (cat === 'd') { //delete
            if (confirm("Are you sure you want to delete this Delivery?")) {
                
                $http.put(baselocation + "/api/v1/deliveries.php?m=" + el + "&ui=" + ui + "&id=" + id + "&action=delete").success(function (response) {
console.log(response);
                    if (response[0].result) {
                        var params = {
                            user_id: ui,
                            client_id: ci,
                            module: 'Delivery',
                            activity: 'Archive',
                            verb: 'Archived a Delivery'
                        };

                        $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
console.log(response);
                            if (response[0].result) {
                                $scope.clientresponse("Delivery successfully deleted.", 1);
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
        } else if (cat === 'c') { //cancel
            if (confirm("Are you sure you want to cancel this Delivery?")) {
                $http.put(baselocation + "/api/v1/deliveries.php?m=" + el + "&ui=" + ui + "&id=" + id + "&action=cancel").success(function (response) {
                    console.log(response);
                    if (response[0].result) {
                        var params = {
                            user_id: ui,
                            client_id: ci,
                            module: 'Delivery',
                            activity: 'Cancel',
                            verb: 'Cancelled a Delivery'
                        };

                        $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
console.log(response);
                            if (response[0].result) {
                                $scope.clientresponse("Delivery successfully cancelled.", 1);
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
        } else if (cat === 'a') { //approved
            if (confirm("Are you sure you want to approve this Delivery?")) {
                $http.put(baselocation + "/api/v1/deliveries.php?m=" + el + "&ui=" + ui + "&id=" + id + "&action=approve").success(function (response) {
                    console.log(response);
                    if (response[0].result) {
                        var params = {
                            user_id: ui,
                            client_id: ci,
                            module: 'Delivery',
                            activity: 'Post',
                            verb: 'Posted a Delivery'
                        };

                        $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
console.log(response);
                            if (response[0].result) {
                                $scope.clientresponse("Delivery successfully approved.", 1);
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
        }

    };
    
    /**
    $scope.multidelete = function () {
        var arr_delivery_id = [];
        angular.forEach($scope.deliveries, function(item){
            
            if(item.delivery){
                arr_delivery_id.push(item.delivery_id);
            }
        });
        
        if (confirm("Are you sure you want to delete selected Delivery(s)?")) {
                var u_id = $cookieStore.get('user_id'),
                    c_id = $cookieStore.get('client_id'),
                    bit = true,
                    params = {
                        user_id: u_id,
                        delivery_ids: arr_delivery_id
                    };
            
                $http.post("http://localhost/flair/app/api/v1/deliveries/multiple", params).success(function (response) {
                    console.log(response);
                    if (response.result) {
                        var ui = u_id,
                            params = {
                                user_id: ui,
                                activity: "Delete Multiple Deliveries"
                            };

                        $http.post("http://localhost/flair/app/api/v1/activity", params).success(function (response) {
console.log(response);
                            if (response.result) {
                                bit = true;
                            } else {
                                bit = false;
                            }
                        });

                    } else {
                        bit = false;
                    }

                }).error(function (msg){
                    console.log(msg);
                });
                
                if (bit) {
                    $scope.result_msg = "Delivery(s) successfully deleted.";
                    $scope.success = true;
                    $scope.failed = false;

                    setTimeout(function () {
                        location.reload();
                    }, 3000);
                } else {
                    $scope.result_msg = "Unexpected error encountered.";
                    $scope.failed = true;
                    $scope.success = false;
                }
                
                $scope.display_result = true;
            }
    }
    */
    
    /**
    $scope.multiupdate = function () {
        var arr_delivery_id = "id=";
        angular.forEach($scope.deliveries, function (item) {
            if (item.delivery) {
                arr_delivery_id = arr_delivery_id + item.delivery_id + '-';
            }
        });
        
        arr_delivery_id = arr_delivery_id.slice(0, -1);
        window.location = "#/delivery/update/?" + arr_delivery_id;
    };
    */
    
    
}]);

//Add
app.controller('addDeliveryCtrl', ['$scope', '$http',  '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '',
        arr_product_id = [],
        arr_product_name = [],
        x;
        
    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-deliveries').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $scope.delivery_items = [{}, {}, {}, {}, {}];
        
        $http.get(baselocation + "/api/v1/products.php?m=" + el + isClient).success(function (response) {
            console.log(response);
            if (response[0].result) {

                for (x = 0; x < response[0].data.length; x++) {
                    arr_product_id.push(response[0].data[x].product_id);
                    arr_product_name.push(response[0].data[x].name);
                }

                $scope.products = arr_product_name;
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
    });
    
    $scope.addRow = function () {
        $scope.delivery_items.push({});
    };
    
    $scope.removeRow = function (evt) {
        
        var row_id = evt.target.id;
        
		$scope.delivery_items.splice(row_id, 1);
        
        setTimeout(function () {
            compute_grandtotal();
        }, 0);
        
	};
    
    $scope.populate_data = function (x) {
        
        var productname = angular.element("#product_service_" + x).val(),
            i;
        
        if (productname !== undefined && productname !== "") {
            for (i = 0; i < arr_product_name.length; i++) {
                if (productname.trim() === arr_product_name[i].trim()) {
                    $scope.product_id = arr_product_id[i];
                    break;
                }
            }

            if (i === arr_product_name.length) {
                $scope.product_id = 0; // does not exists
            }
            
            if ($scope.product_id !== 0) {
                
                $http.get(baselocation + "/api/v1/products.php?m=" + el + isClient + "&id=" + $scope.product_id).success(function (response) {
                    console.log(response);
                    if (response[0].result) {
                        angular.element("#code_" + x).val(response[0].data[0].code);
                        angular.element("#price_" + x).val(response[0].data[0].price);
                        //angular.element("#quantity_" + x).removeAttr("readonly");
                        angular.element("#quantity_" + x).select();
                        compute_linetotal(x);
                    }
                    
                }).error(function (msg) {
                    $scope.onError(msg);
                });
                
            } else {
                console.log("Product Name not registered.");
            }
        }
    };
    
    $scope.saveDelivery = function (i) {
        angular.element('#btn_save').css("pointer-events", "none");
        angular.element('#btn_submit').css("pointer-events", "none");
        var transaction_arr = [],
            s_act,
            s_verb;

        $('.tr_records').each(function () {
                
            var each_id = this.id.substr(this.id.lastIndexOf("_") + 1).trim(),
                product_id = 0,
                name = angular.element("#product_service_" + each_id).val().trim(),
                //code = angular.element("#code_" + each_id).val().trim(),
                price = parseFloat(moneytrim(angular.element("#price_" + each_id).val().trim())),
                qty = angular.element("#quantity_" + each_id).val().trim(),
                amount = parseFloat(moneytrim(angular.element("#amount_" + each_id).val().trim())),
                i;
                
            if (name !== undefined && name !== "") {
                for (i = 0; i < arr_product_name.length; i++) {
                    if (name.trim() === arr_product_name[i].trim()) {
                        product_id = arr_product_id[i];
                        break;
                    }
                }
                    
                transaction_arr.push({
                    product_id: product_id,
                    price: price,
                    qty: qty,
                    amount: amount
                });
            }
        });
        
        if (i === 0) { //save as draft
            $scope.status = 'Draft';
            s_act = 'Draft';
            s_verb = 'Drafted a Delivery';
            
        } else { //submit - for approval
            $scope.status = 'Pending';
            s_act = 'Add';
            s_verb = 'Added a Delivery';
        }
        
        var params = {
                partner_id: ci,
                status: $scope.status,
                state: 'new',
                total_qty: angular.element("#totalqty").text(),
                total_amt: parseFloat(moneytrim(angular.element("#grandtotal").text().replace("P ", ''))),
                comment: $scope.comment,
                transaction_arr: transaction_arr
            };

        $http.post(baselocation + "/api/v1/deliveries.php?m=" + el + "&ui=" + ui + isClient, params).success(function (response) {
console.log(response);
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    client_id: ci,
                    module: 'Delivery',
                    activity: s_act,
                    verb: s_verb
                };

                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
console.log(response);
                    if (response[0].result) {
                        $scope.clientresponse("Delivery successfully added.", 1);

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
    
    $scope.gotoList = function () {
        window.location = "#deliveries";
    };
     
    setTimeout(function () {
        loadpage();
    }, 500);
    
}]);

//View
app.controller('viewDeliveryCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '',
        v_id = $routeParams.id,
        na = 'N/A';
    
    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
            
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-deliveries').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        $http.get(baselocation + "/api/v1/deliveries.php?m=" + el + isClient + "&id=" + v_id).success(function (response) {
            console.log(response);
            
            if (response[0].result) {
                if (response[0].data[0].delivery_id !== "") {
                    $scope.delivery_id = response[0].data[0].delivery_id;
                } else {
                    $scope.delivery_id = "";
                }

                if (response[0].data[0].partner_name !== "") {
                    $scope.partner_name = response[0].data[0].partner_name;
                } else {
                    $scope.partner_name = 0;
                }
                
                if (response[0].data[0].total_qty !== "") {
                    $scope.total_quantity = response[0].data[0].total_qty;
                } else {
                    $scope.total_quantity = 0;
                }

                if (response[0].data[0].total_amt !== "") {
                    $scope.total_amount = response[0].data[0].total_amt;
                } else {
                    $scope.total_amount = 0.00;
                }

                if (response[0].data[0].date_created !== "" && response[0].data[0].date_created !== "0000-00-00") {
                    $scope.date_created = response[0].data[0].date_created;
                } else {
                    $scope.date_created = "";
                }

                if (response[0].data[0].date_posted !== "" && response[0].data[0].date_posted !== "0000-00-00") {
                    $scope.date_posted = response[0].data[0].date_posted;
                } else {
                    $scope.date_posted = na;
                }

                if (response[0].data[0].comment !== "") {
                    $scope.comment = response[0].data[0].comment;
                } else {
                    $scope.comment = na;
                }
                
                if (response[0].data[0].status !== "") {
                    $scope.status = response[0].data[0].status;
                } else {
                    $scope.status = na;
                }

                if (response[0].data[0].breakdown.length !== 0) {
                    $scope.delivery_breakdown = response[0].data[0].breakdown;
                }
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
    });
    
    $scope.printDelivery = function () {

        var el = '5fea10f9b07309ead88909855cfff695',
            params = "?m=" + el + "&d=" + v_id;
        window.open("../api/ctrl/print.php" + params);

    };
    
    $scope.gotoList = function () {
        window.location = "#deliveries";
    };
    
    setTimeout(function () {
        loadpage();
    }, 500);
}]);

//Edit
app.controller('editDeliveryCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        v_id = $routeParams.id,
        isClient = '',
        arr_product_id = [],
        arr_product_name = [],
        x,
        a,
        s_act,
        s_verb;
        
    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-deliveries').addClass('active');
    //angular.element('.navbar-toggle').click();

    $scope.delivery_items = [];
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/deliveries.php?m=" + el + isClient + "&id=" + v_id).success(function (response) {
            console.log(response);
            if (response[0].result) {

                if (response[0].data[0].total_qty !== "") {
                    $scope.total_quantity = response[0].data[0].total_qty;
                } else {
                    $scope.total_quantity = 0;
                }

                if (response[0].data[0].total_amt !== "") {
                    $scope.total_amount = response[0].data[0].total_amt;
                } else {
                    $scope.total_amount = 0.00;
                }

                if (response[0].data[0].comment !== "") {
                    $scope.comment = response[0].data[0].comment;
                } else {
                    $scope.comment = "";
                }
                
                if (response[0].data[0].breakdown.length !== 0) {
                    $scope.delivery_items = response[0].data[0].breakdown;
                    
                    for (a = response[0].data[0].breakdown.length; response[0].data[0].breakdown.length < 5; a++) {
                        $scope.delivery_items.push({product_name: '', product_code: '', price: '0.00', quantity: '0', amount: '0.00'});
                    }
                }
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        $http.get(baselocation + "/api/v1/products.php?m=" + el + isClient).success(function (response) {
            console.log(response);
            if (response[0].result) {
                for (x = 0; x < response[0].data.length; x++) {
                    arr_product_id.push(response[0].data[x].product_id);
                    arr_product_name.push(response[0].data[x].name);
                }
                $scope.products = arr_product_name;
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        setTimeout(function () {
            loadpage();
        }, 500);
        
    });
    
    $scope.addRow = function () {
        //$(".fillproducts").autocomplete({ source: arr_product_name });
        $scope.delivery_items.push({product_name: '', product_code: '', price: '0.00', quantity: '0', amount: '0.00'});
    };
    
    $scope.removeRow = function (evt) {
        
        var row_id = evt.target.id;
        
		$scope.delivery_items.splice(row_id, 1);
        
        setTimeout(function () {
            compute_grandtotal();
        }, 0);
        
	};
    
    $scope.populate_data = function (x) {
        
        var productname = angular.element("#product_service_" + x).val(),
            i;
        
        if (productname !== undefined && productname !== "") {
            for (i = 0; i < arr_product_name.length; i++) {
                if (productname.trim() === arr_product_name[i].trim()) {
                    $scope.product_id = arr_product_id[i];
                    break;
                }
            }

            if (i === arr_product_name.length) {
                $scope.product_id = 0; // does not exists
            }
            
            if ($scope.product_id !== 0) {
                
                $http.get(baselocation + "/api/v1/products.php?m=" + el + isClient + "&id=" + $scope.product_id).success(function (response) {
                    console.log(response);
                    if (response[0].result) {
                        angular.element("#code_" + x).val(response[0].data[0].code);
                        angular.element("#price_" + x).val(response[0].data[0].price);
                        //angular.element("#quantity_" + x).removeAttr("readonly");
                        angular.element("#quantity_" + x).select();
                        compute_linetotal(x);
                    }
                    
                }).error(function (msg) {
                    $scope.onError(msg);
                });
                
            } else {
                console.log("Product Name not registered.");
            }
        }
        
    };
    
    $scope.saveDelivery = function (i) {
        angular.element('#btn_save').css("pointer-events", "none");
        angular.element('#btn_submit').css("pointer-events", "none");
        var transaction_arr = [];

        $('.tr_records').each(function () {
                
            var each_id = this.id.substr(this.id.lastIndexOf("_") + 1).trim(),
                product_id = 0,
                name = angular.element("#product_service_" + each_id).val().trim(),
                //code = angular.element("#code_" + each_id).val().trim(),
                price = parseFloat(moneytrim(angular.element("#price_" + each_id).val().trim())),
                qty = angular.element("#quantity_" + each_id).val().trim(),
                amount = parseFloat(moneytrim(angular.element("#amount_" + each_id).val().trim()));
                
            if (name !== undefined && name !== "") {
                for (var i = 0; i < arr_product_name.length; i++) {
                    if (name.trim() === arr_product_name[i].trim()) {
                        product_id = arr_product_id[i];
                        break;
                    }
                }

                transaction_arr.push({
                    product_id: product_id,
                    price: price,
                    qty: qty,
                    amount: amount
                });
            }
                
        });
        
        if (i == 0) { //save as draft
            $scope.status = 'Draft';
            s_act = 'Update';
            s_verb = 'Updated a Delivery';
        } else { //submit - for approval
            $scope.status = 'Pending';
            s_act = 'Add';
            s_verb = 'Added a Delivery';
        }
        
        var params = {
                partner_id: ci,
                delivery_id: v_id,
                status: $scope.status,
                state: 'update',
                total_qty: angular.element("#totalqty").text(),
                total_amt: parseFloat(moneytrim(angular.element("#grandtotal").text().replace("P ", ''))),
                comment: $scope.comment,
                transaction_arr: transaction_arr
            };
                
        $http.post(baselocation + "/api/v1/deliveries.php?m=" + el + "&ui=" + ui + isClient, params).success(function (response) {
console.log(response);
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    client_id: ci,
                    module: 'Delivery',
                    activity: s_act,
                    verb: s_verb
                };

                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
console.log(response);
                    if (response[0].result) {
                        $scope.clientresponse("Delivery successfully updated.", 1);
            
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
    
    $scope.gotoList = function () {
        window.location = "#deliveries";
    };
    
}]);

//update multiple
/**
app.controller('editMultipleDeliveryCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var u_id = $cookieStore.get('user_id'),
        c_id = $cookieStore.get('client_id'),
        v_id = $routeParams.id,
        arr_id = "";
    
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-deliveries').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
    
        $http.get("http://localhost/flair/app/api/v1/deliveries/" + c_id + "/multi/" + v_id).success(function (response) {
console.log(response);
            if (response.result) {
                $scope.listdeliveries = response.data;
            }
        }).error(function (msg){
            console.log(msg);
        });
    
        setTimeout(function () {
            loadpage();
        }, 500);
        
    });
    
    
    $scope.updateMultipleDelivery = function () {
        var bit = true,
            params = [];
        
        angular.forEach($scope.listdeliveries, function (item) {
            
            var contact_id = item.contact_id,
                name = angular.element("#name_" + contact_id).val(),
                address = angular.element("#address_" + contact_id).val(),
                email = angular.element("#email_" + contact_id).val(),
                firstname = angular.element("#firstname_" + contact_id).val(),
                lastname = angular.element("#lastname_" + contact_id).val(),
                phone = angular.element("#phone_" + contact_id).val(),
                mobile = angular.element("#mobile_" + contact_id).val(),
                fax = angular.element("#fax_" + contact_id).val(),
            
                paramloop = {
                    contact_id: contact_id,
                    name: name,
                    firstname: firstname,
                    lastname: lastname,
                    address: address,
                    email: email,
                    phone: phone,
                    mobile: mobile,
                    fax: fax,
                    type: 4
                };
            
            params.push(paramloop);
        });
        
        $http.put("http://localhost/flair/app/api/v1/contacts/multi", params).success(function (response) {
            console.log(response);
            if (response.result) {
                var ui = u_id,
                    params = {
                        user_id: ui,
                        activity: "Update Multiple Delivery Details"
                    };

                $http.post("http://localhost/flair/app/api/v1/activity", params).success(function (response) {
console.log(response);
                    if (response.result) {
                        bit = true;
                    } else {
                        bit = false;
                    }
                });
                

            } else {
                bit = false;
            }
            
        }).error(function (msg){
            console.log(msg);
        });
        
        if (bit) {
            $scope.result_msg = "Delivery details successfully updated.";
            $scope.success = true;
            $scope.failed = false;

            setTimeout(function () {
                location.reload();
            }, 3000);
        } else {
            $scope.result_msg = "Unexpected error encountered.";
            $scope.failed = true;
            $scope.success = false;
        }
        
        $scope.display_result = true;
        
    };
    
    
    $scope.gotoList = function () {
        window.location = "#deliveries";
    };
    
}]);
*/

//Import
app.controller('importDeliveryCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    "use strict";
    prepage();
    
    //console.log($routeParams.id);
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-deliveries').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    setTimeout(function () {    
            $('#page-wrapper').show();
            loadpage();
    }, 500);
    
    $scope.start_import = function () {
        
        $("#tbl_records_importdelivery").dataTable().fnDestroy();
        
        $scope.imported_deliveries = mprt_out;
        //console.log(mprt_out);
        
        
        setTimeout(function () {
            $('#tbl_records_importdelivery').dataTable({
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            });
            
            $("#div_importdelivery").show();
        }, 500);
        
        //console.log(mprt_out);
    }
    
}]);


app.controller('delivery_reportsCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '',
        arr_partner_id = [],
        arr_partner_name = [];

        if(type == "client"){
            isClient = "&client_id=" + ci;
        }
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-reports').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $scope.startdate = getdate();
        $scope.enddate = getdate();
        
        var sdate = $filter('date')(new Date(getdate()), "yyyy-MM-dd"),
            edate = $filter('date')(new Date(getdate()), "yyyy-MM-dd"),
            datefilter = "&startdate=" + sdate + "&enddate=" + edate;
        
        $http.get(baselocation + "/api/v1/deliveries.php?m=" + el + isClient + datefilter).success(function (response) {
console.log(response);
            var result_total_amount = 0.00,
                result_total_qty = 0,
                y;
            
            if (response[0].result) {
                $scope.deliveries = response[0].data;
                
                for(y = 0; y < response[0].data.length; y++){
                    result_total_amount += parseFloat(response[0].data[y].total_amt);
                    result_total_qty += parseInt(response[0].data[y].total_qty);
                }    
            }
            
            $scope.total_amount_result = parseFloat(result_total_amount);
            $scope.total_qty_result = parseInt(result_total_qty);
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        $http.get(baselocation + "/api/v1/clients.php?m=" + el).success(function (response) {
            console.log(response);
            if (response[0].result) {

                for (var x = 0; x < response[0].data.length; x++) {
                    arr_partner_id.push(response[0].data[x].client_id);
                    arr_partner_name.push(response[0].data[x].name);
                }

                $scope.partners = arr_partner_name;

            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        setTimeout(function () {
            $('#tbl_records').dataTable({
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                bPaginate: false,
                bInfo: false
            });
            
            $('#page-wrapper').show();
            loadpage();
            
        }, 500);    
    });
    
    $scope.search = function () {
        
        $scope.partner_id = "";
        if ($scope.partner !== undefined && $scope.partner !== "") {
            for (var i = 0; i < arr_partner_name.length; i++) {
                if ($scope.partner.trim() === arr_partner_name[i].trim()) {
                    $scope.partner_id = arr_partner_id[i];
                    break;
                }
            }

            if (i === arr_partner_name.length) {
                $scope.partner_id = "";
            }
        }
        
        var sdate = $filter('date')(new Date(angular.element("#startdate").val()), "yyyy-MM-dd"),
            edate = $filter('date')(new Date(angular.element("#enddate").val()), "yyyy-MM-dd"),
            datefilter = "&startdate=" + sdate + "&enddate=" + edate;
        
        if($scope.partner_id !== "" && $scope.partner_id !== undefined) {
            datefilter += "&partner_id=" + $scope.partner_id;
        }
        
        $http.get(baselocation + "/api/v1/deliveries.php?m=" + el + isClient + datefilter).success(function (response) {
console.log(response);
            var result_total_amount = 0.00,
                result_total_qty = 0,
                y;
            
            if (response[0].result) {
                angular.element(".btn_export").show();
                $("#tbl_records").dataTable().fnDestroy();
                
                prepage();
                $('#page-wrapper').hide();
                
                $scope.deliveries = response[0].data;
                for(y = 0; y < response[0].data.length; y++){
                    result_total_amount += parseFloat(response[0].data[y].total_amt);
                    result_total_qty += parseInt(response[0].data[y].total_qty);
                }
                
                setTimeout(function () {
                    
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        bPaginate: false,
                        bInfo: false
                    });
                    
                    $('#page-wrapper').show();
                    loadpage();
                }, 500);
            } else {
                prepage();
                $('#page-wrapper').hide();
                $scope.deliveries = [];
                $("#tbl_records").dataTable().fnDestroy();
                
                setTimeout(function () {
                    //alert("No result found. Please try another filter.");
                    
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        bPaginate: false,
                        bInfo: false
                    });
                    
                    $('#page-wrapper').show();
                    loadpage();
                }, 500);
            }
            
            $scope.total_amount_result = parseFloat(result_total_amount);
            $scope.total_qty_result = parseInt(result_total_qty);
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
    }
    
}]);
