//Chris Bull - Popcorn Night Dynamic Site Javascript

//* function to show the popcorn night splash page
function showPopcornNightSplashPage() {
    
    //hide all pages
    $(".notActive").hide();

    //hide the fun fact tooltip if still open on mobile
    //Reference: https://github.com/foundation/foundation-sites/issues/2394
    //Used above reference for assistance on hiding foundation tooltips between pages while the tooltip was still open
    $(".tooltip").hide();

    //remove scroll sliders on splash page
    removeSplashFeaturedScroll();

    //reset the scrolling when the window is loaded
    $(window).scrollTop();

    //AJAX call to get the splash page featured movies
    let popcornNightSplashMovies = $.ajax({
        url: "./assets/services/splash.php",
        type: "POST",
        dataType: "json"
    });

    //AJAX fail function to send an alert that the data was failed to be gathered
    popcornNightSplashMovies.fail(function (jqXHR, errorText) {
        alert("There was an AJAX error in the popcornNightSplashMovies function" + errorText);
    });

    //AJAX done function to gather the data
    popcornNightSplashMovies.done(function (popcornNightData) {

        //set variable to hold the splash movie data
        let splashMovies = ``;

        //set variables for splitting the featured movies into two rows
        let counter = 0;
        let moviesPerRow = Math.floor(popcornNightData[0].movie_count / 2);
        
        //loop through each splash movie
        $.each(popcornNightData, function (index, info) {
            //assign the movie data to variables
            let splash_movie_id = info.movie_id;
            let splash_movie_name = info.movie_name;
            let splash_image_id = info.cover_id;
            let splash_image_name = info.cover_name;
            let splash_movie_rating = info.movie_rating;
            let splash_movie_release = info.movie_date;

            //assign the splashMovies variable with a div containing the splash movie data
            splashMovies += `<div data-id="${splash_movie_id}" class="large-6 small-6 cell splashPageMovie">
            <div class="movieThumbnail">
            <img src="./uploads/${splash_image_id}/${splash_image_name}" alt="${splash_movie_name} poster"><br>
            <h5 class="movieRatingSplash">Rating - ${splash_movie_rating}</h5>
            </div>
            <h6>${splash_movie_name}</h6>
            <p>${splash_movie_release}</p>
            </div>`;

            //if the counter is less than the amount of movies per row
            if (counter < moviesPerRow) {
                //assign the splash movies to the first row for the featured splash movies
                $(".splashFeaturedScrolling_Row1").html(splashMovies);
                //increment the counter
                counter++;
            }

            //if the counter reaches the amount of movies per row
            if (counter == moviesPerRow) {
                //empty the splashMovies variable for the second row
                splashMovies = ``;
            }

            //once the counter reaches the max movies per row and goes above
            if (counter >= moviesPerRow) {
                //assign the splash movies to the second row for the featured splash movies
                $(".splashFeaturedScrolling_Row2").html(splashMovies);
                //increment the counter
                counter++;
            }
        });
        
        //initialize scroll sliders on splash page
        setupSplashFeaturedScroll();

        //show the splash page
        $(".popcornNightSplashPage").show();
    });
}

