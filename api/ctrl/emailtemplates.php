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
    include '../ctrl/con.php';

    $result = array();
    $data = array();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $template = $input['template'];
    $body = '<html><body style="font-family:calibri, arial;">';
    
    if($template == 'forgotpassword'){
        
        isset($input['user_id']) ? $user_id = mysqli_real_escape_string($nect, $input['user_id']) : $user_id = '';
        isset($input['password']) ? $password = mysqli_real_escape_string($nect, $input['password']) : $password = '';
        
        $query = "SELECT firstname, lastname, email FROM `users` WHERE id = '" . $user_id . "'";

        $qresult = mysqli_query($nect, $query);
        if($qresult){

            $firstname = '';
            $lastname = '';
            if(mysqli_num_rows($qresult)!=0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    $firstname = trim(stripslashes($fetchResult['firstname']));
                    $lastname = trim(stripslashes($fetchResult['lastname']));
                    $username = trim(stripslashes($fetchResult['email']));
                    $row_array['recipient'] = trim(stripslashes($fetchResult['email']));
                }
                
                $body .= '<p>Dear ' . $firstname . ' ' . $lastname . ',</p><br/>'; 
                $body .= '<p>The password for your account (' . $username . ') has been successfully reset. Below is your new password:</p>';
                $body .= '<p><b>' . $password . '</b></p><br/>';
                $body .= '<p>If you did not make this change or you believe an unauthorized person has accessed your account, please contact our team at <a href="mailto:sales@kleveraft.com">sales@kleveraft.com</a>.</p><br/>';
            }

        } else {
            _error(mysqli_error($nect));
        }
    } else if ($template == 'approvepartner'){
        
        isset($input['client_id']) ? $client_id = mysqli_real_escape_string($nect, $input['client_id']) : $client_id = '';
        
        $query = "SELECT a.firstname, a.lastname, a.email FROM `users` as a INNER JOIN `clients` as b ON (a.id = b.representative_id) WHERE b.id = '" . $client_id . "'";

        $qresult = mysqli_query($nect, $query);
        if($qresult){

            $firstname = '';
            $lastname = '';
            if(mysqli_num_rows($qresult)!=0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    $firstname = trim(stripslashes($fetchResult['firstname']));
                    $lastname = trim(stripslashes($fetchResult['lastname']));
                    $row_array['recipient'] = trim(stripslashes($fetchResult['email']));
                }
                
                $body .= '<p>Dear ' . $firstname . ' ' . $lastname . ',</p><br/>';
                $body .= '<p>Congratulations! You now have access to the KleveRaft\'s Inventory System.</p><br/>';
                $body .= '<p>Just click this <a href="https://www.kleveraft.com/app">link</a> and fill up your log in details to access your account.</p><br/>';
            }

        } else {
            _error(mysqli_error($nect));
        }
        
    } else if ($template == 'addpartner'){
        
        isset($input['user_id']) ? $user_id = mysqli_real_escape_string($nect, $input['user_id']) : $user_id = '';
        isset($input['username']) ? $username = mysqli_real_escape_string($nect, $input['username']) : $username = '';
        isset($input['password']) ? $password = mysqli_real_escape_string($nect, $input['password']) : $password = '';
        
        $query = "SELECT firstname, lastname, email FROM `users` WHERE id = '" . $user_id . "'";

        $qresult = mysqli_query($nect, $query);
        if($qresult){
            $firstname = '';
            $lastname = '';
            
            if(mysqli_num_rows($qresult)!=0){
                while($fetchResult = mysqli_fetch_array($qresult)){
                    $firstname = trim(stripslashes($fetchResult['firstname']));
                    $lastname = trim(stripslashes($fetchResult['lastname']));
                    $row_array['recipient'] = trim(stripslashes($fetchResult['email']));
                }
                
                $body .= '<p>Dear ' . $firstname . ' ' . $lastname . ',</p><br/>';
                $body .= '<p>Congratulations! You now have access to the KleveRaft\'s Inventory System. See below log in details:<br/></p>';
                $body .= '<p>Username: <b>' . $username . '</b></p>';
                $body .= '<p>Password: <b>' . $password . '</b></p><br/>';
                $body .= '<p>Just click this <a href="https://www.kleveraft.com/app">link</a> and fill up your log in details to access your account.</p><br/>';
            }

        } else {
            _error(mysqli_error($nect));
        }
        
    }
    
    $body .= "<p>If you need additional help, feel free to contact our team.</p>";
    $body .= "<p>Sincerely,<br/>KleveRaft - A Lifestyle and Concept Store</p>";
    $body .= "</body></html>";
    
    
    $row_array['body'] = $body;
    array_push($data, $row_array);
    
    $out['result'] = true;
$out['query'] = $query;
    $out['data'] = $data;
    
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
    $out['message'] = $m;
    
    array_push($result, $out);
    echo json_encode($result);
    die();
}


?>