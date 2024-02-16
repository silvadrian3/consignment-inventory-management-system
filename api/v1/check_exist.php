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
    $input = json_decode(file_get_contents('php://input'), true);
    $data = array();
    
    isset($input["module"]) ? $module = mysqli_real_escape_string($nect, $input["module"]) : $module = "";
    isset($input["variable"]) ? $variable = mysqli_real_escape_string($nect, $input["variable"]) : $variable = "";
    isset($input["partner_id"]) ? $partner_id = mysqli_real_escape_string($nect, $input["partner_id"]) : $partner_id = "";
    
    if($module == 'product') {
        $query = "SELECT a.id FROM `products` as a INNER JOIN `client_products` as b ON (a.id=b.product_id) WHERE LOWER(name) = LOWER('". $variable ."') AND b.partner_id = '".$partner_id."'";
        
        $qresult = mysqli_query($nect, $query);
        
        $row_array['row'] = mysqli_num_rows($qresult);
        $row_array['query'] = $query;
        array_push($data, $row_array);
            
    } else if($module == 'partner') {
        $query = "SELECT id FROM `clients` WHERE LOWER(name) = LOWER('". $variable ."') AND status = 1";
        
        $qresult = mysqli_query($nect, $query);
        
        $row_array['row'] = mysqli_num_rows($qresult);
        array_push($data, $row_array);
        
            
    } else if($module == 'user') {
        $query = "SELECT id FROM `users` WHERE LOWER(email) = LOWER('". $variable ."') AND status = 1";
        
        $qresult = mysqli_query($nect, $query);
        
        if(mysqli_num_rows($qresult) != 0){
            $fetch_id = mysqli_fetch_array($qresult);
            $row_array['id'] = $fetch_id['id'];
        } else {
            $row_array['id'] = '';
        }
        
        array_push($data, $row_array);
    } else if($module == 'product_quantity') {
        $salesprodqty = 0;
        $currprodqty = 0;
        $salesprodqty = 0;
        
        if(isset($_GET["sales_id"])){
            $sales_id = $_GET["sales_id"];
            
            $qsalesprodqty = "SELECT a.quantity as qty FROM sales_breakdown as a INNER JOIN products as b ON (a.product_id = b.id) WHERE sales_id = '".$sales_id."' AND b.code = '". $variable ."'";
            $qresult = mysqli_query($nect, $qsalesprodqty);
        
            if(mysqli_num_rows($qresult) != 0){
                $fetch_qty = mysqli_fetch_array($qresult);
                $salesprodqty = $fetch_qty['qty'];
            }
            
            $qcurrprodqty = "SELECT qty FROM `products` WHERE code = '". $variable ."'";
            $qresult = mysqli_query($nect, $qcurrprodqty);
        
            if(mysqli_num_rows($qresult) != 0){
                $fetch_qty = mysqli_fetch_array($qresult);
                $currprodqty = $fetch_qty['qty'];
            }
            
            $totalprodqty = $salesprodqty + $currprodqty;
            
        } else {
            $query = "SELECT qty FROM `products` WHERE code = '". $variable ."'";
            $qresult = mysqli_query($nect, $query);
        
            if(mysqli_num_rows($qresult) != 0){
                $fetch_qty = mysqli_fetch_array($qresult);
                $totalprodqty = $fetch_qty['qty'];
            }
        }
        
        $row_array['qty'] = $totalprodqty;
        array_push($data, $row_array);
    }

    if($qresult){
        $out['result'] = true;        
        $out['data'] = $data;
        
    } else {
        _error(mysqli_error($nect));
        }

    array_push($result, $out);
    echo json_encode($result);
}

function _get(){
    // 
}

function _put(){
    //
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