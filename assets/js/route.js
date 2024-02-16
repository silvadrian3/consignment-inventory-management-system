var app = angular.module("myApp", ["chart.js", "ngRoute", "ngCookies"]);

app.run(function($rootScope, $templateCache) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });
});

app.config(function ($routeProvider) {
    "use strict";
    $routeProvider
    
    //Dashboard
        .when("/", {
            templateUrl : "view/dashboard.html",
            cache : false,
            controller : "dashboardCtrl"
        })
    
    //Company Settings
        .when("/settings", {
            templateUrl : "view/settings.html",
            cache : false,
            controller : "settingsCtrl"
        })
    
        .when("/subscription", {
            templateUrl : "view/subscription.html",
            cache : false,
            controller : "subscriptionCtrl"
        })
        
        .when("/billing", {
            templateUrl : "view/billing.html",
            cache : false,
            controller : "billingCtrl"
        })
    
    //Partner
        .when("/partners", {
            templateUrl : "view/partner/index.html",
            cache : false,
            controller : "partnersCtrl"
        })
    
        .when("/partner/add", {
            templateUrl : "view/partner/add.html",
            cache : false,
            controller : "addPartnerCtrl"
        })
    
        .when('/partner/view/:id', {
            templateUrl: 'view/partner/view.html',
            cache : false,
            controller: 'viewPartnerCtrl'
        })

        .when('/partner/edit/:id', {
            templateUrl: 'view/partner/edit.html',
            cache : false,
            controller: 'editPartnerCtrl'
        })

        .when('/partner/update', {
            templateUrl: 'view/partner/update.html',
            cache : false,
            controller: 'editMultiplePartnerCtrl'
        })

        .when("/partner/import", {
            templateUrl : "view/partner/import.html",
            cache : false,
            controller : "importPartnerCtrl"
        })

    //Delivery
        .when("/deliveries", {
            templateUrl : "view/delivery/index.html",
            cache : false,
            controller : "deliveriesCtrl"
        })

        .when("/delivery/add", {
            templateUrl : "view/delivery/add.html",
            cache : false,
            controller : "addDeliveryCtrl"
        })

        .when('/delivery/view/:id', {
            templateUrl: 'view/delivery/view.html',
            cache : false,
            controller: 'viewDeliveryCtrl'
        })

        .when('/delivery/edit/:id', {
            templateUrl: 'view/delivery/edit.html',
            cache : false,
            controller: 'editDeliveryCtrl'
        })

        .when('/delivery/update', {
            templateUrl: 'view/delivery/update.html',
            cache : false,
            controller: 'editMultipleDeliveryCtrl'
        })

        .when("/delivery/import", {
            templateUrl : "view/delivery/import.html",
            cache : false,
            controller : "importDeliveryCtrl"
        })

    //Products
        .when("/products", {
            templateUrl : "view/product/index.html",
            cache : false,
            controller : "productsCtrl"
        })

        .when("/product/add", {
            templateUrl : "view/product/add.html",
            cache : false,
            controller : "addProductCtrl"
        })

        .when('/product/view/:id', {
            templateUrl: 'view/product/view.html',
            cache : false,
            controller: 'viewProductCtrl'
        })

        .when('/product/edit/:id', {
            templateUrl: 'view/product/edit.html',
            cache : false,
            controller: 'editProductCtrl'
        })

        .when('/product/update', {
            templateUrl: 'view/product/update.html',
            cache : false,
            controller: 'editMultipleProductCtrl'
        })

        .when("/product/import", {
            templateUrl : "view/product/import.html",
            cache : false,
            controller : "importProductCtrl"
        })
    
        .when("/product/barcodes", {
            templateUrl : "view/product/print.html",
            cache : false,
            controller : "printBarcodesCtrl"
        })

    //Sales
        .when("/sales", {
            templateUrl : "view/sales/index.html",
            cache : false,
            controller : "salesCtrl"
        })

        .when("/sales/add", {
            templateUrl : "view/sales/add.html",
            cache : false,
            controller : "addSalesCtrl"
        })
    
        .when("/sales/edit/:id", {
            templateUrl : "view/sales/edit.html",
            cache : false,
            controller : "editSalesCtrl"
        })
    
        .when("/sales/view/:id", {
            templateUrl : "view/sales/view.html",
            cache : false,
            controller : "viewSalesCtrl"
        })

    //Sales Reports
        .when("/reports", {
            templateUrl : "view/reports/sales.html",
            cache : false,
            controller : "sales_reportsCtrl"
        })

        .when("/report/sales", {
            templateUrl : "view/reports/sales.html",
            cache : false,
            controller : "sales_reportsCtrl"
        })

    //Delivery Reports
        .when("/report/delivery", {
            templateUrl : "view/reports/delivery.html",
            cache : false,
            controller : "delivery_reportsCtrl"
        })

    //Profile    
        .when("/profile", {
            templateUrl : "view/profile.html",
            cache : false,
            controller : "profileCtrl"
        })

        .when("/changepassword", {
            templateUrl : "view/changepassword.html",
            cache : false,
            controller : "changepasswordCtrl"
        });
});