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
    
    isset($input["partner_id"]) ? $partner_id = mysqli_real_escape_string($nect, $input["partner_id"]) : $partner_id = 0;
    isset($input["delivery_id"]) ? $delivery_id = mysqli_real_escape_string($nect, $input["delivery_id"]) : $delivery_id = 0;
    isset($input["status"]) ? $status = mysqli_real_escape_string($nect, $input["status"]) : $status = "";
    isset($input["state"]) ? $state = mysqli_real_escape_string($nect, $input["state"]) : $state = "";
    isset($input["total_qty"]) ? $total_qty = mysqli_real_escape_string($nect, $input["total_qty"]) : $total_qty = 0;
    isset($input["total_amt"]) ? $total_amt = mysqli_real_escape_string($nect, $input["total_amt"]) : $total_amt = '0.00';
    isset($input["comment"]) ? $comment = mysqli_real_escape_string($nect, $input["comment"]) : $comment = "";
    
    $datecreated = date('Y-m-d H:i:s');
    $dateposted = '0000-00-00T00:00:00';
    
    if($state == "new") {
        $query = "INSERT INTO `delivery` (partner_id, total_qty, total_amt, date_created, date_posted, comment, modified_by, date_modified, status) VALUES ('". $partner_id ."','". $total_qty ."','". $total_amt ."','". $datecreated ."', '". $dateposted ."', '". $comment ."','". $modified_by ."', '" . $server_time . "', '". $status ."')";
        
        $qresult = mysqli_query($nect, $query);
                    
        if($qresult){
            $delivery_id = mysqli_insert_id($nect);

            foreach($input["transaction_arr"] as $brk){

                $product_id = $brk["product_id"];
                $price = $brk["price"];
                $qty = $brk["qty"];
                $amount = $brk["amount"];

                $query = "INSERT INTO `delivery_breakdown` (delivery_id, product_id, price, quantity, total) VALUES ('". $delivery_id ."', '". $product_id ."', '". $price ."', '". $qty ."','". $amount ."')";

                $qresult = mysqli_query($nect, $query);
                if($qresult){
                    $out['result'] = true;
                } else {
                    _error(mysqli_error($nect));
                }
            }

        } else {
            _error(mysqli_error($nect));
        }
        
    } else if ($state == "update"){
        
        $qDelete = "DELETE FROM delivery_breakdown WHERE delivery_id = '". $delivery_id ."'";
        
        $qresult = mysqli_query($nect, $qDelete);
        if($qresult){
            
            $qUpdate = "UPDATE `delivery` SET partner_id = '". $partner_id ."', total_qty = '". $total_qty ."', total_amt = '". $total_amt ."', comment = '". $comment ."', modified_by = '". $modified_by ."', date_modified = '". $server_time ."', status = '". $status ."' WHERE id = '". $delivery_id ."'";
            
            $qresult = mysqli_query($nect, $qUpdate);
            
            
            if($qresult) {
                foreach($input["transaction_arr"] as $brk){

                    $product_id = $brk["product_id"];
                    $price = $brk["price"];
                    $qty = $brk["qty"];
                    $amount = $brk["amount"];

                    $query = "INSERT INTO `delivery_breakdown` (delivery_id, product_id, price, quantity, total) VALUES ('". $delivery_id ."', '". $product_id ."', '". $price ."', '". $qty ."','". $amount ."')";

                    $qresult = mysqli_query($nect, $query);
                    if($qresult) {
                        $out['result'] = true;
                    } else {
                        _error(mysqli_error($nect));
                    }
                }
            } else {
                    _error(mysqli_error($nect));
                }
            
        } else {
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
            $partnerCondition = "b.id = '". $client_id ."' AND ";
        }
    
    if(isset($_GET['id']) && !empty($_GET['id'])){ // read with breakdown
        
        $delivery_id = mysqli_real_escape_string($nect, $_GET['id']);
        
        $query = "SELECT a.id as delivery_id, b.name as partner_name, a.total_qty, a.total_amt, a.comment, date(a.date_created) as date_created, date(a.date_posted) as date_posted, a.status FROM `delivery` as a INNER JOIN `clients` as b ON (a.partner_id = b.id) WHERE ". $partnerCondition ." a.status <> 'Deleted' AND a.id = '".$delivery_id."'";
        
        
        $qresult = mysqli_query($nect, $query);

        if($qresult){
            if(mysqli_num_rows($qresult)!=0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    $row_array['delivery_id'] = trim(stripslashes($fetchResult['delivery_id']));
                    $row_array['partner_name'] = trim(stripslashes($fetchResult['partner_name']));
                    $row_array['total_qty'] = trim(stripslashes($fetchResult['total_qty']));
                    $row_array['total_amt'] = trim(stripslashes($fetchResult['total_amt']));
                    $row_array['date_created'] = $fetchResult['date_created'];
                    $row_array['date_posted'] = $fetchResult['date_posted'];
                    $row_array['status'] = trim(stripslashes($fetchResult['status']));
                    $row_array['comment'] = $fetchResult['comment'];
                }

                $query = "SELECT a.name, a.code, b.description, b.price, b.quantity, b.total FROM `products` as a INNER JOIN `delivery_breakdown` as b ON (a.id = b.product_id) WHERE b.delivery_id = '". $delivery_id ."'";
                
                $qresult = mysqli_query($nect, $query);
                
                if($qresult){
                    
                    if(mysqli_num_rows($qresult) != 0){
                        while($fetchResult = mysqli_fetch_array($qresult)){
                            $row_arr['product_name'] = trim(stripslashes($fetchResult['name']));
                            $row_arr['product_code'] = trim(stripslashes($fetchResult['code']));
                            $row_arr['description'] = trim(stripslashes($fetchResult['description']));
                            $row_arr['price'] = trim(stripslashes($fetchResult['price']));
                            $row_arr['quantity'] = $fetchResult['quantity'];
                            $row_arr['amount'] = $fetchResult['total'];
                            array_push($breakdown, $row_arr);
                        }
                    }
                }
                
                $row_array['breakdown'] = $breakdown;
                
                array_push($data, $row_array);
                
                $out['result'] = true;
                $out['data'] = $data;
                
            } else {
                $out['result'] = false;
            }
        
        } else {
            _error(mysqli_error($nect));
        }
        
    } else { // show main list
        
        $fDatePosted = '';
        $fPartner = '';
        
        if((isset($_GET['startdate']) && !empty($_GET['startdate'])) && (isset($_GET['enddate']) && !empty($_GET['enddate']))){
            
            $startdate = $_GET['startdate'];
            $enddate = $_GET['enddate'];
            
            $fDatePosted = " AND (date(a.date_posted) BETWEEN '". $startdate ."' AND '" . $enddate . "')";
        }
        
        if(isset($_GET['partner_id']) && !empty($_GET['partner_id'])){
            $partner_id = $_GET['partner_id'];
            $fPartner = " AND b.id = '". $partner_id ."'";
        }
        
        $query = "SELECT a.id as delivery_id, b.name as partner_name, a.total_qty, a.total_amt, date(a.date_created) as date_created, date(a.date_posted) as date_posted, a.status FROM `delivery` as a INNER JOIN `clients` as b ON (a.partner_id = b.id) WHERE ". $partnerCondition ." a.status <> 'Deleted'" . $fDatePosted . $fPartner;
        
        $qresult = mysqli_query($nect, $query);

        if($qresult){
            if(mysqli_num_rows($qresult)!=0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    $row_array['delivery_id'] = trim(stripslashes($fetchResult['delivery_id']));
                    $row_array['partner_name'] = trim(stripslashes($fetchResult['partner_name']));
                    $row_array['total_qty'] = trim(stripslashes($fetchResult['total_qty']));
                    $row_array['total_amt'] = trim(stripslashes($fetchResult['total_amt']));
                    $row_array['date_created'] = $fetchResult['date_created'];
                    $row_array['date_posted'] = $fetchResult['date_posted'];
                    $row_array['status'] = trim(stripslashes($fetchResult['status']));
                    array_push($data, $row_array);
                }

                $out['result'] = true;
                $out['data'] = $data;
            } else {
                $out['result'] = false;
            }
        
        } else {
            _error(mysqli_error($nect));
        }
    }
    
    array_push($result, $out);
    echo json_encode($result);
}