//* function to show the popcorn night movie page
function showPopcornNightMoviePage(splashMovieId) {
    
    //hide all pages
    $(".notActive").hide();

    //remove scroll sliders on movie page
    removeActorScroll();
    removeSimilarMovieScroll()
    removeMovieMediaScroll();

    //reset the scrolling when the window is loaded
    $(window).scrollTop();

    //AJAX call to get the movie page selected movie
    let popcornNightMovie = $.ajax({
        url: "./assets/services/movie.php",
        type: "POST",
        data: {
            movie_id: splashMovieId //pass through the splashMovieId to the service
        },
        dataType: "json"
    });

    //AJAX fail function to send an alert that the data was failed to be gathered
    popcornNightMovie.fail(function (jqXHR, errorText) {
        alert("There was an AJAX error in the popcornNightMovie function" + errorText);
    });

    //AJAX done function to gather the data
    popcornNightMovie.done(function (popcornNightData) {

        //create variables to determine if scrolling dots will be shown, if the slider has more entries than slides it shows on screen
        let showActorScrollDots = true;
        let showSimilarMovieScrollDots = true;
        let showMovieMediaScrollDots = true;

        //assign a variable to hold the movie image
        let movie_image = `./uploads/${popcornNightData.cover_image_id}/${popcornNightData.cover_image_name}`;

        //set the movieImage id tag image source as movie_image, and the alt tag as the movie_name data
        $("#movieImage img").attr("src", movie_image);
        $("#movieImage img").attr("alt", `${popcornNightData.movie_name} Poster`);

        //assign a variable to hold the movie rating
        let movie_rating = `Rating - ${popcornNightData.movie_rating}`;
        //set the movieRatingChosenMovie class tag to contain movie_rating
        $(".movieRatingChosenMovie").html(movie_rating);

        //assign a variable to contain the movie title as an h1 tag, and the fun fact information within a div
        let movie_title_section = `<h1>${popcornNightData.movie_name}</h1>
        <div id="findFunFact">
            <!-- Reference: https://get.foundation/sites/docs/tooltip.html -->
            <!-- Referenced the above link for documentation and usage on tooltips in foundation -->
            <h6 data-tooltip data-click-open="true" data-position="bottom" data-alignment="left" title="${popcornNightData.movie_didyouknow}">
                <img id="funFactLogo" src="assets/img/fun_fact_icon_1@72x.png">
                Hover/Tap to discover a Fun Fact about this movie!
            </h6>  
        </div>`;
        //set the movieTitle id tag to contain movie_title_section
        $("#movieTitle").html(movie_title_section);

        //assign a variable to hold the movie release date as an h3 tag
        let movie_releaseDate = `<h3>Released - ${popcornNightData.movie_date_me}</h3>`
        //set the movieRelease id tag to contain movie_releaseDate
        $("#movieRelease").html(movie_releaseDate);

        //assign a variable to hold the movie description as a p tag
        let movie_description = `<p>${popcornNightData.description}</p>`;
        //set the movieDescription id tag to contain movie_description
        $("#movieDescription").html(movie_description);

        //set variable to hold the movie writer data
        let movieWriters = ``;
        
        //loop through the movie writer data
        $.each(popcornNightData.writers, function (index, info) {
            //assign the writer data to variables
            let writer_name = info.name;
            
            //assign the movieWriters variable with the movie writer names
            //if the movieWriters variable is empty
            if (movieWriters == "") {
                //assign the writer name
                movieWriters += `${writer_name}`;
            }
            //if there are additional writers
            else {
                //add a comma to seperate additional writers
                movieWriters += `, ${writer_name}`;
            }
        });

        //assign a variable to contain the other movie info within a div
        let movie_otherInfo = `<div class="grid-x grid-margin-x">
            <div class="large-12 small-12 cell">
                <p><span class="movieOtherInfoTitles">Writers of ${popcornNightData.movie_name} - </span>${movieWriters}</p>
            </div>
            <div class="large-6 small-12 cell">
                <p><span class="movieOtherInfoTitles">Duration - </span>${popcornNightData.hours} hour(s) and ${popcornNightData.minutes} minutes</p>
                <p><span class="movieOtherInfoTitles">Country - </span>${popcornNightData.country}</p>
                <p><span class="movieOtherInfoTitles">Colour - </span>${popcornNightData.colour}</p>
            </div>
            <div class="large-6 small-12 cell">
                <p><span class="movieOtherInfoTitles">Audience Rating - </span>${popcornNightData.category}</p>
                <p><span class="movieOtherInfoTitles">Language - </span>${popcornNightData.language}</p>
            </div>
        </div>`;
        //set the movieOtherInfo id tag to contain movie_otherInfo
        $("#movieOtherInfo").html(movie_otherInfo);
        
        //set variable to hold the actors and actresses in movie data
        let peopleInMovie = ``;
        
        //loop through each person
        $.each(popcornNightData.cast, function (index, info) {
            //assign the person data to variables
            let person_id = info.people_id;
            let person_name = info.name;
            let person_image_id = info.image_id;
            let person_image_name = info.image_name;
            let person_character_name = info.character_name;
            
            //assign the movieWriters variable with the person data contained within a div
            peopleInMovie += `<div data-id="${person_id}" class="large-2 small-6 cell movieActors">
            <img src="./uploads/${person_image_id}/${person_image_name}" alt="${person_image_name}">
            <h6 class="nameOfActor">${person_name}</h6>
            <p class="characterOfActor">${person_character_name}</p>
            </div>`;
        });

        //Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
        //Used the above reference for information on gathering the window width using window.innerWidth
        //check if there are less than 7 entries for actors and actresses, and that the user window width is over 920 pixels
        if (popcornNightData.cast.length < 7 && window.innerWidth > 920) {
            //hide the actor/actress scrolling dots, as well as the back and forward buttons
            showActorScrollDots = false;
            $(".movieActorsButton").hide();
        }
        //also check if there are less than 5 entries for actors and actresses, and that the user window width between 540 and 920 pixels
        else if (popcornNightData.cast.length < 5 && window.innerWidth <= 920 && window.innerWidth > 540) {
            //hide the actor/actress scrolling dots, as well as the back and forward buttons
            showActorScrollDots = false;
            $(".movieActorsButton").hide();
        }
        //also check if there are more less than 3 entries for actors and actresses, and that the user window width is less than 540 pixels
        else if (popcornNightData.cast.length < 3 && window.innerWidth <= 540) {
            //hide the actor/actress scrolling dots, as well as the back and forward buttons
            showActorScrollDots = false;
            $(".movieActorsButton").hide();
        }
        else {
            //otherwise, show the actor/actress scrolling dots and back/forward buttons to let the user scroll through the slider
            showActorScrollDots = true;
            $(".movieActorsButton").show();
        }
        
        //set the actorScrolling class tag to contain peopleInMovie
        $(".actorScrolling").html(peopleInMovie);

        //assign a variable to contain the movie trailer within an iframe
        let movieTrailerVideo = `<iframe src="https://www.youtube.com/embed/${popcornNightData.youtube}"></iframe>`;
        //set the movieTrailerVideo id tag to contain movieTrailerVideo
        $("#movieTrailerVideo").html(movieTrailerVideo);

        //set variable to hold the similar movies data
        let similarMovies = ``;
        
        //loop through each similar movie
        $.each(popcornNightData.related_movies, function (index, info) {
            //assign the similar movie data to variables
            let similar_movie_id = info.movie_id;
            let similar_movie_name = info.movie_name;
            let similar_image_id = info.id;
            let similar_image_name = info.name;
            let similar_movie_rating = info.rating;
            let similar_movie_year = info.release_year;
            
            //assign the similarMovies variable with the similar movie data contained within a div
            similarMovies += `<div data-id="${similar_movie_id}" class="large-4 small-6 cell similarMovie">
            <div class="movieThumbnail">
                <img src="./uploads/${similar_image_id}/${similar_image_name}" alt="${similar_movie_name} poster">
                <h5 class="movieRating">Rating - ${similar_movie_rating}</h5>
            </div>
            <h6>${similar_movie_name}</h6>
            <p>${similar_movie_year}</p>
            </div>`;
        });

        //if there were no similar movies
        if (similarMovies == ``) {
            //hide the similar movie content
            $(".similarMovieContent").hide();
            //hide the movie page divider to let the movie media move fully to the left
            $(".moviePageDivider").hide();
        }
        else {
            //otherwise, show the similar movie content and show the 1 column gap between the similar movies content and movie media content
            $(".similarMovieContent").show();
            $(".moviePageDivider").show();

            //Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
            //Used the above reference for information on gathering the window width using window.innerWidth
            //check if there are less than 4 entries for similar movies, and that the user window width is over 540 pixels
            if (popcornNightData.related_movies.length < 4 && window.innerWidth > 540) {
                //hide the similar movie scrolling dots, as well as the back and forward buttons
                showSimilarMovieScrollDots = false;
                $("#similarMovieButtonSection").hide();
            }
            //also check if there are more less than 3 entries for similar movies, and that the user window width is less than 540 pixels
            else if (popcornNightData.related_movies.length < 3 && window.innerWidth <= 540) {
                //hide the similar movie scrolling dots, as well as the back and forward buttons
                showSimilarMovieScrollDots = false;
                $("#similarMovieButtonSection").hide();
            }
            else {
                //otherwise, show the similar movie scrolling dots and back/forward buttons to let the user scroll through the slider
                showSimilarMovieScrollDots = true;
                $("#similarMovieButtonSection").show();
            }

            //set the similarMovieScrolling class tag to contain similarMovies
            $(".similarMovieScrolling").html(similarMovies);
        }

        //set variable to hold the movie media data
        let movieMedia = ``;

        //loop through each movie media
        $.each(popcornNightData.movie_images, function (index, info) {
            //assign the movie media data to variables
            let movie_media_id = info.id;
            let movie_media_name = info.name;
            
            //assign the movieMedia variable with the movie media data contained within a div
            movieMedia += `<div class="large-6 small-12 cell mediaMovie">
            <img src="./uploads/${movie_media_id}/${movie_media_name}" alt="Media from ${popcornNightData.movie_name}">
            </div>`;
        });

        //if there was no movie media
        if (movieMedia == ``) {
            //hide the movie media content
            $(".movieMediaContent").hide();
        }
        else {
            //otherwise, show the movie media content
            $(".movieMediaContent").show();

            //Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
            //Used the above reference for information on gathering the window width using window.innerWidth
            //check if there are less than 3 entries for movie media, and that the user window width is over 540 pixels
            if (popcornNightData.related_movies.length < 3 && window.innerWidth > 540) {
                //hide the movie media scrolling dots, as well as the back and forward buttons
                showMovieMediaScrollDots = false;
                $("#movieMediaButtonSection").hide();
            }
            //also check if there are more less than 2 entries for movie media, and that the user window width is less than 540 pixels
            else if (popcornNightData.related_movies.length < 2 && window.innerWidth <= 540) {
                //hide the movie media scrolling dots, as well as the back and forward buttons
                showMovieMediaScrollDots = false;
                $("#movieMediaButtonSection").hide();
            }
            else {
                //otherwise, show the movie media scrolling dots and back/forward buttons to let the user scroll through the slider
                showMovieMediaScrollDots = true;
                $("#movieMediaButtonSection").show();
            }

            //set the movieMediaScrolling class tag to contain movieMedia
            $(".movieMediaScrolling").html(movieMedia);
        }

        //initialize scroll sliders on movie page
        setupActorScroll(showActorScrollDots);
        setupSimilarMovieScroll(showSimilarMovieScrollDots);
        setupMovieMediaScroll(showMovieMediaScrollDots);

        //initialize the website for foundations, allowing the fun fact tooltip to function
        $(document).foundation();

        //show the movie page
        $(".popcornNightMoviePage").show();
    });
}

