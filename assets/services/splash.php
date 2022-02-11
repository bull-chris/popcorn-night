<?php


// NEED TO SEND POST OF movie_id




require_once("./inc/connect_pdo.php");

$movie_count = $_POST["movie_count"];


if ($movie_count) {
	$movie_count = $movie_count;
} else {
	$movie_count = "8";
}

function get_cover ($movie_cover_id,$dbo) {
	$query = "SELECT name
	FROM image
	WHERE image_id = '$movie_cover_id' ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$image_name = stripslashes($row["0"]);
	}
	
	return $image_name;
}



$query = "SELECT movie_id, name, cover_id, rating, date_me
FROM movie
ORDER BY RAND() 
LIMIT 0, $movie_count";
//print("$query");
foreach($dbo->query($query) as $row) {
	$movie_id = stripslashes($row["0"]);
	$movie_name = stripslashes($row["1"]);
	$movie_cover_id = stripslashes($row["2"]);
	$movie_rating = stripslashes($row["3"]); //get movie rating
	$movie_date = stripslashes($row["4"]); //get movie release date
	$release_date = date('Y', strtotime($movie_date)); //convert movie release date to year only
	
	$movie["movie_id"] = $movie_id;
	
	$movie["movie_name"] = $movie_name;
	$movie["cover_id"] = $movie_cover_id;
	$movie["movie_rating"] = $movie_rating;
	$movie["movie_date"] = $release_date;
	
	$cover = get_cover($movie_cover_id,$dbo);
	$movie["cover_name"] = $cover;

	$movie["movie_count"] = $movie_count; //pass total movie count
	
	$movies[] = $movie;
}

$data = json_encode($movies);

header("Content-Type: application/json");

print($data);




?>