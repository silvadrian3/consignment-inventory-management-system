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

    
    isset($input["firstname"]) ? $firstname = mysqli_real_escape_string($nect, $input["firstname"]) : $firstname = "";
    isset($input["lastname"]) ? $lastname = mysqli_real_escape_string($nect, $input["lastname"]) : $lastname = "";
    isset($input["username"]) ? $username = mysqli_real_escape_string($nect, $input["username"]) : $username = "";
    isset($input["password"]) ? $password = mysqli_real_escape_string($nect, md5($input["password"])) : $password = "";
    isset($input["type"]) ? $type = mysqli_real_escape_string($nect, $input["type"]) : $type = "";
    isset($input["status"]) ? $status = mysqli_real_escape_string($nect, $input["status"]) : $status = 1;
    $modified_by = $_GET['ui'];
    
    $query = "INSERT INTO `users` (firstname, lastname, email, password, type, modified_by, status, date_modified) VALUES ('". $firstname ."', '". $lastname ."', '". $username ."', '". $password ."', '". $type ."', '" . $modified_by . "', '". $status ."', '".$server_time."')";

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
    
    if(isset($_GET['user_id']) && !empty($_GET['user_id'])){ // read
        $ui = mysqli_real_escape_string($nect, $_GET['user_id']);

        $query = "SELECT id, firstname, lastname, email FROM `users` WHERE id = '" . $ui . "'";
        $qresult = mysqli_query($nect, $query);

        if($qresult){
            if(mysqli_num_rows($qresult)!=0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    $row_array['id'] = trim(stripslashes($fetchResult['id']));
                    $row_array['firstname'] = trim(stripslashes($fetchResult['firstname']));
                    $row_array['lastname'] = trim(stripslashes($fetchResult['lastname']));
                    $row_array['email'] = trim(stripslashes($fetchResult['email']));
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
        
    } else { // show all
        
    }
    
    
    
}

function _put(){
    include "../ctrl/con.php";
    $result = array();
    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = mysqli_real_escape_string($nect, $input["user_id"]);
    isset($input["firstname"]) ? $firstname = mysqli_real_escape_string($nect, $input["firstname"]) : $firstname = "";
    isset($input["lastname"]) ? $lastname = mysqli_real_escape_string($nect, $input["lastname"]) : $lastname = "";
    $modified_by = $_GET['ui'];

    $query = "UPDATE `users` SET firstname = '".$firstname."', lastname = '".$lastname."', modified_by = '".$modified_by."', date_modified = '".$server_time."' WHERE id = '".$user_id."'";

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