<?php

/**
 * 检验登录状态
 *@return $result 0表示状态正常，1表示账号不存在，2表示密码错误
 */
function check_login()
{
  $username = $_COOKIE['username'];
  $password = $_COOKIE["password"];

  include 'config.php';

  $db = new PDO($PDODATA['dsn'], $PDODATA['username'], $PDODATA['password']);

  $stmt = $db->prepare("select * from usertb where username=:username");
  $stmt->execute(array(':username' => $username));

  if (!$stmt->rowCount()) {
    return 1;
  }

  $search_password = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['pass_word'];
  $db = NULL;

  date_default_timezone_set('PRC');
  if ($search_password == $password) {
    setcookie("username", $username, time() + 3600 * 24);
    setcookie("password", $password, time() + 3600 * 24);
    // 账号密码无误
    return 0;
  } else {
    // 密码错误
    return 2;
  }
}

/**
 *@param mixed $method 上传方法
 *@param mixed $key 存储桶中的路径
 *@param mixed $content 上传文件信息
 *@param mixed $config 存储桶和密钥信息
 * 如果有时间的话，自己写一份putObject函数替换掉官方sdk
 */

function cos_upload($method, $key, $content, $config)
{

  require 'cos/vendor/autoload.php';

  $cosClient = new Qcloud\Cos\Client(array(
    'region' => $config['region'],
    'credentials' => array(
      'secretId' => $config['secretId'],
      'secretKey' => $config['secretKey'],
    ),
  ));

  $body = $content;
  if ($method == "path") {
    $body = fopen($content, 'rb');
  } elseif ($method == "string") {
    $body = $content;
  } elseif ($method == "handle") {
    $body = $content;
  } else {
    return false;
  }

  try {
    $result = $cosClient->putObject(array(
      'Bucket' => $config['bucket'],
      'Key' => $key,
      'Body' => $body
    ));
    return $result;
  } catch (\Exception $e) {
    return false;
  }
  return true;
}
