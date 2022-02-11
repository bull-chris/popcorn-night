<?php


// NEED TO SEND POST OF movie_id



date_default_timezone_set('America/Toronto');

require_once("./inc/connect_pdo.php");

$movie_id = $_POST["movie_id"];


if (empty($movie_id)) {
	$movie_id = "1";
}

$query = "SELECT movie_id, name, rating, hour_me, minute_me, category_id, date_me, descript, country_id, language_id, colour_id, didyouknow, cover_id, youtube
FROM movie
WHERE movie_id = '$movie_id'
ORDER BY name ";
//print("$query");
foreach($dbo->query($query) as $row) {
	$movie_id = stripslashes($row["0"]);
	$movie_name = stripslashes($row["1"]);
	$movie_rating = stripslashes($row["2"]);
	$movie_hour_me = stripslashes($row["3"]);
	$movie_minute_me = stripslashes($row["4"]);
	$movie_category_id = stripslashes($row["5"]);
	$movie_date_me = stripslashes($row["6"]);
	$movie_descript = nl2br(stripslashes($row["7"]));
	$movie_country_id = stripslashes($row["8"]);
	$movie_language_id = stripslashes($row["9"]);
	$movie_colour_id = stripslashes($row["10"]);
	$movie_didyouknow = nl2br(stripslashes($row["11"]));
	$movie_cover_id = stripslashes($row["12"]);
	$youtube = stripslashes($row["13"]);
	$display_date = date('d F Y', strtotime($movie_date_me));
	
	$movie["movie_id"] = $movie_id;
	
	$movie["movie_name"] = $movie_name;
	$movie["youtube"] = $youtube;
	$movie["description"] = $movie_descript;
	$movie["movie_rating"] = $movie_rating;
	$movie["run_length"] = "$movie_hour_me:$movie_minute_me";
	$movie["hours"] = "$movie_hour_me";
	$movie["minutes"] = "$movie_minute_me";
	
	$movie["movie_date_me"] = $display_date;
	$movie["movie_didyouknow"] = $movie_didyouknow;
	
	
}

	if ($movie_cover_id) {
		$query = "SELECT name
		FROM image
		WHERE image_id = '$movie_cover_id' ";
		//print("$query");
		foreach($dbo->query($query) as $row) {
			$image_name = stripslashes($row["0"]);
		}
		

	}
	
	if ($image_name) {
		$image_name2 = "<img class=\"movie_cover_id\" src=\"../uploads/$movie_cover_id/$image_name\" alt=\"$image_name\">";
	} else {
		$image_name2 = "";
	}
	
	
	$movie["cover_image_id"] = $movie_cover_id;
	$movie["cover_image_name"] = $image_name;
	
	
	$query = "SELECT genre_movie.id, genre.name
	FROM genre_movie, genre
	WHERE genre_movie.genre_id = genre.genre_id
	AND genre_movie.movie_id = '$movie_id'
	ORDER BY genre.name ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$genre_movie_id = stripslashes($row["0"]);
		$name = stripslashes($row["1"]);
		
		$genre[] = $name;
		
	}
	
	
	$movie["genre"] = $genre;
	
	
	$query = "SELECT category_id, name
	FROM category
	ORDER BY category_id ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$category_id = stripslashes($row["0"]);

		if ($movie_category_id == $category_id) {
			$category_name = stripslashes($row["1"]);
		} 
	}
	
	$movie["category"] = "$category_name";
	
	$query = "SELECT movie_writer.id, people.name
	FROM movie_writer, people
	WHERE movie_writer.people_id = people.people_id
	AND movie_writer.movie_id = '$movie_id'
	ORDER BY people.name ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$movie_writer_id = stripslashes($row["0"]);
		$name = stripslashes($row["1"]);
		
		$writer["id"] = $movie_writer_id;
		$writer["name"] = $name;
		$writers[] = $writer;
		
		
	}
	
	$movie["writers"] = $writers;
	
	
	
	$query = "SELECT image.image_id, image.name, image_movie.id
	FROM image_movie, image
	WHERE image_movie.image_id = image.image_id
	AND image_movie.movie_id = '$movie_id'
	ORDER BY image.image_id ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$image_id = stripslashes($row["0"]);
		$name = stripslashes($row["1"]);
		$image_movie_id = stripslashes($row["2"]);
		
		$movie_image["id"] = $image_id;
		$movie_image["name"] = $name;
		$movie_images[] = $movie_image;
		
	}
	
	$movie["movie_images"] = $movie_images;
	
	
	
	unset($movie_images,$movie_image);
	
	$query = "SELECT movie_related.id, movie.cover_id, image.name, movie.movie_id, movie.name, movie.rating, movie.date_me
	FROM movie_related, movie, image
	WHERE movie_related.related_movie_id = movie.movie_id
	AND movie.cover_id = image.image_id
	AND movie_related.movie_id = '$movie_id'
	ORDER BY movie_related.movie_id ";
	foreach($dbo->query($query) as $row) {
		$related_id = stripslashes($row["0"]);
		$image_id = stripslashes($row["1"]);
		$name = stripslashes($row["2"]);
		$movie_id2 = stripslashes($row["3"]);
		$movie_name = stripslashes($row["4"]);
		$movie_rating = stripslashes($row["5"]); //get related movie rating
		$movie_release = stripslashes($row["6"]); //get related movie release date
		$release_date = date('Y', strtotime($movie_release)); //convert movie release date to year only
		
		$movie_image["movie_id"] = $movie_id2;
		$movie_image["movie_name"] = $movie_name;
		$movie_image["id"] = $image_id;
		$movie_image["name"] = $name;
		$movie_image["rating"] = $movie_rating; //assign related movie rating
		$movie_image["release_year"] = $release_date; //assign related movie release date

		$movie_images[] = $movie_image;
	}
	
	$movie["related_movies"] = $movie_images;
	
	
	
	$query = "SELECT movie_people.id, people.people_id, people.name, image.image_id, image.name, movie_people.character_name
	FROM movie_people, people, image
	WHERE movie_people.people_id = people.people_id
	AND people.image_id = image.image_id
	AND movie_people.movie_id = '$movie_id'
	ORDER BY movie_people.order_me ";
	
	
	foreach($dbo->query($query) as $row) {
		$movie_people_id = stripslashes($row["0"]);
		$people_id = stripslashes($row["1"]);
		$name = stripslashes($row["2"]);
		$image_id = stripslashes($row["3"]);
		$image_name = stripslashes($row["4"]);
		$character_name = stripslashes($row["5"]);
		
		$cast_member["people_id"] = $people_id;
		$cast_member["name"] = $name;
		$cast_member["image_id"] = $image_id;
		$cast_member["image_name"] = $image_name;
		$cast_member["character_name"] = $character_name;
		
		
		$cast[] = $cast_member;
		
	}
	
	$movie["cast"] = $cast;
	
	$query = "SELECT country_id, name
	FROM country
	ORDER BY name ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$country_id = stripslashes($row["0"]);
		$name = stripslashes($row["1"]);
	
		if ($movie_country_id == $country_id) {
			$country = "$name";
		} 
		
	}
	
	$movie["country"] = $country;
	
	
	
	
	$query = "SELECT language_id, name
	FROM language
	ORDER BY name ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$language_id = stripslashes($row["0"]);
		$name = stripslashes($row["1"]);
	
		if ($movie_language_id == $language_id) {
			$language = "$name";
		} 
	}
	
	$movie["language"] = $language;
	
	$query = "SELECT colour_id, name
	FROM colour
	ORDER BY colour_id ";
	//print("$query");
	foreach($dbo->query($query) as $row) {
		$colour_id = stripslashes($row["0"]);
		$name = stripslashes($row["1"]);
		
		if ($movie_colour_id == $colour_id) {
			$colour = "$name";
		} 
		
	}
	
	$movie["colour"] = $colour;
	


$data = json_encode($movie);

header("Content-Type: application/json");

print($data);




?>