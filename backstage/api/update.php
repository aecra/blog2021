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

  // 账号信息不符
  if ($userid != $data[0]['userid']) {
    echo '{"status": 4}';
  }

  // 修改数据库中的文章信息
  $article_title = $data[1]["title"];
  $article_img_url = $data[1]["imgUrl"];
  $article_content = $data[1]["content"];
  $article_update_time = Date("Y-m-d H:i:s");
  $article_hided = $data[1]['hide'] == "true" ? 1 : 0;
  $article_toped = $data[1]['top'] == "true" ? 1 : 0;
  $articleid = $data[0]['id'];
  $stmt = $db->prepare("update articletb set
  title=:article_title,img_url=:article_img_url,content=:article_content,
  update_time=:article_update_time,hided=:article_hided,toped=:article_toped
  where id=:articleid");
  $stmt->execute(array(
    ':article_title' => $article_title,
    ':article_img_url' => $article_img_url,
    ':article_content' => $article_content,
    ':article_update_time' => $article_update_time,
    ':article_hided' => $article_hided,
    ':article_toped' => $article_toped,
    ':articleid' => $articleid
  ));

  // 修改标签映射
  for ($i = 0; $i < count($data[0]['tags']); $i++) {
    $tag = $data[0]['tags'][$i];
    if (in_array($tag, $data[1]['tags'])) {
      // 依旧存在的标签
      continue;
    } else {
      // 不存在的标签
      // 删除该标签同文章的映射
      $stmt = $db->prepare("delete tagmaptb from tagmaptb,tagstb
      where tagmaptb.articleid=:articleid and tagmaptb.tagid=tagstb.id and tagstb.tagname=:tag");
      $stmt->execute(array(':articleid' => $articleid, ':tag' => $tag));

      // 检查该标签是否为其他文章的标签，如果不是，那么删除该标签
      $stmt = $db->prepare("select * from tagmaptb
      inner join tagstb on tagstb.tagname=:tag and tagmaptb.tagid=tagstb.id");
      $stmt->execute(array(':tag' => $tag));

      if (!$stmt->rowCount()) {
        $stmt = $db->prepare("delete from tagstb where tagname=:tag");
        $stmt->execute(array(':tag' => $tag));
      }
    }
  }
  for ($i = 0; $i < count($data[1]['tags']); $i++) {
    $tag = $data[1]['tags'][$i];
    if (in_array($tag, $data[0]['tags'])) {
      // 原有的标签
      continue;
    } else {
      // 新增的标签
      // 检查数据库中是否存在该标签,如果没有，那么添加该标签
      $stmt = $db->prepare("select * from tagstb where tagname=:tag");
        $stmt->execute(array(':tag' => $tag));
      if (!$stmt->rowCount()) {
        $stmt = $db->prepare("insert into tagstb (tagname) values(:tag)");
        $stmt->execute(array(':tag' => $tag));
      }
      // 添加该标签同文章的映射
      // 获取标签id
      $stmt = $db->prepare("select * from tagstb where tagname=:tag");
      $stmt->execute(array(':tag' => $tag));
      $tagid = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];
      $stmt = $db->prepare("insert into tagmaptb (tagid, articleid) values(:tagid,:articleid)");
      $stmt->execute(array(':tagid' => $tagid,':articleid'=>$articleid));
    }
  }

  $db = NULL;
  echo '{"status": 0}';
} catch (\Throwable $th) {
  echo '{"status": 3}';
}
