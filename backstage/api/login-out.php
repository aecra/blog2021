<?php

date_default_timezone_set('PRC');

setcookie("username", $_COOKIE["username"], time() - 3600 * 24);
setcookie("password", $_COOKIE["password"], time() - 3600 * 24);

?>

<script>
  window.location.href = "../login.html";
</script>