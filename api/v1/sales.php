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
    
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    $input = json_decode(file_get_contents('php://input'), true);

    $modified_by = mysqli_real_escape_string($nect, $_GET["ui"]);
    
    $state = $input["state"];
    isset($input["total_qty"]) ? $total_qty = mysqli_real_escape_string($nect, $input["total_qty"]) : $total_qty = "";
    isset($input["total_amt"]) ? $total_amt = mysqli_real_escape_string($nect, $input["total_amt"]) : $total_amt = "";
    isset($input["comment"]) ? $comment = mysqli_real_escape_string($nect, $input["comment"]) : $comment = "";
    isset($input["invoice_date"]) ? $invoice_date = mysqli_real_escape_string($nect, $input["invoice_date"]) : $invoice_date = "0000-00-00";
    
    if($invoice_date == ""){
        $invoice_date = "0000-00-00";
    }
    
    $transaction_date = date('Y-m-d H:i:s');
    
    if($state == "new"){
        $query = "INSERT INTO `sales` (total_qty, total_amt, invoice_date, comment, modified_by, transaction_date, date_modified) VALUES ('". $total_qty ."', '". $total_amt ."', '".$invoice_date."', '". $comment ."', '". $modified_by ."', '". $transaction_date ."', '".$server_time."')";

        $qresult = mysqli_query($nect, $query);

        if($qresult){
            $sales_id = mysqli_insert_id($nect);

            foreach($input["transaction_arr"] as $brk){

                $product_id = $brk["product_id"];
                $price = $brk["price"];
                $qty = $brk["qty"];
                $amount = $brk["amount"];

                $query = "INSERT INTO `sales_breakdown` (sales_id, product_id, price, quantity, total) VALUES ('". $sales_id ."', '". $product_id ."', '". $price ."', '". $qty ."','". $amount ."')";

                $qresult = mysqli_query($nect, $query);
                if($qresult){

                    $getProductQty = mysqli_query($nect, "SELECT qty FROM `products` WHERE id = '".$product_id."'");

                    if(mysqli_num_rows($getProductQty)!=0) {
                        while($fetchProductQty = mysqli_fetch_array($getProductQty)){
                            $currect_product_qty = $fetchProductQty["qty"];              
                            $new_prod_qty = $currect_product_qty - $qty;

                            $updateProductQty = mysqli_query($nect, "UPDATE `products` SET qty = '". $new_prod_qty ."', date_modified = '". $server_time ."' WHERE id = '".$product_id."'");
                            if($updateProductQty){
                                $out['result'] = true;
                            } else {
                            	$out['result'] = false;
                                _error(mysqli_error($nect));
                            }
                        }
                    }

                } else {
                    $out['result'] = false;
                    _error(mysqli_error($nect));
                }
            }

        } else {
            $out['result'] = false;
            _error(mysqli_error($nect));
        }
        
    
    } else if ($state == "update"){
        
        isset($input["sales_id"]) ? $sales_id = mysqli_real_escape_string($nect, $input["sales_id"]) : $sales_id = "";
        
        foreach($input["transaction_arr"] as $brk){

            $product_id = $brk["product_id"];
            $productQty = 0;
            $previousQty = 0;
            $newQty = 0;

            $prevSalesProdQty = "SELECT quantity FROM `sales_breakdown` WHERE sales_id = '".$sales_id."' AND product_id = '".$product_id."'";
            $getPrevSalesProdQty = mysqli_query($nect, $prevSalesProdQty);

            if(mysqli_num_rows($getPrevSalesProdQty)!=0){
                $fetchPrevSalesProdQty = mysqli_fetch_array($getPrevSalesProdQty);
                $previousQty = $fetchPrevSalesProdQty["quantity"];
            }

            $prodQty = "SELECT qty FROM `products` WHERE id = '".$product_id."'";
            $getProdQty = mysqli_query($nect, $prodQty);

            if(mysqli_num_rows($getProdQty)!=0){
                $fetchProdQty = mysqli_fetch_array($getProdQty);
                $productQty = $fetchProdQty["qty"];
            }

            $newQty = $productQty + $previousQty;

            $updateProductQty = mysqli_query($nect, "UPDATE `products` SET qty = '". $newQty ."', date_modified = '". $server_time ."' WHERE id = '".$product_id."'");
            
            if(!$updateProductQty){
            	$out['result'] = false;
                _error(mysqli_error($nect));
            }

        }

        $qDelete = "DELETE FROM sales_breakdown WHERE sales_id = '". $sales_id ."'";
        
        $qresult = mysqli_query($nect, $qDelete);
        if($qresult){
            
            $qUpdate = "UPDATE `sales` SET total_qty = '". $total_qty ."', total_amt = '". $total_amt ."', invoice_date = '".$invoice_date."', transaction_date = '". $transaction_date ."', comment = '". $comment ."', modified_by = '". $modified_by ."', date_modified = '". $server_time ."' WHERE id = '". $sales_id ."'";
            $qresult = mysqli_query($nect, $qUpdate);
            
            
            foreach($input["transaction_arr"] as $brk){

                $product_id = $brk["product_id"];
                $price = $brk["price"];
                $qty = $brk["qty"];
                $amount = $brk["amount"];

                $query = "INSERT INTO `sales_breakdown` (sales_id, product_id, price, quantity, total) VALUES ('". $sales_id ."', '". $product_id ."', '". $price ."', '". $qty ."','". $amount ."')";

                $qresult = mysqli_query($nect, $query);
                if($qresult){

                    $getProductQty = mysqli_query($nect, "SELECT qty FROM `products` WHERE id = '".$product_id."'");

                    if(mysqli_num_rows($getProductQty)!=0) {
                        while($fetchProductQty = mysqli_fetch_array($getProductQty)){
                            $currect_product_qty = $fetchProductQty["qty"];              
                            $new_prod_qty = $currect_product_qty - $qty;

                            $updateProductQty = mysqli_query($nect, "UPDATE `products` SET qty = '". $new_prod_qty ."', date_modified = '". $server_time ."' WHERE id = '".$product_id."'");
                            if($updateProductQty){
                                $out['result'] = true;
                            } else {
                                $out['result'] = false;
                                _error(mysqli_error($nect));
                            }
                        }
                    }

                } else {
                    $out['result'] = false;
                    _error(mysqli_error($nect));
                }
            }
            
        } else {
            $out['result'] = false;
            _error(mysqli_error($nect));
        }
    }
    
    array_push($result, $out);
    echo json_encode($result);
    
}

