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

    if($_GET['action'] == "delete"){
        $category_id = $input["category_id"];
        
        foreach($category_id as $cat_id){
            $modified_by = $_GET['ui'];
            $query = "UPDATE `product_categories` SET modified_by = '".$modified_by."', date_modified = '". $server_time ."' status = 0 WHERE id = '".$cat_id."'";
            $qresult = mysqli_query($nect, $query);
            if($qresult){
	        $out['result'] = true;
	    } else {
	        $out['result'] = false;
	        _error(mysqli_error($nect));
	    }
        }

    } else {
        $out['result'] = false;
    }

    array_push($result, $out);
    echo json_encode($result);
    
}

function _get(){
    //
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    
    if(isset($_GET['client_id']) && !empty($_GET['client_id'])){ // read
        $client_id = mysqli_real_escape_string($nect, $_GET['client_id']);

        $query = "SELECT a.id as category_id, a.name as 'category_name' FROM `product_categories` as a INNER JOIN `client_product_categories` as b ON (a.id=b.category_id) WHERE b.partner_id = '".$client_id."' AND status = 1";
        
        $qresult = mysqli_query($nect, $query);

        if($qresult){
            if(mysqli_num_rows($qresult)!=0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    $row_array['category_id'] = trim(stripslashes($fetchResult['category_id']));
                    $row_array['category_name'] = trim(stripslashes($fetchResult['category_name']));
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
        
    } else { // show all
        
    }
    
    
    
}

function _put(){
    
    include "../ctrl/con.php";
    $result = array();
    $input = json_decode(file_get_contents('php://input'), true);
    $client_id = $_GET["client_id"];
    
    foreach($input as $each){
        $category_id = mysqli_real_escape_string($nect, $each["id"]);
        $category_name = mysqli_real_escape_string($nect, $each["name"]);
        $modified_by = mysqli_real_escape_string($nect, $each["user_id"]);
        
        if($category_id != ""){ // update
            $query = "UPDATE `product_categories` SET name = '".$category_name."', modified_by = '".$modified_by."', date_modified = '". $server_time ."' WHERE id = '".$category_id."'";
            $qresult = mysqli_query($nect, $query);
        } else { // insert
            $query = "INSERT INTO `product_categories` (name, modified_by, status, date_modified) VALUES ('".$category_name."', '".$modified_by."', 1, '". $server_time ."')";
            $qresult = mysqli_query($nect, $query);
            
            if($qresult){
                $newcat_id = mysqli_insert_id($nect);
                $query = "INSERT INTO `client_product_categories` (partner_id, category_id) VALUES ('".$client_id."', '".$newcat_id."')";
                $qresult = mysqli_query($nect, $query);
            } else {
                _error(mysqli_error($nect));
            }
        }
    }
    
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