// * function to show the popcorn night person page
function showPopcornNightPersonPage(personId) {
    
    //hide all pages
    $(".notActive").hide();
    //hide the fun fact tooltip if still open on mobile
    //Reference: https://github.com/foundation/foundation-sites/issues/2394
    //Used above reference for assistance on hiding foundation tooltips between pages while the tooltip was still open
    $(".tooltip").hide();

    //remove scroll sliders on person page
    removeFeaturedInMovieScroll();
    removeActorMediaScroll()

    //reset the scrolling when the window is loaded
    $(window).scrollTop();

    //AJAX call to get the person page selected person
    let popcornNightPerson = $.ajax({
        url: "./assets/services/people.php",
        type: "POST",
        data: {
            people_id: personId //pass through the personId to the service
        },
        dataType: "json"
    });

    //AJAX fail function to send an alert that the data was failed to be gathered
    popcornNightPerson.fail(function (jqXHR, errorText) {
        alert("There was an AJAX error in the popcornNightPerson function " + errorText);
    });

    //AJAX done function to gather the data
    popcornNightPerson.done(function (popcornNightData) {

        //create variables to determine if scrolling dots will be shown for sliders on the person page, if the slider has more entries than slides it shows on screen
        let showFeaturedMoviesDots = true;
        let showActorMediaDots = true;

        //assign a variable to hold the person image
        let person_image = `./uploads/${popcornNightData.cover_image_id}/${popcornNightData.cover_image_name}`;

        //set the actorImage id tag image source as person_image, and the alt tag as the people_name data
        $("#actorImage img").attr("src", person_image);
        $("#actorImage img").attr("alt", `${popcornNightData.people_name} Poster`);

        //assign a variable to contain the person name as an h1 tag
        let person_title = `<h1>${popcornNightData.people_name}</h1>`
        //set the actorName id tag to contain person_title
        $("#actorName").html(person_title);

        //assign a variable to hold the person birth date as an h3 tag, and the person death date as an h6 tag
        let person_dates = `<h3>Birth Date - ${popcornNightData.born}</h3>
        <h6>Death Date - ${popcornNightData.died}`;
        //set the actorBirth id tag to contain person_dates
        $("#actorBirth").html(person_dates);

        //assign a variable to hold the person biography title as a h3 tag, and the biography info in a p tag
        let person_description = `<h3>${popcornNightData.people_name} Biography</h3>
        <p>${popcornNightData.people_biography}</p>`;
        //set the actorBio id tag to contain person_description
        $("#actorBio").html(person_description);
    
        //set variable to hold the movies the person featured in data
        let personFeaturedMovies = ``;
        
        //loop through the featured in movie data
        $.each(popcornNightData.movies, function (index, info) {
            //assign the featured in movie data to variables
            let featuredIn_movie_id = info.movie_id;
            let featuredIn_movie_name = info.movie_name;
            let featuredIn_image_id = info.image_id;
            let featuredIn_image_name = info.image_name;
            let featuredIn_movie_rating = info.rating;
            let featuredIn_movie_year = info.year;
            
            //assign the personFeaturedMovies variable with the featured in movie data
            personFeaturedMovies += `<div data-id="${featuredIn_movie_id}" class="large-4 small-6 cell actorMovies">
            <div class="movieThumbnail">
                <img src="./uploads/${featuredIn_image_id}/${featuredIn_image_name}" alt="${featuredIn_movie_name} poster">
                <h5 class="movieRating">Rating - ${featuredIn_movie_rating}</h5>
            </div>
            <h6>${featuredIn_movie_name}</h6>
            <p>${featuredIn_movie_year}</p>
            </div>`;
        });

        //if there were no featured movies the person was in
        if (personFeaturedMovies == ``) {
            //hide the actor movies content
            $(".actorMoviesContent").hide();
            //hide the person page divider to let the actor and actress media move fully to the left
            $(".personPageDivider").hide();
        }
        else {
            //otherwise, show the actor movies content and show the 1 column gap between the actors/actresses movies content and actor/actress media content
            $(".actorMoviesContent").show();
            $(".personPageDivider").show();

            //Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
            //Used the above reference for information on gathering the window width using window.innerWidth
            //check if there are less than 4 entries for featured in movies, and that the user window width is over 540 pixels
            if (popcornNightData.movies.length < 4 && window.innerWidth > 540) {
                //hide the featured in movies scrolling dots, as well as the back and forward buttons
                showFeaturedMoviesDots = false;
                $("#actorMoviesButtonSection").hide();
            }
            //also check if there are more less than 3 entries for featured in movies, and that the user window width is less than 540 pixels
            else if (popcornNightData.movies.length < 3 && window.innerWidth <= 540) {
                //hide the featured in movies scrolling dots, as well as the back and forward buttons
                showFeaturedMoviesDots = false;
                $("#actorMoviesButtonSection").hide();
            }
            else {
                //otherwise, show the featured in movies scrolling dots and back/forward buttons to let the user scroll through the slider
                showFeaturedMoviesDots = true;
                $("#actorMoviesButtonSection").show();
            }

            //set the featuredInScrolling class tag to contain personFeaturedMovies
            $(".featuredInScrolling").html(personFeaturedMovies);
        }

        //assign a variable to contain the person media title as an h3 tag
        let personMediaTitle = `<h3>Media of ${popcornNightData.people_name}</h3>`;
        //set the actorMediaTitle id tag to contain personMediaTitle
        $("#actorMediaTitle").html(personMediaTitle);

        //set variable to hold the person media data
        let personMedia = ``;

        //loop through each media of the person
        $.each(popcornNightData.people_images, function (index, info) {
            //assign the person media data to variables
            let person_media_id = info.id;
            let person_media_name = info.name;
            
            //assign the personMedia variable with the media of the person data contained within a div
            personMedia += `<div class="large-6 small-12 cell mediaActor">
            <img src="./uploads/${person_media_id}/${person_media_name}" alt="Media of ${popcornNightData.people_name}">
            </div>`;
        });

        //if there was no person media
        if (personMedia == ``) {
            //hide the actor media content
            $(".actorMediaContent").hide();
        }
        else {
            //otherwise, show the actor media content
            $(".actorMediaContent").show();

            //Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
            //Used the above reference for information on gathering the window width using window.innerWidth
            //check if there are less than 3 entries for actor and actress media, and that the user window width is over 540 pixels
            if (popcornNightData.people_images.length < 3 && window.innerWidth > 540) {
                //hide the actor and actress media scrolling dots, as well as the back and forward buttons
                showActorMediaDots = false;
                $("#mediaActorButtonSection").hide();
            }
            //also check if there are more less than 2 entries for actor and actress media, and that the user window width is less than 540 pixels
            else if (popcornNightData.people_images.length < 2 && window.innerWidth <= 540) {
                //hide the actor and actress media scrolling dots, as well as the back and forward buttons
                showActorMediaDots = false;
                $("#mediaActorButtonSection").hide();
            }
            else {
                //otherwise, show the actor and actress media scrolling dots and back/forward buttons to let the user scroll through the slider
                showActorMediaDots = true;
                $("#mediaActorButtonSection").show();
            }

            //set the actorMediaScrolling class tag to contain personMedia
            $(".actorMediaScrolling").html(personMedia);
        }

        //initialize scroll sliders on the person page
        setupFeaturedInMovieScroll(showFeaturedMoviesDots);
        setupActorMediaScroll(showActorMediaDots);

        //show the person page
        $(".popcornNightPersonPage").show();
    });
}

