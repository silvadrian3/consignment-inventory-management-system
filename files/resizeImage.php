<?php

function resizeImage($sourceImage, $targetImage, $maxWidth, $maxHeight, $quality = 100){
	$info = getimagesize($sourceImage);
	
    // Obtain image from given source file.
	if($info['mime']=='image/png')
		$image = @imagecreatefrompng($sourceImage);
	elseif($info['mime']=='image/jpeg')
		$image = @imagecreatefromjpeg($sourceImage);
	else
		return false;
	
    // Get dimensions of source image.
    list($origWidth, $origHeight) = getimagesize($sourceImage);

    if ($maxWidth == 0)
        $maxWidth  = $origWidth;

    if ($maxHeight == 0)
        $maxHeight = $origHeight;

    $widthRatio = $maxWidth / $origWidth;
    $heightRatio = $maxHeight / $origHeight;
    $ratio = min($widthRatio, $heightRatio);
    $newWidth  = (int)$origWidth  * $ratio;
    $newHeight = (int)$origHeight * $ratio;

    // Create final image with new dimensions.
    $newImage = @imagecreatetruecolor($newWidth, $newHeight);
	imagealphablending($newImage, false);
	imagecopyresampled($newImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
	imagesavealpha($newImage, true);
	
	if($info['mime']=='image/png')
		imagepng($newImage, $targetImage);
	elseif($info['mime']=='image/jpeg')
		imagejpeg($newImage, $targetImage, $quality);
	else
		return false;
	
    // Free up the memory.
    imagedestroy($image);
    imagedestroy($newImage);

    return true;
}
?>