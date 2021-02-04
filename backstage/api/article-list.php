<?php

include 'api-for-php.php';

$result = check_login();

if ($result != 0) {
  echo '{"status": 1}';
  return;
}

include 'config.php';

try {
  $db = new PDO($PDODATA['dsn'], $PDODATA['username'], $PDODATA['password']);

  $stmt = $db->prepare("select n.id,n.title,n.publish_time,n.update_time,n.toped,n.hided
  from articletb n
  join usertb on usertb.username=:username and usertb.id=n.userid
  order by update_time desc");
  $stmt->execute(array(':username' => $_COOKIE['username']));
  $return_json = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($return_json);
  $db = NULL;
} catch (\Throwable $th) {
  echo '[]';
}
