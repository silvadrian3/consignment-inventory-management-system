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
    
}

function _get(){
    //
    include "../ctrl/con.php";
    
    $result = array();
    $data = array();
    
    if(isset($_GET['action']) && !empty($_GET['action'])){
        $action = $_GET['action'];
        
        if($action == "checkPassword"){
            
            $ui = mysqli_real_escape_string($nect, $_GET['ui']);
            $password = mysqli_real_escape_string($nect, $_GET['password']);

            $query = "SELECT id FROM `users` WHERE id = '" . $ui . "' AND password = md5('".$password."')";
            $qresult = mysqli_query($nect, $query);

            if($qresult){
                if(mysqli_num_rows($qresult)!=0){
                    $out['result'] = true;
                } else {
                    $out['result'] = false;
                }

                array_push($result, $out);
                echo json_encode($result);
            } else {
                _error(mysqli_error($nect));
            }
        }
        
    } else { // show all
        
    }
}

function _put(){
    
    include "../ctrl/con.php";
    $result = array();
    
    if(isset($_GET['action']) && !empty($_GET['action'])){
        
        $action = $_GET['action'];
        $input = json_decode(file_get_contents('php://input'), true);
        $user_id = mysqli_real_escape_string($nect, $input["user_id"]);
        
        if($action == "changePassword"){
            $password = $input['password'];
        } else if($action == "resetPassword") {
            $password = substr(md5(microtime()), 0, 7);
        }
        
        $encryptedpass = mysqli_real_escape_string($nect, md5($password));
        
        $query = "UPDATE `users` SET password = '".$encryptedpass."', modified_by = '".$user_id."', date_modified = '" .$server_time. "' WHERE id = '".$user_id."'";

        $qresult = mysqli_query($nect, $query);

        if($qresult){
            $out['result'] = true;
            $out['data'] = $password;
        } else {
            _error(mysqli_error($nect));
            }

        array_push($result, $out);
        echo json_encode($result);
    }
}

function _error($m){
    $result = array();
    $out['result'] = false;
    $out['error'] = $m;
    
    array_push($result, $out);
    echo json_encode($result);
    die();
}

/**
function _sendpassword(){
    include "../ctrl/phpMailerClass.php";
    
    $email = new PHPMailer();
    $email -> ClearAddresses();
        $email->From = 'silvadrian3@gmail.com';
        $email->FromName = 'Quisi';
        $email->Subject = "Reset Password";
        $email->Body = "<html>
                <body style='font-family:calibri, arial'>
                <p style='font-size:14px; color:#000'><i>Please do not reply. This is an automated email.</i><br/><br/></p>
                <p style='font-size:14px; color:#000'>Hi Test,<br/><br/><br/></p>
                <p style='font-size:14px; color:#000'>If you have any questions, contact us.<br/><br/><br/></p> 
                <p style='font-size:14px; color:#000'>Regards, <br/> Quisi Admin<br/><br/><br/></p>
                </body>
                </html>";

        $email->AddReplyTo('no-reply@quisi.io');
        $email->AddAddress('adrianquijanosilva@gmail.com');
		$email->AddBCC('silvadrian3@yahoo.com');
        $email->IsHTML(true);
    
            if($email->Send()) {
                return true;
            } else {
                _error("Error in Sending Email");
            }
}
*/

?>