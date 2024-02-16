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
    include "../ctrl/phpMailerClass.php";
    $result = array();
    $data = array();
    $input = json_decode(file_get_contents('php://input'), true);
    
    $_from = $input["from"];
    $_fromname = $input["fromname"];
    $_subject = $input["subject"];
    $_body = $input["body"];
    $_address = $input["address"];
    //$_bcc1 = $input["bcc1"];
    //$_bcc2 = $input["bcc2"];
    //$_bcc3 = $input["bcc3"];

        $email = new PHPMailer();
        $email -> From = $_from;
        $email -> FromName = $_fromname;
        $email -> Subject = $_subject;
        $email -> Body = $_body;
        $email -> AddAddress($_address);
        $email -> AddBCC("adrianquijanosilva@gmail.com");

        $email -> IsHTML(true);

        if(!$email -> Send()) {
            $out['result'] = false;
        } else {
            $out['result'] = true;
            $out['from'] = $_from;
            $out['from_name'] = $_fromname;
            $out['subject'] = $_subject;
            $out['body'] = $_body;
            $out['address'] = $_address;
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