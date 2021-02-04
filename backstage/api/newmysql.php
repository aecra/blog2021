<?php

include "./config.php";

$db = new PDO($PDODATA['dsn'], $PDODATA['username'], $PDODATA['password']);

$stmt = $db->prepare("select * from tagstb");
$stmt->execute();
$stmt->setFetchMode(PDO::FETCH_ASSOC);
var_dump($stmt->fetchAll());
$db = NULL;

// 查询的行数
// $row_count = $stmt->rowCount();
// 上次插入的id
// $insertId = $db->lastInsertId();

// select
// $stmt = $db->prepare("SELECT * FROM table WHERE id=:id AND name=:name");
// $stmt->execute(array(':name' => $name, ':id' => $id));
// $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// insert
// $stmt = $db->prepare("INSERT INTO table(field1,field2) VALUES(:field1,:field2)");
// $stmt->execute(array(':field1' => $field1, ':field2' => $field2));
// $affected_rows = $stmt->rowCount();

// delete
// $stmt = $db->prepare("DELETE FROM table WHERE id=:id");
// $stmt->bindValue(':id', $id, PDO::PARAM_STR);
// $stmt->execute();
// $affected_rows = $stmt->rowCount();

// update
// $stmt = $db->prepare("UPDATE table SET name=? WHERE id=?");
// $stmt->execute(array($name, $id));
// $affected_rows = $stmt->rowCount();