function _get(){
    //
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    $breakdown = array();
    
    $partnerCondition = "";
    if(isset($_GET['client_id']) && !empty($_GET['client_id'])){
        $client_id = mysqli_real_escape_string($nect, $_GET['client_id']);
        $partnerCondition = "d.id = '". $client_id ."' AND ";
    }
    
    $fTransactionDate = '';
    $fPartner = '';
        
        if((isset($_GET['startdate']) && !empty($_GET['startdate'])) && (isset($_GET['enddate']) && !empty($_GET['enddate']))){
            
            $startdate = $_GET['startdate'];
            $enddate = $_GET['enddate'];
            
            $fTransactionDate = "(date(f.invoice_date) BETWEEN '". $startdate ."' AND '" . $enddate . "')";
        }
        
        if(isset($_GET['partner_id']) && !empty($_GET['partner_id'])){
            $partner_id = $_GET['partner_id'];
            $fPartner = " AND d.id = '". $partner_id ."'";
        }
    
    
    if(isset($_GET['report']) && !empty($_GET['report'])){
        
        $query = "SELECT date(f.invoice_date) as invoice_date, a.sales_id, d.name as partner_name, b.name as product_name, b.code as product_code, e.name as category, a.price, a.quantity, a.discount, a.total FROM `sales_breakdown` as a INNER JOIN `products` as b ON (a.product_id = b.id) INNER JOIN `client_products` as c ON (b.id=c.product_id) INNER JOIN `clients` as d ON (c.partner_id = d.id) INNER JOIN `product_categories` as e ON (b.category_id = e.id) INNER JOIN `sales` as f ON (a.sales_id = f.id) WHERE " . $partnerCondition . $fTransactionDate . $fPartner . " ORDER BY date(f.transaction_date) DESC";

        $qresult = mysqli_query($nect, $query);

        if($qresult){
            if(mysqli_num_rows($qresult) != 0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    
                    $row_array['partner_name'] = trim(stripslashes($fetchResult['partner_name']));
                    $row_array['product_name'] = trim(stripslashes($fetchResult['product_name']));
                    $row_array['product_code'] = trim(stripslashes($fetchResult['product_code']));
                    $row_array['category'] = trim(stripslashes($fetchResult['category']));
                    $row_array['invoice_date'] = $fetchResult['invoice_date'];
                    $row_array['price'] = $fetchResult['price'];
                    $row_array['quantity'] = $fetchResult['quantity'];
                    $row_array['discount'] = $fetchResult['discount'];
                    $row_array['amount'] = $fetchResult['total'];
                    array_push($data, $row_array);    
                }
                
                $out['result'] = true;
                $out['data'] = $data;
            } else {
                $out['result'] = false;   
            }
        } else {
            $out['result'] = false;
            _error(mysqli_error($nect));
        }
        
    } 
    /**
    else if(isset($_GET['graph']) && !empty($_GET['graph'])){
        
        $query = "SELECT date(f.transaction_date) as transaction_date, SUM(a.total) as total_amount FROM `sales_breakdown` as a INNER JOIN `products` as b ON (a.product_id = b.id) INNER JOIN `client_products` as c ON (b.id=c.product_id) INNER JOIN `clients` as d ON (c.partner_id = d.id) INNER JOIN `product_categories` as e ON (b.category_id = e.id) INNER JOIN `sales` as f ON (a.sales_id = f.id) WHERE " . $partnerCondition . $fTransactionDate . $fPartner . " GROUP BY date(f.transaction_date)";

        $qresult = mysqli_query($nect, $query);

        if($qresult){
            if(mysqli_num_rows($qresult) != 0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    $row_array['transaction_date'] = $fetchResult['transaction_date'];
                    $row_array['total_amount'] = $fetchResult['total_amount'];
                    array_push($data, $row_array);    
                }
                
                $out['result'] = true;
                $out['data'] = $data;
            } else {
                $out['result'] = false;
                
            }
        } else {
            $out['result'] = mysqli_error($nect);
        }
    }
    */
    
    else {
        if(isset($_GET['id']) && !empty($_GET['id'])){ // read with breakdown
        
            $sales_id = mysqli_real_escape_string($nect, $_GET['id']);
            $query = "SELECT id as sales_id, total_qty, total_amt, invoice_date, date(transaction_date) as date_submitted, comment FROM `sales` WHERE id = '" . $sales_id . "'";

            $qresult = mysqli_query($nect, $query);

            if($qresult){
                if(mysqli_num_rows($qresult)!=0){
                    while($fetchResult = mysqli_fetch_array($qresult)){
                        $row_array['sales_id'] = $fetchResult['sales_id'];
                        $row_array['total_quantity'] = $fetchResult['total_qty'];
                        $row_array['total_amount'] = $fetchResult['total_amt'];
                        $row_array['invoice_date'] = $fetchResult['invoice_date'];
                        $row_array['date_submitted'] = $fetchResult['date_submitted'];
                        $row_array['comment'] = trim(stripslashes($fetchResult['comment']));
                    }

                    $query = "SELECT a.sales_id, d.name as partner_name, b.name as product_name, b.code as product_code, e.name as category, a.price, a.quantity, a.discount, a.total FROM `sales_breakdown` as a INNER JOIN `products` as b ON (a.product_id = b.id) INNER JOIN `client_products` as c ON (b.id=c.product_id) INNER JOIN `clients` as d ON (c.partner_id = d.id) INNER JOIN `product_categories` as e ON (b.category_id = e.id) WHERE a.sales_id = '". $sales_id ."'";

                    $qresult = mysqli_query($nect, $query);

                    if($qresult){
                        if(mysqli_num_rows($qresult) != 0){
                            while($fetchResult = mysqli_fetch_array($qresult)){
                                $row_arr['partner_name'] = trim(stripslashes($fetchResult['partner_name']));
                                $row_arr['product_name'] = trim(stripslashes($fetchResult['product_name']));
                                $row_arr['product_code'] = trim(stripslashes($fetchResult['product_code']));
                                $row_arr['category'] = trim(stripslashes($fetchResult['category']));
                                $row_arr['price'] = $fetchResult['price'];
                                $row_arr['quantity'] = $fetchResult['quantity'];
                                $row_arr['discount'] = $fetchResult['discount'];
                                $row_arr['amount'] = $fetchResult['total'];
                                array_push($breakdown, $row_arr);
                            }
                        }
                    } else {
                        $out['result'] = false;
                        _error(mysqli_error($nect));
                    }

                    $row_array['breakdown'] = $breakdown;

                    array_push($data, $row_array);

                    $out['result'] = true;
                    $out['data'] = $data;
                }

            } else {
                $out['result'] = false;
                _error(mysqli_error($nect));
            }

        } else { // show main list

            $query = "SELECT id as sales_id, total_qty, total_amt, invoice_date, date(transaction_date) as date_submitted, comment FROM `sales`";
            $qresult = mysqli_query($nect, $query);

            if($qresult){
                if(mysqli_num_rows($qresult)!=0){
                    while($fetchResult = mysqli_fetch_array($qresult)){
                        $row_array['sales_id'] = $fetchResult['sales_id'];
                        $row_array['total_qty'] = $fetchResult['total_qty'];
                        $row_array['total_amt'] = $fetchResult['total_amt'];
                        $row_array['invoice_date'] = $fetchResult['invoice_date'];
                        $row_array['date_submitted'] = $fetchResult['date_submitted'];
                        $row_array['comment'] = trim(stripslashes($fetchResult['comment']));
                        array_push($data, $row_array);
                    }
                    
                    $out['result'] = true;
                    $out['data'] = $data;
                } else {
                    $out['result'] = false;
                }

                
            } else {
                $out['result'] = false;
                _error(mysqli_error($nect));
            }
        }
    }
    
    array_push($result, $out);
    echo json_encode($result);
}

