<?php
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
  return;
}

date_default_timezone_set('PRC');

$username = $data["username"];
$password = $data["password"];

include 'config.php';

$db = new PDO($PDODATA['dsn'], $PDODATA['username'], $PDODATA['password']);

$stmt = $db->prepare("select * from usertb where username=:username");
$stmt->execute(array(':username' => $username));

if (!$stmt->rowCount()) {
  echo '{"status":1}'; // 账号不存在
  return;
}

$search_password = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['pass_word'];
$db = NULL;
if ($search_password == $password) {
  setcookie("username", $username, time() + 3600 * 24);
  setcookie("password", $password, time() + 3600 * 24);
  echo '{"status":0}'; // 账号密码无误
} else {
  echo '{"status":2}'; // 密码错误
}
