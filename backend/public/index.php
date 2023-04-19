<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

// Instantiate app
$app = AppFactory::create();

// Add Error Handling Middleware
$app->addErrorMiddleware(true, false, false);

// Add route callbacks
$app->get('/', function (Request $request, Response $response, array $args) {
    $response->getBody()->write('Hello World');
    return $response;
});

$app->get('/test', function (Request $request, Response $response, array $args) {
    $response->getBody()->write('Test');
    return $response;
});

$app->get('/users', function (Request $request, Response $response, array $args) {
    require_once __DIR__ . '/database/dbConnect.php';

    try {
        $pdo = getPDO();
        $queryString = "SELECT * FROM test_table";
        $query = $pdo->prepare($queryString);
        $query->execute();
    
        $users = $query->fetchAll();
    
        // Display the users
        foreach ($users as $user) {
            echo "First name: " . $user['first_name'] . " - Last name: " . $user['last_name'] . " - email: " . $user['email'] . "<br>";
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }

    return $response;
});

// Run application
$app->run();