// * function to show the popcorn night search bar entries
function showPopcornNightSearch(userEntry) {
    
    //AJAX call to get the search field movies, actors, and actresses
    let popcornNightSearch = $.ajax({
        url: "./assets/services/search.php",
        type: "POST",
        data: {
            search_text: userEntry //pass userEntry for search_text
        },
        dataType: "json"
    });

    //AJAX fail function to send an alert that the data was failed to be gathered
    popcornNightSearch.fail(function (jqXHR, errorText) {
        alert("There was an AJAX error in the popcornNightSearch function" + errorText);
    });

    //AJAX done function to gather the data
    popcornNightSearch.done(function (popcornNightData) {

        //if the search data is empty
        if (popcornNightData == null) {
            //hide the search entries
            $(".searchEntries").hide();
        }
        else {
            //set variable to hold the search bar data
            let searchData = ``;

            //loop through each search entry
            $.each(popcornNightData, function (index, info) {
                
                //determine if the data is movie data or person data
                let searchClassification = info.type;
                
                //if data is movie data
                if (searchClassification == 1) {
                    //assign the search movie data to variables
                    let search_movie_id = info.movie_id;
                    let search_movie_name = info.movie_name;
                    let search_movie_image_id = info.cover_id;
                    let search_movie_image_name = info.cover_name;

                    //assign the searchData variable with a div containing the search movie data
                    searchData += `<div data-id="${search_movie_id}" class="searchOrdering searchBarMovie">
                    <img src="./uploads/${search_movie_image_id}/${search_movie_image_name}" alt="${search_movie_name} poster">
                    <h6>${search_movie_name}</h6>
                    </div>`;
                }
                //otherwise, if it is person data
                else {
                    //assign the search person data to variables
                    let search_person_id = info.people_id;
                    let search_person_name = info.name;
                    let search_person_image_id = info.cover_id;
                    let search_person_image_name = info.cover_name;

                    //assign the searchData variable with a div containing the search person data
                    searchData += `<div data-id="${search_person_id}" class="searchOrdering searchBarPerson">
                    <img src="./uploads/${search_person_image_id}/${search_person_image_name}" alt="${search_person_name} poster">
                    <h6>${search_person_name}</h6>
                    </div>`;
                } 
            });
            //set the searchEntries class tag to contain searchData, and show the searchEntries
            $(".searchEntries").html(searchData).show();
        }
    });
}

