app.config(['ChartJsProvider', function (ChartJsProvider) {
    "use strict";
    ChartJsProvider.setOptions({
        chartColors: [
            'rgba(220,220,220,1)',
            'rgba(151,187,205,1)',
            'rgba(148,159,177,1)',
            'rgba(247,70,74,1)',
            'rgba(70,191,189,1)',
            'rgba(253,180,92,1)'
        ]
    });
}]);


app.controller('dashboardCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter',  function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    $scope.today = new Date();
    prepage();
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-dashboard').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '';
    
    angular.element(document).ready(function () {
    
        if (type === "client") {
            var arr_invoice_date = [],
                arr_total_sales = [],
                date = new Date(),
                first = (date.getDate()) - date.getDay(),
                last = first + 6,
                sdate = $filter('date')(new Date(date.setDate(first)), "yyyy-MM-dd"),
                edate = $filter('date')(new Date(date.setDate(last)), "yyyy-MM-dd"),
                datefilter = "&startdate=" + sdate + "&enddate=" + edate;

            $http.get(baselocation + "/api/v1/dashboard.php?m=" + el + "&mode=partner&partner_id=" + ci + datefilter).success(function (response) {
                
                var gTotalAmount = 0.00,
                    gInvoiceDate,
                    invoice_date,
                    d2day,
                    i,
                    x;
/**                
                for (i = 0; i < 7; i++) {
                    d2day = $filter('date')(new Date(date.setDate(first + i)), "yyyy-mm-dd");
                    for (x = 0; x < response[0].data[0].graph.length; x++) {
                        transaction_date = response[0].data[0].graph[x].transaction_date;
                        if (transaction_date === d2day) {
                            gInvoiceDate = transaction_date;
                            gTotalAmount = response[0].data[0].graph[x].total_amount;
                            break;
                        } else {
                            gInvoiceDate = d2day;
                            gTotalAmount = 0.00;
                        }
                    }

                    arr_invoice_date.push($filter('date')(gInvoiceDate, "EEE, MMM dd"));
                    arr_total_sales.push(gTotalAmount);
                }
*/
                    for (x = 0; x < response[0].data[0].graph.length; x++) {
                        arr_invoice_date.push($filter('date')(new Date(response[0].data[0].graph[x].invoice_date), "EEE, MMM dd"));
                        arr_total_sales.push(response[0].data[0].graph[x].total_amount);
                    }

                $scope.posted_product = response[0].data[0].summary.posted;
                $scope.pending_deliveries = response[0].data[0].summary.pending;
                $scope.total_items = response[0].data[0].summary.sold;
                $scope.total_sales = response[0].data[0].summary.sales;
                $scope.deliveries = response[0].data[0].delivery;
                $scope.labels = arr_invoice_date;
                $scope.data = arr_total_sales;
                $scope.options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMin: 0,
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    return $filter('currency')(value, "P ");
                                }
                            }
                        }]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var label = data.labels[tooltipItem.index],
                                    datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return $filter('currency')(datasetLabel, "P ");
                            }
                        }
                    }
                };

            }).error(function (msg) {
                $scope.onError(msg);
            });
        } else {
            var arr_partner_name = [],
                arr_partner_sales = [],
                partner_name,
                partner_sales,
                x;

            $http.get(baselocation + "/api/v1/dashboard.php?m=" + el + "&mode=admin").success(function (response) {
                console.log(response);
                if(response[0].data[0].graph.length > 0){
                    for (x = 0; x < response[0].data[0].graph.length; x++) {
                        partner_name = response[0].data[0].graph[x].partner_name;
                        partner_sales = response[0].data[0].graph[x].partner_sales;
                        arr_partner_name.push(partner_name);
                        arr_partner_sales.push(partner_sales);
                    }
                } else {
                    arr_partner_sales.push(0);
                    arr_partner_name.push('');
                }
                
                
                $scope.no_of_partners = response[0].data[0].summary.partners;
                $scope.no_of_products = response[0].data[0].summary.products;
                $scope.no_of_deliveries = response[0].data[0].summary.deliveries;
                $scope.deliveries = response[0].data[0].delivery;
                $scope.activities = response[0].data[0].activity;
                
                $scope.labels = arr_partner_name;
                $scope.data = arr_partner_sales;
                $scope.options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMin: 0,
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    return $filter('currency')(value, "P ");
                                }
                            }
                        }]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var label = data.labels[tooltipItem.index],
                                    datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return $filter('currency')(datasetLabel, "P ");
                            }
                        }
                    }
                };

            }).error(function (msg) {
                $scope.onError(msg);
            });
        }
        
        setTimeout(function () {
            $('#tbl_records').dataTable({
                "lengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
                "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [-1]}],
                aaSorting: [[0, 'desc']]
            });
            
            $('#page-wrapper').show();
            loadpage();
            
        }, 500);
    
    });
    
    
    $scope.redirect = function (page) {
        var loc = "";
        
        if (page === 'partners') {
            loc = "#partners";
        } else if (page === 'deliveries') {
            loc = "#deliveries";
        } else if (page === 'products') {
            loc = "#products";
        }
        
        window.location = loc;
    };
    
    $scope.single_action = function (cat, id) {
        if (cat === 'r') { //read
            window.location = "#/delivery/view/" + id;
        }
    };
    
}]);