function _put(){
    
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    $input = json_decode(file_get_contents('php://input'), true);
    
    $action = mysqli_real_escape_string($nect, $_GET["action"]);
    $modified_by = mysqli_real_escape_string($nect, $_GET["ui"]);
    $delivery_id = mysqli_real_escape_string($nect, $_GET["id"]);
    $datenow = date("Y-m-d H:i:s");
    
    if ($action == "approve") {
        
        $getDelProdQty = mysqli_query($nect, "SELECT product_id, quantity FROM `delivery_breakdown` WHERE delivery_id = '".$delivery_id."'");
        
        if(mysqli_num_rows($getDelProdQty) != 0){
            while($fetchDelProdQty = mysqli_fetch_array($getDelProdQty)){
                
                $del_product_id = $fetchDelProdQty["product_id"];
                $del_product_qty = $fetchDelProdQty["quantity"];
                
                $getProductQty = mysqli_query($nect, "SELECT qty FROM `products` WHERE id = '".$del_product_id."'");
                
                if(mysqli_num_rows($getProductQty)!=0) {
                    while($fetchProductQty = mysqli_fetch_array($getProductQty)){
                        $currect_product_qty = $fetchProductQty["qty"];                        
                        $new_prod_qty = $del_product_qty + $currect_product_qty;

                        $updateProductQty = mysqli_query($nect, "UPDATE `products` SET qty = '". $new_prod_qty ."', date_modified = '". $server_time ."' WHERE id = '".$del_product_id."'");
                        if($updateProductQty){
                            $query = "UPDATE `delivery` SET status = 'Posted', modified_by = '". $modified_by ."', date_posted = '". $datenow ."', date_modified = '". $server_time ."' WHERE id = '".$delivery_id."'";
                        } else {
                            _error(mysqli_error($nect));
                        }
                    }
                }
            }
        }
        
    } else if($action == "delete"){
        $query = "UPDATE `delivery` SET status = 'Deleted', modified_by = '". $modified_by ."', date_modified = '". $server_time ."' WHERE id = '".$delivery_id."'";
    } else if ($action == "cancel") {
        $query = "UPDATE `delivery` SET status = 'Cancelled', modified_by = '". $modified_by ."', date_modified = '". $server_time ."' WHERE id = '".$delivery_id."'";
    }
    
    $qresult = mysqli_query($nect, $query);
    
    if($qresult){
        $out['result'] = true;
    } else {
        _error(mysqli_error($nect));
    }
    

    array_push($result, $out);
    echo json_encode($result);
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