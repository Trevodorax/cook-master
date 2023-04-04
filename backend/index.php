<?php

// Set the content type to JSON
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Connect to the database
    $conn = new mysqli('mariadb', 'username', 'password', 'main_database');
    if ($conn->connect_error) {
        http_response_code(500);
        $error = array(
            "error" => "Failed to connect to database: " . $conn->connect_error
        );
        echo json_encode($error);
        exit;
    }

    // Query the test table
    $result = $conn->query('SELECT * FROM test_table');
    if (!$result) {
        http_response_code(500);
        $error = array(
            "error" => "Failed to query database: " . $conn->error
        );
        echo json_encode($error);
        exit;
    }

    // Fetch the results and format as an array of associative arrays
    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    // Create the response object with the results
    $response = array(
        "message" => "Hello, this is a simple PHP API!",
        "data" => $rows
    );
    echo json_encode($response);
} else {
    http_response_code(405);
    $error = array(
        "error" => "Method not allowed. Please use a GET request."
    );
    echo json_encode($error);
}

?>