function _put(){
    /**
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    $input = json_decode(file_get_contents('php://input'), true);
    
    $action = mysqli_real_escape_string($nect, $_GET["action"]);
    $modified_by = mysqli_real_escape_string($nect, $_GET["ui"]);
    $delivery_id = mysqli_real_escape_string($nect, $_GET["id"]);
    $datenow = date("Y-m-d H:i:s");
    
    if ($action == "approve") {
        $query = "UPDATE `delivery` SET status = 'Posted', modified_by = '". $modified_by ."', date_modified = '". $server_time ."', date_posted = '". $datenow ."' WHERE id = '".$delivery_id."'";
    } else if($action == "delete"){
        $query = "UPDATE `delivery` SET status = 'Deleted', modified_by = '". $modified_by ."', date_modified = '". $server_time ."' WHERE id = '".$delivery_id."'";
    } else if ($action == "cancel") {
        $query = "UPDATE `delivery` SET status = 'Cancelled', modified_by = '". $modified_by ."', date_modified = '". $server_time ."' WHERE id = '".$delivery_id."'";
    }
    
    $qresult = mysqli_query($nect, $query);
                    
    if($qresult){
        $out['result'] = true;
    } else {
        $out['result'] = mysqli_error($nect);
    }

    array_push($result, $out);
    echo json_encode($result);
    */
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