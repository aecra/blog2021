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

  // 查询该账号下的该文章
  $articleid = $data["id"];
  $stmt = $db->prepare("select * from articletb where id=:articleid and userid=:userid");
  $stmt->execute(array(':articleid' => $articleid, ':userid' => $userid));
  $return_json = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
  if (!$return_json) {
    echo "{}";
    return;
  }

  $stmt = $db->prepare("select * from tagstb inner join tagmaptb on tagmaptb.tagid=tagstb.id and tagmaptb.articleid=:articleid");
  $stmt->execute(array(':articleid' => $articleid));
  $return_json['tags'] = [];
  while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    array_push($return_json['tags'], $row['tagname']);
  }

  echo json_encode($return_json);
  $db = NULL;
} catch (\Throwable $th) {
  echo '{}';
}
