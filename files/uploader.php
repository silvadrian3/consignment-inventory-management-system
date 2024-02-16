<?php

include 'resizeImage.php';

$_file = $_GET["_file"];
$sourcePath = $_FILES[$_file]['tmp_name'];
$filename = $_FILES[$_file]['name'];
$imagetype = $_GET["type"];
$location = "orig";

$ext = '.' . strtolower(substr(strrchr($filename, '.'), 1));
$clrsrc = str_replace($ext, '', $filename); //remove extension
$clrsrc = substr($clrsrc,0,25); //limit to 25 charactes
$clrsrc = preg_replace('/[^A-Za-z0-9]/', '', $clrsrc); //replace special characters
$imgdest = 'rs-' . $clrsrc . date('ymdHis') . $ext;
$copied = copy($sourcePath, 'orig/' . $imgdest);

$info = getimagesize('orig/' . $imgdest);

if($imagetype == "company_logo"){
    $location = "companylogo/";
} else if($imagetype == "product"){
    $location = "products/";
    }


    if($info['mime'] != 'image/png' || $info['mime'] != 'image/jpeg'){
        if($info[0] > 300 || $info[1] > 300){
            resizeImage('orig/' . $imgdest, $location . $imgdest, 300, 300);
        } else {
            copy($sourcePath, $location . $imgdest);
            }
    }

    print $imgdest;
?>