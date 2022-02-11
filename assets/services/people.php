<?php


// NEED TO SEND POST OF movie_id



date_default_timezone_set('America/Toronto');

require_once("./inc/connect_pdo.php");

$people_id = $_POST["people_id"];

if (empty($people_id)) {
	$people_id = "1";
}


$query = "SELECT people_id, name, biography, date_birth, date_death, image_id
FROM people
WHERE people_id = '$people_id'
ORDER BY name ";
//print("$query");
foreach($dbo->query($query) as $row) {
	$people_id = stripslashes($row["0"]);
	$people_name = stripslashes($row["1"]);
	$people_biography = nl2br(stripslashes($row["2"]));
	$people_date_birth = stripslashes($row["3"]);
	$people_date_death = stripslashes($row["4"]);
	$people_image_id = stripslashes($row["5"]);
	
	$data = $people_date_birth;
	$display_date_born = date('d F Y', strtotime($people_date_birth));
	
	if ($people_date_death != "0000-00-00") {
		$display_date_death = date('d F Y', strtotime($people_date_death));
	} else {
		$display_date_death = "I'm Alive!";
	}
	
	$people["people_id"] = $people_id;
	
	$people["people_name"] = "$people_name";
	$people["people_biography"] = "$people_biography";
	$people["born"] = "$display_date_born";
	$people["died"] = "$display_date_death";
	
	if ($people_image_id) {
		$query = "SELECT name
		FROM image
		WHERE image_id = '$people_image_id' ";
		//print("$query");
		foreach($dbo->query($query) as $row) {
			$image_name = stripslashes($row["0"]);
		}
	}
	
	
	
	$people["cover_image_id"] = $people_image_id;
	$people["cover_image_name"] = $image_name;
	
	$query = "SELECT image.image_id, image.name, image_people.id
	FROM image_people, image
	WHERE image_people.image_id = image.image_id
	AND image_people.people_id = '$people_id'
	AND image.image_id != '$people_image_id'
	ORDER BY image.image_id ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$image_id = stripslashes($row["0"]);
		$name = stripslashes($row["1"]);
		$image_movie_id = stripslashes($row["2"]);
		
		
		$people_image["id"] = $image_id;
		$people_image["name"] = $name;
		$people_images[] = $people_image;
		
	}
	
	$people["people_images"] = $people_images;
	
	
	$query = "SELECT movie_people.id, people.people_id, people.name, image.image_id, image.name, movie_people.character_name
	FROM movie_people, people, image, movie
	WHERE movie_people.people_id = people.people_id
	AND movie_people.movie_id = movie.movie_id
	AND people.image_id = image.image_id
	AND movie_people.people_id = '$people_id'
	ORDER BY movie.date_me DESC ";
	
	$query = "SELECT movie.movie_id, image.image_id, image.name, movie.name, movie_people.character_name, movie.date_me, movie.rating
	FROM movie_people, image, movie
	WHERE movie_people.movie_id = movie.movie_id
	AND movie.cover_id = image.image_id
	AND movie_people.people_id = '$people_id'
	ORDER BY movie.date_me DESC ";
	
	
	foreach($dbo->query($query) as $row) {
		$movie_id = stripslashes($row["0"]);
		$image_id = stripslashes($row["1"]);
		$image_name = stripslashes($row["2"]);
		$movie_name = stripslashes($row["3"]);
		$character_name = stripslashes($row["4"]);
		$date_me = stripslashes($row["5"]);
		$movie_rating = stripslashes($row["6"]); //gather featuredIn movie rating
		
		$movie["movie_id"] = $movie_id;
		$movie["image_id"] = $image_id;
		$movie["image_name"] = $image_name;
		$movie["movie_name"] = $movie_name;
		$movie["character_name"] = $character_name;
		$year = date('Y', strtotime($date_me));
		$movie["year"] = $year;
		$movie["rating"] = $movie_rating; //assign featuredIn movie rating
		
		
		$movies[] = $movie;
		
	}
	
	$people["movies"] = $movies;
	
	
}
	
	




$data = json_encode($people);

header("Content-Type: application/json");

print($data);




?>