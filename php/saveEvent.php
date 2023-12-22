<?php

$file_path = 'data.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $time_stamp = microtime(true);
    $micro = sprintf("%06d", ($time_stamp - floor($time_stamp)) * 1000000);
    $time =date('H:i:s', $time_stamp) . ':' . $micro;

    /*$events_in_file = json_decode(file_get_contents($file_path));
    $events_in_file[] = ['n' => $_POST['n'], 'time' => $time, 'event' => $_POST['event']];
    file_put_contents($file_path, json_encode($events_in_file));*/

    $new_record = $_POST['n'] . ';' . $time . ';' . $_POST['event'] . "\n";

    $file = fopen($file_path, 'a');
    fwrite($file, $new_record);
    fclose($file);
}

?>
