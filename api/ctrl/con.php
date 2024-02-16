<?php 
date_default_timezone_set('Asia/Manila');
$server_time = date('Y-m-d H:i:s');

$db_name = 'kleveraft';
$db_host = 'localhost'; 
//$db_user = 'root'; 
$db_user = 'kleveraftadmin';
//$db_pass = '';
$db_pass = 'aQ$1Lv@kleveraft';

$nect = mysqli_connect($db_host, $db_user, $db_pass);
    if (!$nect) {
        die('Unable to connect to host: ' . mysqli_error($nect));
    } else {
		$selected_db = mysqli_select_db($nect, $db_name);
		if (!$selected_db) {
			die('Unable to use the selected database: '. mysqli_error($nect));
		}
	}
?>