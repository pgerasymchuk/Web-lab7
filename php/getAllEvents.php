<?php

$file_path = 'data.json';
$file_content = file_get_contents($file_path);
file_put_contents($file_path, '');
header('Content-Type: application/json');
echo $file_content;

?>
