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
    
    isset($input["user_id"]) ? $user_id = mysqli_real_escape_string($nect, $input["user_id"]) : $user_id = "";
    isset($input["name"]) ? $name = mysqli_real_escape_string($nect, $input["name"]) : $name = "";
    isset($input["email"]) ? $email = mysqli_real_escape_string($nect, $input["email"]) : $email = "";
    isset($input["phone"]) ? $phone = mysqli_real_escape_string($nect, $input["phone"]) : $phone = "";
    isset($input["mobile"]) ? $mobile = mysqli_real_escape_string($nect, $input["mobile"]) : $mobile = "";
    isset($input["address"]) ? $address = mysqli_real_escape_string($nect, $input["address"]) : $address = "";
    isset($input["facebook"]) ? $facebook = mysqli_real_escape_string($nect, $input["facebook"]) : $facebook = "";
    isset($input["instagram"]) ? $instagram = mysqli_real_escape_string($nect, $input["instagram"]) : $instagram = "";
    isset($input["twitter"]) ? $twitter = mysqli_real_escape_string($nect, $input["twitter"]) : $twitter = "";
    isset($input["logo_id"]) ? $logo_id = mysqli_real_escape_string($nect, $input["logo_id"]) : $logo_id = "";
    isset($input["status"]) ? $status = mysqli_real_escape_string($nect, $input["status"]) : $status = 1;
    $modified_by = $_GET['ui'];
    
    $query = "INSERT INTO `clients` (name, email, phone_no, mobile_no, address, representative_id, facebook, instagram, twitter, modified_by, status, date_modified) VALUES ('". $name ."', '". $email ."', '". $phone ."', '". $mobile ."', '". $address ."', '" . $user_id . "', '" . $facebook . "', '" . $instagram . "', '" . $twitter . "', '" . $modified_by . "', '" . $status . "', '" . $server_time . "')";

    $qresult = mysqli_query($nect, $query);

    if($qresult){
        $row_array['id'] = mysqli_insert_id($nect);
        array_push($data, $row_array);
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
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    
    if(isset($_GET['client_id']) && !empty($_GET['client_id'])){ // read
        $client_id = mysqli_real_escape_string($nect, $_GET['client_id']);

        $query = "SELECT a.id as client_id, a.name, a.email, a.phone_no, a.mobile_no, a.address, a.facebook, a.instagram, a.twitter, b.id as file_id, b.url, b.location, b.file_name, c.id as user_id, c.firstname, c.lastname, a.status FROM `clients` as a LEFT JOIN `files` as b ON (a.logo_id = b.id) INNER JOIN `users` as c ON (a.representative_id = c.id) WHERE a.id = '" . $client_id . "' AND a.status <> 0";
        
    } else { // show all
        $query = "SELECT a.id as client_id, a.name, a.email, a.phone_no, a.mobile_no, a.address, a.facebook, a.instagram, a.twitter, b.id as file_id, b.url, b.location, b.file_name, c.id as user_id, c.firstname, c.lastname, a.status FROM `clients` as a LEFT JOIN `files` as b ON (a.logo_id = b.id) INNER JOIN `users` as c ON (a.representative_id = c.id) WHERE c.type = 'client' AND a.status <> 0";
    }
    
        $qresult = mysqli_query($nect, $query);

        if($qresult){
            if(mysqli_num_rows($qresult)!=0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    $row_array['client_id'] = trim(stripslashes($fetchResult['client_id']));
                    $row_array['name'] = trim(stripslashes($fetchResult['name']));
                    $row_array['email'] = trim(stripslashes($fetchResult['email']));
                    $row_array['phone_no'] = trim(stripslashes($fetchResult['phone_no']));
                    $row_array['mobile_no'] = trim(stripslashes($fetchResult['mobile_no']));
                    $row_array['address'] = trim(stripslashes($fetchResult['address']));
                    $row_array['file_id'] = trim(stripslashes($fetchResult['file_id']));
                    $row_array['url'] = trim(stripslashes($fetchResult['url']));
                    $row_array['location'] = trim(stripslashes($fetchResult['location']));
                    $row_array['file_name'] = trim(stripslashes($fetchResult['file_name']));
                    $row_array['facebook'] = trim(stripslashes($fetchResult['facebook']));
                    $row_array['instagram'] = trim(stripslashes($fetchResult['instagram']));
                    $row_array['twitter'] = trim(stripslashes($fetchResult['twitter']));
                    $row_array['user_id'] = trim(stripslashes($fetchResult['user_id']));
                    $row_array['representative_firstname'] = trim(stripslashes($fetchResult['firstname']));
                    $row_array['representative_lastname'] = trim(stripslashes($fetchResult['lastname']));
                    $row_array['client_status'] = trim(stripslashes($fetchResult['status']));
                                                      
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
    
    $input = json_decode(file_get_contents('php://input'), true);
    isset($input["user_id"]) ? $user_id = mysqli_real_escape_string($nect, $input["user_id"]) : $user_id = "";
    isset($input["name"]) ? $name = mysqli_real_escape_string($nect, $input["name"]) : $name = "";
    isset($input["email"]) ? $email = mysqli_real_escape_string($nect, $input["email"]) : $email = "";
    isset($input["phone"]) ? $phone = mysqli_real_escape_string($nect, $input["phone"]) : $phone = "";
    isset($input["mobile"]) ? $mobile = mysqli_real_escape_string($nect, $input["mobile"]) : $mobile = "";
    isset($input["address"]) ? $address = mysqli_real_escape_string($nect, $input["address"]) : $address = "";
    isset($input["facebook"]) ? $facebook = mysqli_real_escape_string($nect, $input["facebook"]) : $facebook = "";
    isset($input["instagram"]) ? $instagram = mysqli_real_escape_string($nect, $input["instagram"]) : $instagram = "";
    isset($input["twitter"]) ? $twitter = mysqli_real_escape_string($nect, $input["twitter"]) : $twitter = "";
    isset($input["logo_id"]) ? $logo_id = mysqli_real_escape_string($nect, $input["logo_id"]) : $logo_id = "";
    $modified_by = $_GET['ui'];
    $client_id = $_GET['client_id'];
    
    if($_GET['action'] == "profile"){
        $query = "UPDATE `clients` SET name = '".$name."', email = '".$email."', phone_no = '" . $phone . "', mobile_no = '" . $mobile . "', address = '" . $address . "', facebook = '". $facebook  ."',  instagram = '". $instagram ."', twitter = '".$twitter."', representative_id = '" . $user_id . "',  modified_by = '". $modified_by ."', date_modified = '" . $server_time . "' WHERE id = '".$client_id."'";

    } else if($_GET['action'] == "approve"){
        $query = "UPDATE `clients` SET status = '1', modified_by = '". $modified_by ."' WHERE id = '".$client_id."'";
        $qUpdateUser = "UPDATE `users` SET status = '1', modified_by = '". $modified_by ."', date_modified = '" . $server_time . "' WHERE id IN (SELECT representative_id FROM `clients` WHERE id = '".$client_id."')";
        $qresult = mysqli_query($nect, $qUpdateUser);
        
    } else if($_GET['action'] == "remove"){
        $query = "UPDATE `clients` SET status = '0', modified_by = '". $modified_by ."', date_modified = '" . $server_time . "' WHERE id = '".$client_id."'";
        $qUpdateUser = "UPDATE `users` SET status = '0', modified_by = '". $modified_by ."', date_modified = '" . $server_time . "' WHERE id IN (SELECT representative_id FROM `clients` WHERE id = '".$client_id."')";
        $qresult = mysqli_query($nect, $qUpdateUser);
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
    /**
    include "../ctrl/con.php";
    $result = array();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    isset($_GET["client_id"]) ? $client_id = mysqli_real_escape_string($nect, $_GET["client_id"]) : $client_id = "";
    $modified_by = $_GET['ui'];
    
    $query = "UPDATE `clients` SET status = '0', modified_by = '". $modified_by ."', date_modified = '" . $server_time . "' WHERE id = '".$client_id."'";
    $qresult = mysqli_query($nect, $query);
    
    if($qresult){
        $out['result'] = true;
    } else {
        _error(mysqli_error($nect));
        }

    array_push($result, $out);
    echo json_encode($result);
    */
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