// * function to show the popcorn night splash page search bar entries
function showPopcornNightSplashSearch(userEntry) {
    
    //AJAX call to get the splash page search field movies, actors, and actresses
    let popcornNightSplashSearch = $.ajax({
        url: "./assets/services/search.php",
        type: "POST",
        data: {
            search_text: userEntry //pass userEntry for search_text
        },
        dataType: "json"
    });

    //AJAX fail function to send an alert that the data was failed to be gathered
    popcornNightSplashSearch.fail(function (jqXHR, errorText) {
        alert("There was an AJAX error in the popcornNightSplashSearch function" + errorText);
    });

    //AJAX done function to gather the data
    popcornNightSplashSearch.done(function (popcornNightData) {

        //if the search data is empty
        if (popcornNightData == null) {
            //hide the splash search entries
            $(".splashSearchEntries").hide();
        }
        else {
            //set variable to hold the search bar data
            let splashSearchData = ``;

            //loop through each search entry
            $.each(popcornNightData, function (index, info) {
                
                //determine if the data is movie data or person data
                let searchClassification = info.type;
                
                //if data is movie data
                if (searchClassification == 1) {
                    //assign the movie splash search data to variables
                    let splash_search_movie_id = info.movie_id;
                    let splash_search_movie_name = info.movie_name;
                    let splash_search_movie_image_id = info.cover_id;
                    let splash_search_movie_image_name = info.cover_name;

                    //assign the splashSearchData variable with a div containing the movie search data
                    splashSearchData += `<div data-id="${splash_search_movie_id}" class="searchOrdering splashBarMovie">
                    <img src="./uploads/${splash_search_movie_image_id}/${splash_search_movie_image_name}" alt="${splash_search_movie_name} poster">
                    <h6>${splash_search_movie_name}</h6>
                    </div>`;
                }
                //otherwise, if it is person data
                else {
                    //assign the person splash search data to variables
                    let splash_search_person_id = info.people_id;
                    let splash_search_person_name = info.name;
                    let splash_search_person_image_id = info.cover_id;
                    let splash_search_person_image_name = info.cover_name;

                    //assign the splashSearchData variable with a div containing the search person data
                    splashSearchData += `<div data-id="${splash_search_person_id}" class="searchOrdering splashBarPerson">
                    <img src="./uploads/${splash_search_person_image_id}/${splash_search_person_image_name}" alt="${splash_search_person_name} poster">
                    <h6>${splash_search_person_name}</h6>
                    </div>`;
                } 
            });
            //set the splashSearchEntries class tag to contain splashSearchData, and show the splashSearchEntries
            $(".splashSearchEntries").html(splashSearchData).show();
        }
    });
}

