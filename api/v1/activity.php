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
            default: _error(); break;
        }
    }
}

function _post(){
    include "../ctrl/con.php";

    $result = array();
    $input = json_decode(file_get_contents('php://input'), true);
    
    isset($input["user_id"]) ? $user_id = mysqli_real_escape_string($nect, $input["user_id"]) : $user_id = 0;
    isset($input["client_id"]) ? $client_id = mysqli_real_escape_string($nect, $input["client_id"]) : $client_id = 0;
    isset($input["module"]) ? $module = mysqli_real_escape_string($nect, $input["module"]) : $module = "";
    isset($input["activity"]) ? $activity = mysqli_real_escape_string($nect, $input["activity"]) : $activity = "";
    isset($input["verb"]) ? $verb = mysqli_real_escape_string($nect, $input["verb"]) : $verb = "";
    
    $browser_details = $_SERVER['HTTP_USER_AGENT'];
    $ip = "";
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
            }

    $query = "INSERT INTO `activity_logs` (user_id, client_id, module, activity, verb, ip_address, browser_details, activity_date) VALUES ('" . $user_id . "', '" . $client_id . "', '". $module ."', '" . $activity . "', '" . $verb . "', '" . $ip . "', '" . $browser_details . "', '" . $server_time . "')";

    $qresult = mysqli_query($nect, $query);

    if($qresult){
        $out['result'] = true;
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