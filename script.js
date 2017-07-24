$(function() {
	var $form = $("form");
	var $showInput = $("#show-input");
	var $showHolder = $("#show-holder");
	
	$form.on("submit", function(e){
		e.preventDefault();
		$.ajax({
		    method: "GET",
		    url: "//api.tvmaze.com/singlesearch/shows",
		    data: {
		        q: $($showInput).val(),
		        "embed[]": ["cast", "seasons"]
		    },
		    dataType: "json",
		    traditional: true
		}).then(function(response){
			var $showName = response.name;
			var $showImg = response.image.medium;
			// if there is no network(HBO), set it to the webChannel name(Netflix)
			var $showNetwork = response.network ? response.network.name : response.webChannel.name;
			var $showRating = response.rating.average;
			var $showStatus = response.status;
			var $showPremiere = response.premiered;
			var $showLink = response.url;
			var $imdbLink = "http://www.imdb.com/title/" + response.externals.imdb;
			var $showSummary = response.summary;
			var $showSeasons;
			var $seasonsArr = [];
			var $showInfo = [];
			var $showGenres = [];
			var $showCast = [];
			var $totalEpisodes = 0;
			var $showResults = $("<ul>", {
				addClass: "show-results"
			});
			var $removeShow = $("<span>", {
				addClass: "glyphicon glyphicon-remove text-danger pull-right remove-show"
			});

			// push a max of 5 genres into $showGenres array
			$(response.genres).each(function(i,el){
				if(i < 5){
					$showGenres.push(" " + el);
				}
			});
			// if a premiere date exists, push each season number into $seasonsArr and increment total episodes count by that seasons episodes 
			$(response._embedded.seasons).each(function(i,el){
				if(el.premiereDate){
					$seasonsArr.push(el.number);
					$totalEpisodes += el.episodeOrder;
				} 
			});
			// select the last season number in $seasonsArr
			$showSeasons = $seasonsArr[$seasonsArr.length-1];
			// some older shows have null as episode count; set it to N/A instead of 0
			if($totalEpisodes === 0){
				$totalEpisodes = "N/A";
			}
			// push a max of 10 actors into $showCast array
			$(response._embedded.cast).each(function(i,el){
				if(i < 10){
					$showCast.push(" " + el.person.name);
				}
			});
			// append a new ul that holds each show's info
			$showHolder.append($showResults);
			// append the remove icon for each show
			$showResults.append($removeShow);
			// store all of show's info in $showInfo array
			$showInfo.push("<img src=" + $showImg + ">", 
				"<b>Name: </b>" + $showName, 
				"<b>Rating: </b>" + $showRating,
				"<b>Network: </b>" + $showNetwork,
				"<b>Premiere Date: </b>" + $showPremiere,
				"<b>Status: </b>" + $showStatus,
				"<b>Seasons: </b>" + $showSeasons,
				"<b>Total Episodes: </b>" + $totalEpisodes, 
				"<b>Genres: </b>" + $showGenres, 
				"<b>Actors: </b>" + $showCast,
				"<b>Summary: </b>" + $showSummary,
				"<b>More Info: </b><a target='_blank' href='" + $showLink + "'>TVmaze</a> <a target='_blank' href='" + $imdbLink + "'>IMDB</a>");
			
			// create anad append a li for each item in $showInfo array
			$($showInfo).each(function(i,el){
				createAndAppendLi(el);
			});	

			$showResults.append($("<hr>"));

			$form.trigger("reset");

			function createAndAppendLi(data){
				var $newLi = $("<li>", {
					html: data,
					addClass: "show-info"
				});
				$showResults.append($newLi);
			}
		}).catch(function(error){
		    console.log(error);
		});
	});

	$showHolder.on("click", ".remove-show", function(e){
		$(e.target).parent().remove();
	});
})