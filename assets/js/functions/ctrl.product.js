app.controller('productsCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '',
        removedcats = [];

    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-products').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/products.php?m=" + el + isClient).success(function (response) {

            if (response[0].result) {
                $scope.products = response[0].data;
                setTimeout(function () {
            
	            if(type == "client"){
	                $('#tbl_records').dataTable({
	                    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
	                    "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [-1]}],
	                    //"aaSorting": [2, 'asc']
	                });
	            } else {
	                $('#tbl_records').dataTable({
	                    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
	                    "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [-1]}],
	                });
	            }
	            
	            
	            $('#page-wrapper').show();
	            loadpage();
	            
	        }, 500);
            } else {
		$('#tbl_records').dataTable({
		    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
		    "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [-1]}],
		});
	        $('#page-wrapper').show();
	        loadpage();
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        
    });
    
    $scope.loadcategories = function () {
        $scope.categories = [];
        $http.get(baselocation + "/api/v1/category.php?m=" + el + isClient).success(function (response) {
        console.log(response);
            if (response[0].result) {
                
                $scope.categories = response[0].data;
            }
            
            if ($scope.categories.length === 0) {
                $scope.addCatRow();
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
    };
    
    $scope.addCatRow = function () {
        var data = {};
        data.name = '';
        $scope.categories.push(data);
    };
    
    $scope.removeCatRow = function (evt) {
        
        var row_id = evt.target.id,
            getClass = document.getElementById('catname_' + row_id).className,
            cat_id = getClass.substr(getClass.lastIndexOf("_") + 1);
        
		$scope.categories.splice(row_id, 1);
        
        if (cat_id !== undefined && cat_id !== "") {
            removedcats.push(cat_id);
        }

        if($scope.categories == 0){
            $scope.addCatRow();
        }

    };
    
    $scope.saveCategories = function () {
        if (!isEmpty(removedcats)) {
            var catparams = {
                category_id: removedcats
            };
            
            $http.post(baselocation + "/api/v1/category.php?m=" + el + "&ui=" + ui + isClient + "&action=delete", catparams).success(function (response) {
            console.log(response);
                if (!response[0].result) {
                    //$scope.clientresponse("Unexpected error encountered." + response, 0);
                    $scope.cat_result_msg = "Unexpected error encountered.";
                    $scope.cat_success = false;
                    $scope.cat_failed = true;
                    $scope.cat_display_result = true;
                    return false;
                }
            }).error(function (msg) {
                $scope.onError(msg);
            });
        }
        
        var params = [],
            arr,
            rowlen = angular.element('.categories').length - 1,
            x;
        
        for (x = 0; x <= rowlen; x++) {
            var getClass = document.getElementById('catname_' + x).className,
                cat_id = getClass.substr(getClass.lastIndexOf("_") + 1);
            arr = {
                user_id: ui,
                name: angular.element('#catname_' + x).val(),
                id: cat_id.trim()
            };
            
            params.push(arr);
        }
        
        $http.put(baselocation + "/api/v1/category.php?m=" + el + "&ui=" + ui + isClient, params).success(function (response) {
        console.log(response);
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    client_id: ci,
                    module: 'Product Categories',
                    activity: 'Update',
                    verb: 'Updated Product Categories'
                };

                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                    console.log(response);
                    if (response[0].result) {
                        
                        //$scope.clientresponse("Product categories successfully saved.", 1);
                        $scope.cat_result_msg = "Product categories successfully saved.";
                        $scope.cat_success = true;
                        $scope.cat_failed = false;
                        $scope.cat_display_result = true;
                        
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                        
                    } else {
                        //$scope.clientresponse("Unexpected error encountered." + response, 0);
                        $scope.cat_result_msg = "Unexpected error encountered.";
                        $scope.cat_success = false;
                        $scope.cat_failed = true;
                        $scope.cat_display_result = true;
                        return false;
                    }
                }).error(function (msg) {
                    $scope.onError(msg);
                });
            } else {
                //$scope.clientresponse("Unexpected error encountered." + response, 0);
                $scope.cat_result_msg = "Unexpected error encountered.";
                $scope.cat_success = false;
                $scope.cat_failed = true;
                $scope.cat_display_result = true;
                return false;
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
    };
   
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
        ischecked();
    });
    
    function ischecked() {
        if ($('.check_item:checked').length > 0) {
            $('#btn_printcodes').removeAttr('disabled');
        } else {
            $('#btn_printcodes').attr('disabled', 'disabled');
        }
    }
    
    $scope.checkCB = function (evt) {
        if (this.checked === false) {
            $("#chkAll")[0].checked = false;
        }
        
        if ($('.check_item:checked').length === $('.check_item').length) {
            $("#chkAll")[0].checked = true;
        } else {
            $("#chkAll")[0].checked = false;
        }
        ischecked();
    };
    
    $scope.printBarcodes = function () {
        
        var params = "?m=" + el;
        $(".check_item:checked").each(function () {
            params += "&p[]=" + $(this).val();
        });
        
        window.open("../api/ctrl/print.php" + params);
    };
    
    
    $scope.single_action = function (cat, id) {
        if (cat === 'r') { //read
            window.location = "#/product/view/" + id;
        } else if (cat === 'u') { //update
            window.location = "#/product/edit/" + id;
        } else if (cat === 'd') { //delete
            if (confirm("Are you sure you want to delete this Product?")) {
                $http.delete(baselocation + "/api/v1/products.php?m=" + el + "&ui=" + ui + "&id=" + id).success(function (response) {
                console.log(response);
                    if (response[0].result) {
                        var params = {
                            user_id: ui,
                            client_id: ci,
                            module: 'Products',
                            activity: 'Archive',
                            verb: 'Archived a Product'
                        };

                        $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                        console.log(response);
                            if (response[0].result) {
                                $scope.clientresponse("Product successfully deleted.", 1);

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
        var arr_product_id = [];
        angular.forEach($scope.products, function (item) {
            if (item.product) {
                arr_product_id.push(item.product_id);
            }
        });
        
        if (confirm("Are you sure you want to delete selected Product(s)?")) {
            var u_id = $cookieStore.get('user_id'),
                c_id = $cookieStore.get('client_id'),
                bit = true,
                params = {
                    user_id: u_id,
                    product_ids: arr_product_id
                };
            
            $http.post("http://localhost/flair/app/api/v1/products/multiple", params).success(function (response) {
                console.log(response);    
                if (response.result) {
                    var ui = u_id,
                        params = {
                            user_id: ui,
                            activity: "Delete Multiple Products"
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
                $scope.result_msg = "Product(s) successfully deleted.";
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
    };
    */
    
    
    /** 
    $scope.multiupdate = function () {
        var arr_product_id = "id=";
        angular.forEach($scope.products, function (item) {
            if (item.product) {
                arr_product_id = arr_product_id + item.product_id + '-';
            }
        });
        
        arr_product_id = arr_product_id.slice(0, -1);
        window.location = "#/product/update/?" + arr_product_id;
    };
    */
    
}]);


//Add
app.controller('addProductCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '';
    
    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-products').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    $scope.price = "0.00";
    $scope.qty = "0";
    
    angular.element(document).ready(function () {
        $http.get(baselocation + "/api/v1/category.php?m=" + el + isClient).success(function (response) {
            console.log(response);
            if (response[0].result) {
                $scope.categories = response[0].data;
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
    });
    
    $scope.checkProdExst = function () {
        
        if ($scope.name !== "" && $scope.name !== undefined) {
            var params = {
                    module: 'product',
                    variable: $scope.name,
                    partner_id: ci
                };
console.log(params);
            $http.post(baselocation + "/api/v1/check_exist.php?m=" + el, params).success(function (response) {
            console.log(response);
                if (response[0].result) {

                    if (response[0].data[0].row !== 0) {
                        alert('Product Name already exists.');
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
    
    $scope.addProduct = function () {
        angular.element('#btn_save').css("pointer-events", "none");
        var params = {
                name: $scope.name,
                category_id: angular.element("#category_id").val(),
                description: $scope.description,
                price: $scope.price,
                qty: $scope.qty
            };
        
        $http.post(baselocation + "/api/v1/products.php?m=" + el + "&ui=" + ui + isClient, params).success(function (response) {
        console.log(response);
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    client_id: ci,
                    module: 'Products',
                    activity: 'Add',
                    verb: 'Added a Product'
                };

                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                console.log(response);
                    if (response[0].result) {
                        $scope.clientresponse("Product successfully added.", 1);
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
        window.location = "#products";
    };
     
    setTimeout(function () {
        loadpage();
    }, 500);

}]);


//View
app.controller('viewProductCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
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
    angular.element('#nav-li-products').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/products.php?m=" + el + isClient + "&id=" + v_id).success(function (response) {
            console.log(response);
            if (response[0].result) {
                
                if (response[0].data[0].barcode !== "") {
                    $scope.barcode = response[0].data[0].barcode;
                } else {
                    $scope.barcode = na;
                }

                if (response[0].data[0].name !== "") {
                    $scope.name = response[0].data[0].name;
                } else {
                    $scope.name = na;
                }

                if (response[0].data[0].category !== "") {
                    $scope.category = response[0].data[0].category;
                } else {
                    $scope.category = na;
                }

                
                if (response[0].data[0].description !== "") {
                    $scope.description = response[0].data[0].description;
                } else {
                    $scope.description = na;
                }
                

                if (response[0].data[0].price !== "") {
                    $scope.price = response[0].data[0].price;
                } else {
                    $scope.price = na;
                }

                if (response[0].data[0].qty !== "") {
                    $scope.qty = response[0].data[0].qty;
                } else {
                    $scope.qty = na;
                }
                
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
    });
    
    $scope.gotoUpdate = function () {
        window.location = "#/product/edit/" + v_id;
    };
    
    $scope.gotoList = function () {
        window.location = "#products";
    };
    
    setTimeout(function () {
        loadpage();
    }, 500);
    
}]);


//Edit
app.controller('editProductCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '',
        v_id = $routeParams.id;
    
    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
    
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-products').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/products.php?m=" + el + isClient + "&id=" + v_id).success(function (response) {
        console.log(response);
            if (response[0].result) {
                $scope.name = response[0].data[0].name;
                $scope.category = response[0].data[0].category;
                $scope.description = response[0].data[0].description;
                $scope.price = response[0].data[0].price;
                $scope.qty = response[0].data[0].qty;
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        $http.get(baselocation + "/api/v1/category.php?m=" + el + isClient).success(function (response) {
        console.log(response);    
            if (response[0].result) {
                $scope.categories = response[0].data;
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        setTimeout(function () {
            loadpage();
        }, 500);
        
        
    });
    
    $scope.updateProduct = function () {
        var params = {
                name: $scope.name,
                category_id: angular.element("#category_id").val(),
                description: $scope.description,
                price: $scope.price,
                qty: $scope.qty
            };
        
        $http.put(baselocation + "/api/v1/products.php?m=" + el + "&ui=" + ui + isClient + "&id=" + v_id, params).success(function (response) {
        console.log(response);
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    client_id: ci,
                    module: 'Products',
                    activity: 'Update',
                    verb: 'Updated a Product'
                };

                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                    console.log(response);
                    if (response[0].result) {
                        $scope.clientresponse("Product details successfully updated.", 1);
            
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
        window.location = "#products";
    };
    
}]);

//Print
app.controller('printBarcodesCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '',
        removedcats = [];

    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-products').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/products.php?m=" + el + isClient).success(function (response) {
        console.log(response);
            if (response[0].result) {
                $scope.products = response[0].data;
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        setTimeout(function () {
            
            if(type == "client"){
                $('#tbl_records').dataTable({
                    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                    "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [0, -1]}],
                    "aaSorting": [1, 'asc']
                });
            } else {
                $('#tbl_records').dataTable({
                    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                    "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [-1]}],
                });
            }
            
            
            $('#page-wrapper').show();
            loadpage();
            ischecked();
        }, 500);
    });
    
    /**
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
        ischecked();
    });
    
    function ischecked() {
        if ($('.check_item:checked').length > 0) {
            $('#btn_printcodes').removeAttr('disabled');
        } else {
            $('#btn_printcodes').attr('disabled', 'disabled');
        }
    }
    
    $scope.checkCB = function (evt) {

        if (this.checked === false) {
            $("#chkAll")[0].checked = false;
        }
        
        if ($('.check_item:checked').length === $('.check_item').length) {
            $("#chkAll")[0].checked = true;
        } else {
            $("#chkAll")[0].checked = false;
        }
        ischecked();
        
    };
    */
    
    
    
}]);