//function to setup the scrolling for the featured movies on the splash page
function setupSplashFeaturedScroll() {
    //setup the slick function for the scrolling in featured movies row 1
    $('.splashFeaturedScrolling_Row1').slick({    
        slidesToShow: 2,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 3500,
        arrows: false,
        //add responsive breakpoints for mutliple devices
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 2
                }
            },
            {
                breakpoint: 920,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 1
                }
            },
            {
                breakpoint: 540,
                settings: {
                slidesToShow: 1,
                slidesToScroll: 1
                }
            }
        ]
    });

    //setup the slick function for the scrolling for featured movies row 2
    $('.splashFeaturedScrolling_Row2').slick({    
        slidesToShow: 2,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 4500,
        arrows: false,
        //add responsive breakpoints for mutliple devices
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 2
                }
            },
            {
                breakpoint: 920,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 1
                }
            },
            {
                breakpoint: 540,
                settings: {
                slidesToShow: 1,
                slidesToScroll: 1
                }
            }
        ]
    });
}

//function to remove the scrolling for the featured movies on the splash page
function removeSplashFeaturedScroll() {
    //remove the slick functionality for the scrolling for featured movies row 1
    $('.splashFeaturedScrolling_Row1').slick("unslick");

    //remove the slick functionality for the scrolling for featured movies row 2 
    $('.splashFeaturedScrolling_Row2').slick("unslick");
}

//function to setup the scrolling for the actors/actresses on the movie page
function setupActorScroll(showDots) {
    //setup the slick function for the scrolling
    $('.actorScrolling').slick({    
        slidesToShow: 6,
        autoplay: true,
        autoplaySpeed: 5000,
        dots: showDots,
        arrows: false,
        //add responsive breakpoints for mutliple devices
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                slidesToShow: 6,
                slidesToScroll: 1
                }
            },
            {
                breakpoint: 920,
                settings: {
                slidesToShow: 4,
                slidesToScroll: 2
                }
            },
            {
                breakpoint: 540,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 2
                }
            }
        ]
    });
}

//function to remove the scrolling for the actors/actresses on the movie page
function removeActorScroll() {
    //remove the slick functionality for the scrolling
    $('.actorScrolling').slick("unslick");
}

