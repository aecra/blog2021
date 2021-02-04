<?php

include "./config.php";

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
  echo '[]';
  return;
}

try {
  $db = new PDO($PDODATA['dsn'], $PDODATA['username'], $PDODATA['password']);
  $stmt = $db->prepare("select n.id as id,n.title as title,n.publish_time as publish_time,n.toped as toped,
  n.update_time as update_time,n.img_url as img_url,n.clicks as clicks,usertb.username as username
  from articletb n
  join usertb on usertb.id=n.userid
  where n.hided=0 and n.toped=0
  order by update_time desc");
  $stmt->execute();

  $middle_json = $stmt->fetchAll(PDO::FETCH_ASSOC);

  $return_json = [];
  $count = $stmt->rowCount();
  $start = $data['start'];
  $length = $data['step'];
  if ($data['start'] < 0) {
    $start = 0;
  }
  if ($data['start'] > $count - 1) {
    echo "[]";
    return;
  }
  if ($data['step'] <= 0) {
    echo "[]";
    return;
  }
  if ($data['start'] + $data['step'] > $count) {
    $length = $count - $start;
  }

  for ($i = $start; $i < $start + $length; $i++) {
    array_push($return_json, $middle_json[$i]);
  }

  for ($i = 0; $i < count($return_json); $i++) {
    $stmt = $db->prepare("select * from tagstb inner join tagmaptb on tagmaptb.tagid=tagstb.id and tagmaptb.articleid=:articleid");
    $stmt->execute(array(':articleid' => $return_json[$i]['id']));
    $return_json[$i]['tags'] = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      array_push($return_json[$i]['tags'], $row['tagname']);
    }
  }

  echo json_encode($return_json);
} catch (\Throwable $th) {
  echo '[]';
}
