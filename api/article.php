<?php

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
  echo '{}';
  return;
}

include 'config.php';

try {
  $db = new PDO($PDODATA['dsn'], $PDODATA['username'], $PDODATA['password']);

  // 查询该账号下的该文章
  $articleid = $data["id"];
  $stmt = $db->prepare("select * from articletb where id=:articleid and hided=0");
  $stmt->execute(array(':articleid' => $articleid));

  if (!$stmt->rowCount()) {
    echo "{}";
    return;
  }
  $return_json = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];

  // 点击量++
  $return_json['clicks']++;
  $stmt = $db->prepare("update articletb set clicks=:clicks
  where id=:articleid");
  $stmt->execute(array(
    ':clicks' => $return_json['clicks'],
    ':articleid' => $articleid
  ));

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
