<?php
require_once '../vendor/autoload.php';// Autoload our dependencies with Composer

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

$app = new \Slim\App();
$app->add(function(ServerRequestInterface $request, ResponseInterface $response, callable $next){
	$response = $response->withHeader('Content-type', 'application/json; charset=utf-8');
	$response = $response->withHeader('Access-Control-Allow-Origin', '*');
	$response = $response->withHeader('Access-Control-Allow-Methods', 'OPTION, GET, POST, PUT, PATCH, DELETE');
	return $next($request, $response);
});

//Chemins des fichiers JSON
$tasks_path = realpath('').'/tasks.json';
$tags_path = realpath('').'/tags.json';

//On charge les produits existants
$tasks = array();
if(file_exists($tasks_path)){
    $tasks = json_decode(file_get_contents($tasks_path));
}

$app->group('/tasks', function () use($app, $tasks_path, $tasks) {
    $app->get('[/]', function () use($tasks) {
        echo json_encode($tasks);
    });

    $app->post('/addtask', function (ServerRequestInterface $request) use($tasks_path) {
		$data = $request->getParams();
		
        if(!empty($data['name']) && !empty($data['duration'])) {
            $current = array();

            if (file_exists($tasks_path)) {
                $current = json_decode(file_get_contents($tasks_path), true);
            }

           if (empty($data['tags'])) {
                $current[sizeof($current) + 1] = ['id' => $data['id'], 'name' => $data['name'], 'duration' => $data['duration'], 'Tags' => null];
            } else {
                $tags = array();
                $data['tags'] = explode('/', $data['tags']);

                foreach ($data['tags'] as $t) {
                    $tags[sizeof($tags) + 1] = ['name' => $t];
                }

                $current[sizeof($current) + 1] = ['id' => $data['id'], 'name' => $data['name'], 'duration' => $data['duration'], 'Tags' => $data['tags']];
            }

            $to_json = json_encode($current);
            file_put_contents($tasks_path, $to_json);

            echo $to_json;
        }
    });

    $app->post('/{taskid}/addtag', function (ServerRequestInterface $request) use($tasks_path) {
        $taskId = $request->getAttribute('taskid');
        $taskTags = $request->getParam('tag');
        $current = array();

        if (file_exists($tasks_path)) {
            $current = json_decode(file_get_contents($tasks_path), true);
        }

        if (!empty($taskTags)) {
            $tagsTasks = explode('/', $taskTags);

            foreach ($tagsTasks as $t) {
                if (!empty($t)) {
                    $current[$taskId]['Tags'][sizeof($current[$taskId]['Tags']) + 1] = ['name' => $t];
                }
            }

            $to_json = json_encode($current);
            file_put_contents($tasks_path, $to_json);

            echo $to_json;
        }
    });

    $app->delete('/{taskid}', function (ServerRequestInterface $request) use($tasks_path) {
        $taskId = $request->getAttribute('taskid');

        if (file_exists($tasks_path)) {
            $current = json_decode(file_get_contents($tasks_path), true);
            array_splice($current['Tasks'], $taskId - 1, 1);

            $to_json = json_encode($current);
            file_put_contents($tasks_path, $to_json);

            echo json_encode($current);
        }
    });

    $app->delete('/{taskid}/tags/{tagid}', function (ServerRequestInterface $request) use($tasks_path) {
        $taskId = $request->getAttribute('taskid');
        $tagId = $request->getAttribute('tagid');

        if (file_exists($tasks_path)) {
            $current = json_decode(file_get_contents($tasks_path), true);
            unset($current['Tasks'][$taskId - 1]['Tags'][$tagId - 1]);

            $to_json = json_encode($current);
            file_put_contents($tasks_path, $to_json);

            echo $to_json;
        }
    });
});

$app->run();