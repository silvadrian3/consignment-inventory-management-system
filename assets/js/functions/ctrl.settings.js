//company settings
app.controller('settingsCtrl', ['$scope', '$http', '$cookies', '$cookieStore', function ($scope, $http, $cookies, $cookieStore) {
    "use strict";
    prepage();
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-settings').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type');
    
    angular.element(document).ready(function () {
        $http.get(baselocation + "/api/v1/clients.php?m=" + el + "&client_id=" + ci).success(function (response) {
            console.log(response);    
            if (response[0].result) {

                $scope.companyname = response[0].data[0].name;
                $scope.address = response[0].data[0].address;
                $scope.email = response[0].data[0].email;
                $scope.phone = response[0].data[0].phone_no;
                $scope.mobile = response[0].data[0].mobile_no;
                $scope.file_id = response[0].data[0].file_id;
                $scope.location = response[0].data[0].location;
                $scope.url = response[0].data[0].url;
                $scope.file_name = response[0].data[0].file_name;
                $scope.facebook = response[0].data[0].facebook;
                $scope.instagram = response[0].data[0].instagram;
                $scope.twitter = response[0].data[0].twitter;

                if ($scope.file_name !== "") {
                    $scope.logo_url = $scope.url + $scope.location + $scope.file_name;
                    angular.element("#hdcompanyfilename").val($scope.file_name);

                } else {
                    $scope.logo_url = baselocation + "/assets/img/default-logo.jpg";
                    angular.element("#hdcompanyfilename").val("default-logo.jpg");
                }

                setTimeout(function () {
                    $('#page-wrapper').show();
                    loadpage();
                }, 500);
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
    });
    
    $scope.updateCompany = function () {
        
        if (angular.element("#hdcompanyfilename").val() !== $scope.file_name) {
        
            var params = {
                file_url: baselocation,
                file_location: '/files/companylogo/',
                file_name: angular.element("#hdcompanyfilename").val()
            };
            
            $http.post(baselocation + "/api/v1/files.php?m=" + el + "&ui=" + ui, params).success(function (response) {
             console.log(response);   
                if (response[0].result) {
                    $scope.updateData(response[0].data[0].id);
                    
                }
            }).error(function (msg) {
                $scope.onError(msg);
            });
            
        } else {
            $scope.updateData($scope.file_id);
        }
    };
    
    
    $scope.updateData = function (file_id) {
        var params = {
                user_id: ui,
                name: $scope.companyname,
                address: $scope.address,
                email: $scope.email,
                phone: $scope.phone,
                mobile: $scope.mobile,
                facebook: $scope.facebook,
                instagram: $scope.instagram,
                twitter: $scope.twitter,
                logo_id: file_id
            };
        
        $http.put(baselocation + "/api/v1/clients.php?m=" + el + "&ui=" + ui + "&client_id=" + ci + "&action=profile", params).success(function (response) {
console.log(response);
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    client_id: ci,
                    module: 'Settings',
                    activity: 'Update',
                    verb: 'Updated Business Details'
                };

                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
console.log(response);
                    if (response[0].result) {
                        $scope.clientresponse("Business details successfully updated.", 1);

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
    
}]);

//subscription
app.controller('subscriptionCtrl', ['$scope', function ($scope) {
    "use strict";
    prepage();
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-settings').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    setTimeout(function () {
        loadpage();
    }, 500);
}]);

//billing
app.controller('billingCtrl', ['$scope', function ($scope) {
    "use strict";
    prepage();
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-settings').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    setTimeout(function () {
        loadpage();
    }, 500);
}]);

/**
function _start_upload(filename) {
    "use strict";
	if (1 === CheckImgFileType(filename)) {
		
		var e = $("#" + filename).prop("files")[0],
			a = new FormData;
		a.append(filename, e), $.ajax({
			url: "../files/uploader.php?_file="+filename+"&type=company_logo",
			type: "POST",
			dataType: "html",
			cache: !1,
			contentType: !1,
			processData: !1,
			data: a,
			error: function(e) {
				alert('Unexpected error encountered.');
			},
			success: function(outsrc) {
                
				window.setTimeout(function() {
					$("#hdcompanyfilename").val(outsrc);
                    $("#logo").attr("src", "../../app/files/orig/" + outsrc);
					$("#uploadstatus").html("File uploaded successfully.");
					$("#uploadstatus").removeClass("text-danger");
					$("#uploadstatus").addClass("text-success");
                    
				}, 1000)
                
			}
		})
		
	} else {
		$("#" + status).html("Invalid image file.");
		$("#" + status).removeClass("text-success");
		$("#" + status).addClass("text-danger");
	}
}
*/