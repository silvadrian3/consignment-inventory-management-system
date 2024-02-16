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

    if(isset($input["username"]) && isset($input["password"])){
	$username = mysqli_real_escape_string($nect, $input["username"]);
	$pass = mysqli_real_escape_string($nect, $input["password"]);
	
	$query = "SELECT a.id as user_id, a.type as user_type, c.id as client_id FROM `users` as a INNER JOIN `client_users` as b ON (a.id = b.user_id) INNER JOIN `clients` as c ON (c.id = b.client_id) WHERE LOWER(a.email) = LOWER('".$username."') AND a.password = md5('".$pass."') AND a.status = 1 AND c.status = 1";

	$qresult = mysqli_query($nect, $query);
	if($qresult){
		if(mysqli_num_rows($qresult)!=0){
	            while($fetchResult = mysqli_fetch_array($qresult)){
	                $row_array['user_id'] = trim(stripslashes($fetchResult['user_id']));
	                $row_array['client_id'] = trim(stripslashes($fetchResult['client_id']));
	                $row_array['user_type'] = trim(stripslashes($fetchResult['user_type']));
	                array_push($data, $row_array);
	            }
	
	            $out['result'] = true;
	            $out['data'] = $data;
	
	        } else {
	            $out['result'] = false;
	        }
	
	        array_push($result, $out);
	        echo json_encode($result);
	} else {
	        _error(mysqli_error($nect));
	}
    }   
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