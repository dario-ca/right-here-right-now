<?php

    require("twitteroauth.php");

    function getConnectionWithAccessToken($oauth_token, $oauth_token_secret) {
        $connection = new TwitterOAuth("L1AJdzc2U9UtNBV5hxXYWTd7L", "IQq7uFnRWdvirCfqBIjJnZda2Xa1kZKj746rVDzmTQpjOdlP3N", $oauth_token, $oauth_token_secret);
        return $connection;
    }

    $connection = getConnectionWithAccessToken("484605215-d1PpNJAr963WT3lMemJYpitz9IJnLbtD7Olj6n9V", "AOcCp7FUKn9J73OQorNkafyTp4CBRVY00nWiOPXbJyear");

    $connection->host = "https://api.twitter.com/1.1/";

    //$content = $connection->get("statuses/home_timeline");

    $latitude  = $_REQUEST["latitude"];
    $longitude = $_REQUEST["longitude"];
    $radius    = $_REQUEST["radius"];
    $count     = $_REQUEST["count"];

    $query = array(
      "q" => "geocode:".$latitude.",".$longitude.",".$radius."km",
      "count" => $count
    );

    $results = $connection->get("search/tweets", $query);

    /*

    foreach ($results->statuses as $result) {
      echo $result->user->screen_name . ": " . $result->text . "\n";
    }

    */

    header('Content-Type: application/json');
    echo json_encode($results);

?>