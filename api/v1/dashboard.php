<?php 

if(isset($_GET['m']) && !empty($_GET['m'])){
    $k = '0100101001100101011100110111010101110011';
    $cof = md5($k);
    $fee = $_GET['m'];

    if($cof == $fee) {
        $method = $_SERVER['REQUEST_METHOD'];
        switch ($method) {
            case 'PUT': _put(); break;
            case 'POST': _post(); break;
            case 'GET': _get(); break;
            case 'DELETE': _delete(); break;
            default: _error('default'); break;
        }
    }
}


function _post(){

}

function _get(){
    
    include "../ctrl/con.php";
    
    $result = array();
    $graph = array();
    $weeklysales = array();
    $stat_summary = array();
    $delivery = array();
    $data = array();
    $activity = array();
    
    
    if(isset($_GET['mode']) && !empty($_GET['mode'])){
        $mode = $_GET['mode'];
        
        
        if($mode == 'partner'){
            
            $bit = true;
            $partner_id = $_GET['partner_id'];

            $startdate = date('Y-m-d', strtotime('monday this week'));
            $enddate = date('Y-m-d', strtotime('sunday this week'));
            
            
            $qGraph = "SELECT date(f.invoice_date) as invoice_date, COALESCE(SUM(a.total), 0.00) as total_amount FROM `sales_breakdown` as a INNER JOIN `products` as b ON (a.product_id = b.id) INNER JOIN `client_products` as c ON (b.id=c.product_id) INNER JOIN `clients` as d ON (c.partner_id = d.id) INNER JOIN `product_categories` as e ON (b.category_id = e.id) INNER JOIN `sales` as f ON (a.sales_id = f.id) WHERE d.id = '".$partner_id."' AND (date(f.invoice_date) BETWEEN '". $startdate ."' AND '" . $enddate . "') GROUP BY date(f.invoice_date)";

            $qresult = mysqli_query($nect, $qGraph);

            if($qresult){
                if(mysqli_num_rows($qresult) != 0){
                    while($fetchResult = mysqli_fetch_array($qresult)){
                        $invoice_date = $fetchResult['invoice_date'];
                        $total_amt = $fetchResult['total_amount'];
                        
                        $sales_array['invoice_date'] = $invoice_date;
                        $sales_array['total_amount'] = $total_amt;

                        array_push($weeklysales, $sales_array);
                    }
                }
                
                $begin = new DateTime($startdate);
                $end = new DateTime($enddate);
                $end = $end->modify('+1 day'); 

                $interval = new DateInterval('P1D');
                $daterange = new DatePeriod($begin, $interval ,$end);
                
                foreach($daterange as $date){
                    $graph_array['invoice_date'] = $date -> format("Y-m-d");
                    $total = '0.00';
                    foreach($weeklysales as $x){
                        if($date -> format("Y-m-d") == $x["invoice_date"]){    
                            $total = $x['total_amount'];
                            break;
                        }
                    }
                    $graph_array['total_amount'] = $total;
                    array_push($graph, $graph_array);
                }
                
                $result_arr['graph'] = $graph;
                
            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
            
            // summary
            
            $posted = 0;
            $pending = 0;
            $sold = 0;
            $sales = 0.00;
            
            $qPostedProducts = "SELECT COALESCE(SUM(total_qty), 0) as posted_products FROM `delivery` WHERE status = 'Posted' AND partner_id = '".$partner_id."'";
            
            $qresult = mysqli_query($nect, $qPostedProducts);
            
            if($qresult){
                if(mysqli_num_rows($qresult) != 0){
                    $fetchResult = mysqli_fetch_array($qresult);
                    $posted = $fetchResult["posted_products"];
                }
                
            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
            
            $qPendingDeliveries = "SELECT COUNT(*) as pending_deliveries FROM `delivery` where status = 'Pending' AND partner_id = '".$partner_id."'";
            
            $qresult = mysqli_query($nect, $qPendingDeliveries);
            
            if($qresult){
                if(mysqli_num_rows($qresult) != 0){
                    $fetchResult = mysqli_fetch_array($qresult);
                    $pending = $fetchResult["pending_deliveries"];
                }
                
            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
            
            
            $qSoldProducts = "SELECT COALESCE(SUM(quantity), 0) as total_sold FROM `sales_breakdown` as a INNER JOIN `client_products` as b ON (a.product_id = b.product_id) WHERE b.partner_id = '".$partner_id."'";
            
            $qresult = mysqli_query($nect, $qSoldProducts);
            
            if($qresult){
                if(mysqli_num_rows($qresult) != 0){
                    $fetchResult = mysqli_fetch_array($qresult);
                    $sold = $fetchResult["total_sold"];
                }
                
            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
            
            $qProductSales = "SELECT COALESCE(SUM(total), 0.00) as total_sales FROM `sales_breakdown` as a INNER JOIN `client_products` as b ON (a.product_id = b.product_id) WHERE b.partner_id = '".$partner_id."'";
            
            $qresult = mysqli_query($nect, $qProductSales);
            
            if($qresult){
                if(mysqli_num_rows($qresult) != 0){
                    $fetchResult = mysqli_fetch_array($qresult);
                    $sales = $fetchResult["total_sales"];
                }
                
            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
                        
            $result_arr['summary'] = array("posted" => $posted, "pending" => $pending, "sold" => $sold, "sales" => $sales);
            
            
            $qDeliveries = "SELECT a.id as delivery_id, b.name as partner_name, a.total_qty, a.total_amt, date(a.date_created) as date_created, date(a.date_posted) as date_posted, a.status FROM `delivery` as a INNER JOIN `clients` as b ON (a.partner_id = b.id) WHERE a.status = 'Posted' AND b.id = '".$partner_id."' ORDER BY a.date_created DESC";
        
            $qresult = mysqli_query($nect, $qDeliveries);

            if($qresult){
                if(mysqli_num_rows($qresult)!=0){
                    while($fetchResult = mysqli_fetch_array($qresult)){
                        $deliveries_arr['delivery_id'] = trim(stripslashes($fetchResult['delivery_id']));
                        $deliveries_arr['total_qty'] = trim(stripslashes($fetchResult['total_qty']));
                        $deliveries_arr['total_amt'] = trim(stripslashes($fetchResult['total_amt']));
                        $deliveries_arr['date_created'] = $fetchResult['date_created'];
                        $deliveries_arr['date_posted'] = $fetchResult['date_posted'];
                        array_push($delivery, $deliveries_arr);
                    }
                    $result_arr['delivery'] = $delivery;
                }

            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
            
            if($bit){
                array_push($data, $result_arr);
                $out['data'] = $data;
                $out['result'] = true;
            } else {
                $out['result'] = false;
            }
            
            
        } else if ($mode == 'admin'){
            $bit = true;
            $no_of_partners = 0;
            $no_of_products = 0;
            $no_of_deliveries = 0;
            
            $qGraph = "SELECT COALESCE(SUM(total), 0.00) as partner_sales, c.name as partner_name FROM `sales_breakdown` as a INNER JOIN `client_products` as b ON (a.product_id = b.product_id) INNER JOIN `clients` as c ON (b.partner_id=c.id) WHERE c.status = 1 GROUP BY b.partner_id ORDER BY partner_sales DESC LIMIT 5";

            $qresult = mysqli_query($nect, $qGraph);

            if($qresult){
                if(mysqli_num_rows($qresult) != 0){
                    while($fetchResult = mysqli_fetch_array($qresult)){
                        $graph_array['partner_sales'] = $fetchResult['partner_sales'];
                        $graph_array['partner_name'] = $fetchResult['partner_name'];
                        array_push($graph, $graph_array);
                    }
                }
                
                $result_arr['graph'] = $graph;
                
            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
            
            $qCntPartners = "SELECT COUNT(*) as cnt_partners FROM `users` as a INNER JOIN `clients` as b ON (a.id=b.representative_id) WHERE a.type = 'client' AND a.status = 1 AND b.status = 1";
            
            $qresult = mysqli_query($nect, $qCntPartners);
            
            if($qresult){
                if(mysqli_num_rows($qresult) != 0){
                    $fetchResult = mysqli_fetch_array($qresult);
                    $no_of_partners = $fetchResult["cnt_partners"];
                }
                
            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
            
            $qCntProducts = "SELECT COUNT(*) as cnt_products FROM `products` WHERE status = 1";
            
            $qresult = mysqli_query($nect, $qCntProducts);
            
            if($qresult){
                if(mysqli_num_rows($qresult) != 0){
                    $fetchResult = mysqli_fetch_array($qresult);
                    $no_of_products = $fetchResult["cnt_products"];
                }
                
            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
            
            $qCntDeliveries = "SELECT COUNT(*) as cnt_deliveries FROM `delivery` WHERE status <> 'Deleted'";
            
            $qresult = mysqli_query($nect, $qCntDeliveries);
            
            if($qresult){
                if(mysqli_num_rows($qresult) != 0){
                    $fetchResult = mysqli_fetch_array($qresult);
                    $no_of_deliveries = $fetchResult["cnt_deliveries"];
                }
                
            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
            
            $result_arr['summary'] = array("partners" => $no_of_partners, "products" => $no_of_products, "deliveries" => $no_of_deliveries);
            
            $qDeliveries = "SELECT a.id as delivery_id, b.name as partner_name, a.total_qty, a.total_amt, date(a.date_created) as date_created, date(a.date_posted) as date_posted, a.status FROM `delivery` as a INNER JOIN `clients` as b ON (a.partner_id = b.id) WHERE a.status = 'Posted' || a.status = 'Pending' ORDER BY a.date_created DESC";
        
            $qresult = mysqli_query($nect, $qDeliveries);

            if($qresult){
                if(mysqli_num_rows($qresult)!=0){
                    while($fetchResult = mysqli_fetch_array($qresult)){
                        $deliveries_arr['delivery_id'] = trim(stripslashes($fetchResult['delivery_id']));
                        $deliveries_arr['partner_name'] = trim(stripslashes($fetchResult['partner_name']));
                        $deliveries_arr['total_qty'] = trim(stripslashes($fetchResult['total_qty']));
                        $deliveries_arr['total_amt'] = trim(stripslashes($fetchResult['total_amt']));
                        $deliveries_arr['date_created'] = $fetchResult['date_created'];
                        $deliveries_arr['date_posted'] = $fetchResult['date_posted'];
                        $deliveries_arr['status'] = $fetchResult['status'];
                        array_push($delivery, $deliveries_arr);
                    }
                    $result_arr['delivery'] = $delivery;
                }

            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
            
            $qActivities = "SELECT a.verb as activity, b.name as partner_name, date(a.activity_date) as activity_date FROM `activity_logs` as a INNER JOIN `clients` as b ON (a.client_id = b.id) INNER JOIN `users` as c ON (a.user_id = c.id) WHERE c.type = 'client' AND a.activity NOT IN ('Log In', 'Log Out') ORDER BY a.activity_date DESC LIMIT 5";
        
            $qresult = mysqli_query($nect, $qActivities);

            if($qresult){
                if(mysqli_num_rows($qresult)!=0){
                    while($fetchResult = mysqli_fetch_array($qresult)){
                        $activities_arr['activity'] = trim(stripslashes($fetchResult['activity']));
                        $activities_arr['partner_name'] = trim(stripslashes($fetchResult['partner_name']));
                        $activities_arr['activity_date'] = trim(stripslashes($fetchResult['activity_date']));
                        array_push($activity, $activities_arr);
                    }
                    $result_arr['activity'] = $activity;
                }

            } else {
                $bit = false;
                _error(mysqli_error($nect));
            }
            
            if($bit){
                array_push($data, $result_arr);
                $out['data'] = $data;
                $out['result'] = true;
            } else {
                $out['result'] = false;
            }
        }
    }
    
    
    array_push($result, $out);
    echo json_encode($result);
}

function _put(){

}

function _delete(){
    
}

function _error($m){
    $result = array();
    $out['result'] = false;
    $out['error'] = $m;
    
    array_push($result, $out);
    echo json_encode($result);
    die();
}


?>