//function to setup the scrolling for the similar movies on the movie page
function setupSimilarMovieScroll(showDots) {
    //setup the slick function for the scrolling
    $('.similarMovieScrolling').slick({    
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        dots: showDots,
        arrows: false,
        //add responsive breakpoints for mutliple devices
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                slidesToShow: 3,
                slidesToScroll: 1
                }
            },
            {
                breakpoint: 540,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 1
                }
            }
        ]
    });
}

//function to remove the scrolling for the similar movies on the movie page
function removeSimilarMovieScroll() {
    //remove the slick functionality for the scrolling
    $('.similarMovieScrolling').slick("unslick");
}

//function to setup the scrolling for the movie media on the movie page
function setupMovieMediaScroll(showDots) {
    //setup the slick function for the scrolling
    $('.movieMediaScrolling').slick({    
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: false,
        dots: showDots,
        arrows: false,
        //add responsive breakpoints for mutliple devices
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 1
                }
            },
            {
                breakpoint: 540,
                settings: {
                slidesToShow: 1,
                slidesToScroll: 1
                }
            }
        ]
    });
}

//function to remove the scrolling for the movie media on the movie page
function removeMovieMediaScroll() {
    //remove the slick functionality for the scrolling
    $('.movieMediaScrolling').slick("unslick");
}

//function to setup the scrolling for the featured in movies on the actor/actress page
function setupFeaturedInMovieScroll(showDots) {
    //setup the slick function for the scrolling
    $('.featuredInScrolling').slick({    
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        dots: showDots,
        arrows: false,
        //add responsive breakpoints for mutliple devices
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                slidesToShow: 3,
                slidesToScroll: 1
                }
            },
            {
                breakpoint: 540,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 1
                }
            }
        ]
    });
}

//function to remove the scrolling for the featured in movies on the actor/actress page
function removeFeaturedInMovieScroll() {
    //remove the slick functionality for the scrolling
    $('.featuredInScrolling').slick("unslick");
}

//function to setup the scrolling for the actor/actress media on the actor/actress page
function setupActorMediaScroll(showDots) {
    //setup the slick function for the scrolling
    $('.actorMediaScrolling').slick({    
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: false,
        dots: showDots,
        arrows: false,
        //add responsive breakpoints for mutliple devices
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 1
                }
            },
            {
                breakpoint: 540,
                settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                swipeToSlide: true
                }
            }
        ]
    });
}

//function to remove the scrolling for the actor/actress media on the actor/actress page
function removeActorMediaScroll() {
    //remove the slick functionality for the scrolling
    $('.actorMediaScrolling').slick("unslick");
}

