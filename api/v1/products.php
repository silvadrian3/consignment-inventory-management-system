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

    $client_id = mysqli_real_escape_string($nect, $_GET['client_id']);
    $modified_by = mysqli_real_escape_string($nect, $_GET["ui"]);
    
    isset($input["name"]) ? $name = mysqli_real_escape_string($nect, $input["name"]) : $name = "";
    isset($input["category_id"]) ? $category_id = mysqli_real_escape_string($nect, $input["category_id"]) : $category_id = "";
    isset($input["description"]) ? $description = mysqli_real_escape_string($nect, $input["description"]) : $description = "";
    isset($input["price"]) ? $price = mysqli_real_escape_string($nect, $input["price"]) : $price = "";
    isset($input["qty"]) ? $qty = mysqli_real_escape_string($nect, $input["qty"]) : $qty = "";
    
    $query = "INSERT INTO `products` (category_id, name, description, price, qty, modified_by, date_modified) VALUES ('". $category_id ."','". $name ."','". $description ."','". $price ."','". $qty ."','". $modified_by ."', '". $server_time ."')";
    
    $qresult = mysqli_query($nect, $query);
                    
    if($qresult){
        $product_id = mysqli_insert_id($nect);
        
        $query = "INSERT INTO `client_products` (partner_id, product_id) VALUES ('". $client_id ."','". $product_id ."')";
        $qresult = mysqli_query($nect, $query);
        if($qresult){
            
            $query = "UPDATE `products` SET code = '".$client_id . $modified_by . $product_id."', date_modified = '". $server_time ."' WHERE id = '".$product_id."'";
            $qresult = mysqli_query($nect, $query);
            if($qresult){
                $out['result'] = true;
            } else {
                _error(mysqli_error($nect));
            }
            
        } else {
            _error(mysqli_error($nect));
        }
        

    } else {
        _error(mysqli_error($nect));
    }

    array_push($result, $out);
    echo json_encode($result);
    
}

function _get(){
    //
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    
    $partnerCondition = "";
        if(isset($_GET['client_id']) && !empty($_GET['client_id'])){
            $client_id = mysqli_real_escape_string($nect, $_GET['client_id']);
            $partnerCondition = "d.partner_id = '". $client_id ."' AND ";
        }
    
    if(isset($_GET['id']) && !empty($_GET['id'])){ // read
        
        $product_id = mysqli_real_escape_string($nect, $_GET['id']);
        
        $query = "SELECT a.id as product_id, b.name as category, CONCAT(c.url, c.location, c.file_name) as product_image, a.name as product_name, a.code, a.description, a.qty, a.price, e.name as partner_name FROM `products` as a INNER JOIN `product_categories` as b ON (a.category_id = b.id) LEFT JOIN `files` as c ON (a.image_id = c.id) INNER JOIN `client_products` as d ON (a.id = d.product_id) INNER JOIN `clients` as e ON (d.partner_id = e.id) WHERE ". $partnerCondition ."  a.id = '". $product_id ."' AND a.status = 1 AND e.status = 1";
        
    } else { // show all
        $query = "SELECT a.id as product_id, b.name as category, CONCAT(c.url, c.location, c.file_name) as product_image, a.name as product_name, a.code, a.description, a.qty, a.price, e.name as partner_name FROM `products` as a INNER JOIN `product_categories` as b ON (a.category_id = b.id) LEFT JOIN `files` as c ON (a.image_id = c.id) INNER JOIN `client_products` as d ON (a.id = d.product_id) INNER JOIN `clients` as e ON (d.partner_id = e.id) WHERE ". $partnerCondition ." a.status = 1 AND e.status = 1";
    }
        
        $qresult = mysqli_query($nect, $query);

        if($qresult){
            if(mysqli_num_rows($qresult)!=0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    $row_array['product_id'] = trim(stripslashes($fetchResult['product_id']));
                    $row_array['partner_name'] = trim(stripslashes($fetchResult['partner_name']));
                    $row_array['category'] = trim(stripslashes($fetchResult['category']));
                    $row_array['product_image'] = trim(stripslashes($fetchResult['product_image']));
                    $row_array['name'] = trim(stripslashes($fetchResult['product_name']));
                    $row_array['code'] = trim(stripslashes($fetchResult['code']));
                    $row_array['barcode'] = "../api/ctrl/barcode.php?codetype=Code128&text=" . trim(stripslashes($fetchResult['code'])) . "&print=true";
                    $row_array['description'] = trim(stripslashes($fetchResult['description']));
                    $row_array['price'] = trim(stripslashes($fetchResult['price']));
                    $row_array['qty'] = trim(stripslashes($fetchResult['qty']));
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
    
    array_push($result, $out);
    echo json_encode($result);
}

function _put(){
    
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    $input = json_decode(file_get_contents('php://input'), true);

    $client_id = mysqli_real_escape_string($nect, $_GET['client_id']);
    $modified_by = mysqli_real_escape_string($nect, $_GET["ui"]);
    
    isset($input["name"]) ? $name = mysqli_real_escape_string($nect, $input["name"]) : $name = "";
    isset($input["category_id"]) ? $category_id = mysqli_real_escape_string($nect, $input["category_id"]) : $category_id = "";
    isset($input["description"]) ? $description = mysqli_real_escape_string($nect, $input["description"]) : $description = "";
    isset($input["price"]) ? $price = mysqli_real_escape_string($nect, $input["price"]) : $price = "";
    isset($input["qty"]) ? $qty = mysqli_real_escape_string($nect, $input["qty"]) : $qty = "";
    
    if(isset($_GET['id']) && !empty($_GET['id'])){
        $product_id = mysqli_real_escape_string($nect, $_GET['id']);
        $query = "UPDATE `products` SET category_id = '" . $category_id . "',  name = '" . $name . "', description = '" . $description . "', price = '" . $price . "', qty = '" . $qty . "', modified_by = '". $modified_by ."', date_modified = '". $server_time ."' WHERE id = '" . $product_id . "'";
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
    include "../ctrl/con.php";
    $result = array();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    isset($_GET["id"]) ? $product_id = mysqli_real_escape_string($nect, $_GET["id"]) : $product_id = "";
    $modified_by = $_GET['ui'];
    
    $query = "UPDATE `products` SET status = '0', modified_by = '". $modified_by ."', date_modified = '". $server_time ."' WHERE id = '".$product_id."'";
    $qresult = mysqli_query($nect, $query);
    
    if($qresult){
        $out['result'] = true;
    } else {
        _error(mysqli_error($nect));
        }

    array_push($result, $out);
    echo json_encode($result);
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