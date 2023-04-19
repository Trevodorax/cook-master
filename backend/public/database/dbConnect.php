<?php

function getPDO() {
  require_once __DIR__ . '/config.php';

  try {
      $pdo = new PDO($dsn, $user, $password, $options);
      return $pdo;
  } catch (PDOException $e) {
      echo "Error: " . $e->getMessage();
  }
}
