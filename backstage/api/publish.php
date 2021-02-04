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
  date_default_timezone_set('PRC');
  $db = new PDO($PDODATA['dsn'], $PDODATA['username'], $PDODATA['password']);

  // 获取用户id
  $stmt = $db->prepare("select * from usertb where username=:username");
  $stmt->execute(array(':username' => $_COOKIE['username']));
  $userid = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];

  // 向数据库插入文章
  $article_title = $data["title"];
  $article_img_url = $data["imgUrl"];
  $article_content = $data["content"];
  $article_publish_time = Date("Y-m-d H:i:s");
  $article_update_time = $article_publish_time;
  $article_hided = $data['hide'] == "true" ? 1 : 0;
  $article_toped = $data['top'] == "true" ? 1 : 0;
  $article_clicks = 0;
  $article_userid = $userid;
  $stmt = $db->prepare("INSERT INTO articletb
  (title,img_url,content,publish_time,update_time,hided,toped,clicks,userid)
  VALUES(:article_title ,:article_img_url,:article_content,:article_publish_time,
  :article_update_time,:article_hided,:article_toped,:article_clicks,:article_userid)");
  $stmt->execute(array(
    ':article_title' => $article_title,
    ':article_img_url' => $article_img_url,
    ':article_content' => $article_content,
    ':article_publish_time' => $article_publish_time,
    ':article_update_time' => $article_update_time,
    ':article_hided' => $article_hided,
    ':article_toped' => $article_toped,
    ':article_clicks' => $article_clicks,
    ':article_userid' => $article_userid
  ));

  // 获取文章id
  $articleid = $db->lastInsertId();

  // 建立文章和标签的链接
  for ($i = 0; $i < count($data["tags"]); $i++) {
    $tag = $data["tags"][$i];

    // 标签不存在就插入标签
    $stmt = $db->prepare("select * from tagstb where tagname=:tag");
    $stmt->execute(array(':tag' => $tag));
    if (!$stmt->rowCount()) {
      // 向数据库插入标签
      $stmt = $db->prepare("insert into tagstb(tagname) values(:tag)");
      $stmt->execute(array(':tag' => $tag));
    }

    // 获取标签id
    $stmt = $db->prepare("select * from tagstb where tagname=:tag");
    $stmt->execute(array(':tag' => $tag));
    $tagid = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];

    // 向映射表中插入数据
    $stmt = $db->prepare("insert into tagmaptb(tagid,articleid) values(:tagid,:articleid)");
    $stmt->execute(array(':tagid' => $tagid, ':articleid' => $articleid));
  }
  $db = NULL;
  echo '{"status": 0}';
} catch (\Throwable $th) {
  echo '{"status": 3}';
}