//once the window has fully loaded
$(window).on("load", function () {
    
    // SAMMY ROUTING
    // Controller in MVC

    //initialize slick scrolls when the window loads
    setupSplashFeaturedScroll();
    setupActorScroll();
    setupSimilarMovieScroll();
    setupMovieMediaScroll();
    setupFeaturedInMovieScroll();
    setupActorMediaScroll();
    
    //setup the routes for the dynamic site to use
    var app = $.sammy(function () {

        //route for the popcorn night splash page
        this.get('#/popcorn-night-splash/', function () {
            showPopcornNightSplashPage();
        });

        //route for the popcorn night movie page
        this.get('#/popcorn-night-movie/:movieId', function () {
            let popcornNightMovieId = this.params["movieId"];
            showPopcornNightMoviePage(popcornNightMovieId);
        });

        //route for the popcorn night person page
        this.get('#/popcorn-night-person/:personId', function () {
            let popcornNightPersonId = this.params["personId"];
            showPopcornNightPersonPage(popcornNightPersonId);
        });
    });

	// default route when page first loads
    $(function () { app.run('#/popcorn-night-splash/'); });

    //set JQuery event listeners for switching between the dynamic site pages

    //switch to movie page when featured movie on splash page is clicked
    $(document).on("click", "body .splashPageMovie", function() {
        let featuredMovieId = $(this).attr("data-id");
        location.href = `#/popcorn-night-movie/${featuredMovieId}`;
    });

    //switch to actor page when actor/actress on movie page is clicked
    $(document).on("click", "body .movieActors", function() {
        let chosenPerson = $(this).attr("data-id");
        location.href = `#/popcorn-night-person/${chosenPerson}`;
    });

    //switch to actor page when actor/actress on search bar entry is clicked
    $(document).on("click", "body .searchBarPerson", function() {
        let chosenPerson = $(this).attr("data-id");
        location.href = `#/popcorn-night-person/${chosenPerson}`;
        //hide the search entries after an entry is clicked
        $(".searchEntries").hide();
    });

    //switch to actor page when actor/actress on splash search bar entry is clicked
    $(document).on("click", "body .splashBarPerson", function() {
        let chosenPerson = $(this).attr("data-id");
        location.href = `#/popcorn-night-person/${chosenPerson}`;
        //hide the splash search entries after an entry is clicked
        $(".splashSearchEntries").hide();
    });

    //switch to movie page when movie on search bar entry is clicked
    $(document).on("click", "body .searchBarMovie", function() {
        let actorMovieId = $(this).attr("data-id");
        location.href = `#/popcorn-night-movie/${actorMovieId}`;
        //hide the search entries after an entry is clicked
        $(".searchEntries").hide();
    });

    //switch to movie page when movie on splash search bar entry is clicked
    $(document).on("click", "body .splashBarMovie", function() {
        let actorMovieId = $(this).attr("data-id");
        location.href = `#/popcorn-night-movie/${actorMovieId}`;
        //hide the splash search entries after an entry is clicked
        $(".splashSearchEntries").hide();
    });

    //switch to movie page when movie on actor page is clicked
    $(document).on("click", "body .actorMovies", function() {
        let actorMovieId = $(this).attr("data-id");
        location.href = `#/popcorn-night-movie/${actorMovieId}`;
    });

    //switch to new movie on movie page when similar movie is clicked
    $(document).on("click", "body .similarMovie", function() {
        let newMovieId = $(this).attr("data-id");
        location.href = `#/popcorn-night-movie/${newMovieId}`;
    });

    //switch to splash screen when popcorn night logo is clicked
    $(document).on("click", "body .popcornNightLogo", function() {
        location.href = "#/popcorn-night-splash/";
    });

    //switch to splash screen when popcorn night header logo is clicked
    $(document).on("click", "body .popcornNightLogoHeader", function() {
        location.href = "#/popcorn-night-splash/";
    });

    //show search bar entries when user types in search bar
    $("#headerSearch").keyup( function () {
        let userEntry = $(this).val();
        showPopcornNightSearch(userEntry);
    });

    //show splash search bar entries when user types in splash page search bar
    $("#splashPageSearch").keyup( function () {
        let userEntry = $(this).val();
        showPopcornNightSplashSearch(userEntry);
    });

    //set jQuery event listeners for the custom slider buttons
    //Reference: https://kenwheeler.github.io/slick/
    //Used the above reference for information about slickPrev and slickNext parameters

    //splash page buttons

    //switch featured movie previous button function
    $(document).on("click", "body #switchFeaturedLast", function() {
        //scroll to the previous splash page featured movie in row 1 using slickPrev
        $('.splashFeaturedScrolling_Row1').slick("slickPrev");

        //scroll to the previous splash page featured movie in row 2 using slickPrev
        $('.splashFeaturedScrolling_Row2').slick("slickPrev");
    });

    //switch featured movie next button function
    $(document).on("click", "body #switchFeaturedNext", function() {
        //scroll to the next splash page featured movie in row 1 using slickNext
        $('.splashFeaturedScrolling_Row1').slick("slickNext");

        //scroll to the next splash page featured movie in row 2 using slickNext
        $('.splashFeaturedScrolling_Row2').slick("slickNext");
    });

    //movie page buttons

    //movie actor/actress previous button function
    $(document).on("click", "body #movieActorLast", function() {
        //scroll to the previous actor/actress using slickPrev
        $('.actorScrolling').slick("slickPrev");
    });

    //movie actor/actress next button function
    $(document).on("click", "body #movieActorNext", function() {
        //scroll to the next actor/actress using slickNext
        $('.actorScrolling').slick("slickNext");
    });

    //similar movie previous button function
    $(document).on("click", "body #similarMovieLast", function() {
        //scroll to the previous similar movie using slickPrev
        $('.similarMovieScrolling').slick("slickPrev");
    });

    //similar movie next button function
    $(document).on("click", "body #similarMovieNext", function() {
        //scroll to the next similar movie using slickNext
        $('.similarMovieScrolling').slick("slickNext");
    });

    //movie media previous button function
    $(document).on("click", "body #movieMediaLast", function() {
        //scroll to the previous movie media using slickPrev
        $('.movieMediaScrolling').slick("slickPrev");
    });

    //movie media next button function
    $(document).on("click", "body #movieMediaNext", function() {
        //scroll to the next movie media using slickNext
        $('.movieMediaScrolling').slick("slickNext");
    });

    //actor/actress page

    //featured in movie previous button function
    $(document).on("click", "body #featuredInLast", function() {
        //scroll to the previous featured in movie using slickPrev
        $('.featuredInScrolling').slick("slickPrev");
    });

    //featured in movie next button function
    $(document).on("click", "body #featuredInNext", function() {
        //scroll to the next featured in movie using slickNext
        $('.featuredInScrolling').slick("slickNext");
    });

    //actor/actress media previous button function
    $(document).on("click", "body #actorMediaLast", function() {
        //scroll to the previous actor/actress media using slickPrev
        $('.actorMediaScrolling').slick("slickPrev");
    });

    //actor/actress media next button function
    $(document).on("click", "body #actorMediaNext", function() {
        //scroll to the next actor/actress media using slickNext
        $('.actorMediaScrolling').slick("slickNext");
    });

    //set jQuery event listener for the foundation tootips

    //function to close the tooltip when the tooltip is tapped on mobile
    $(document).on("click", "body .tooltip", function() {
        //hide the fun fact tooltip
        $('.tooltip').hide();
    });
});