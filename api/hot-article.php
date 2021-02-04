<?php

include "./config.php";

$db = new PDO($PDODATA['dsn'], $PDODATA['username'], $PDODATA['password']);
$stmt = $db->prepare("select id,title from articletb where hided=0 order by clicks desc limit 0,4");
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));