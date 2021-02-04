<?php

include 'api-for-php.php';

$result = check_login();

if ($result == 0) {
  echo '{"status":0}'; // 账号密码无误
} elseif ($result == 1) {
  echo '{"status":1}'; // 账号不存在
} elseif ($result == 2) {
  echo '{"status":2}'; // 密码错误
} else {
  echo '{"status":3}'; // 程序错误
}
