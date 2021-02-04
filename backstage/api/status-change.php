<?php

include 'api-for-php.php';

$result = check_login();

if ($result != 0) {
  echo '{"status": 1}';
  return;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
  echo '{"status": 2}';
  return;
}

include 'config.php';

try {
  $db = new PDO($PDODATA['dsn'], $PDODATA['username'], $PDODATA['password']);

  // 获取用户id
  $stmt = $db->prepare("select * from usertb where username=:username");
  $stmt->execute(array(':username' => $_COOKIE['username']));
  $userid = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];

  $field = $data['change'] == "top" ? "toped" : "hided";
  $status = $data['status'] ? 1 : 0;
  $articleid = $data['titleId'];

  // 获取该文章的用户id
  $stmt = $db->prepare("select userid from articletb where id=:articleid");
  $stmt->execute(array(':articleid' => $articleid));
  $userid2 = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['userid'];

  // 账号信息不符
  if ($userid != $userid2) {
    echo '{"status": 4}';
    return;
  }

  // 更新文章状态
  if ($field == 'toped') {
    $stmt = $db->prepare("update articletb set toped=:status where id=:articleid");
  } else {
    $stmt = $db->prepare("update articletb set hided=:status where id=:articleid");
  }
  $stmt->execute(array(':status' => $status, ':articleid' => $articleid));

  $db = NULL;
  echo '{"status": 0}';
} catch (\Throwable $th) {
  echo '{"status": 3}';
}
