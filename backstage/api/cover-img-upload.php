<?php

include 'api-for-php.php';

$result = check_login();

if ($result != 0) {
  echo '{"status": 1,"src": "https://images.aecra.cn/aecra.png"}';
  return;
}

include "config.php";

$img_str = "";
if (file_exists($_FILES["file"]["tmp_name"])) {
  $fp = fopen($_FILES["file"]["tmp_name"], "rb");
  $img_str = fread($fp, filesize($_FILES["file"]["tmp_name"]));
  fclose($fp);
} else {
  return;
}
$method = "path";
$file_type1 = explode('.', $_FILES['file']["name"]);
$key = "/cover/" . md5($img_str) . "." . end($file_type1);
$content = $_FILES["file"]["tmp_name"];
$config = $cos_config;
if (cos_upload($method, $key, $content, $config)) {
  echo '{"status": 0,"src": "https://images.aecra.cn' . $key . '"}';
} else {
  echo '{"status": 2,"src": "https://images.aecra.cn/aecra.png"}';
}
