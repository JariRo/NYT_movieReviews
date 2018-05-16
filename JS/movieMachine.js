let movieMachine = (function(){

/*Setup eventHandelers and load movie reviews*/
  let setItUp = () => {
    $("#searchMovie button").click(function(e){
      e.preventDefault();
      let searchQuery = $("input:text").val();
      ajaxMovieRequest(searchQuery.trim());
    });

    $("#filters input").change(function(e){
      e.preventDefault()
      let filter = $('#filters input:checked').val();
      let sorted_movies = sorter(filter);
      setupMovies(sorted_movies);
    })
    ajaxMovieRequest()
  }

/*Sort the movies either by Date in descending order or Alphabetical*/
  let sorter = filter => {
    let moviesToSort = Array.from(document.querySelectorAll("#movieResults .thumbnail"));
    if(filter === "Newest"){
      moviesToSort.sort(function(a,b){
        let dateA = new Date(a.dataset.date), dateB = new Date(b.dataset.date)
        return dateB - dateA
      })
    }
    else if(filter === "Alphabetic"){
      moviesToSort.sort(function(a,b){
        if(a.dataset.title < b.dataset.title) return -1;
        if(a.dataset.title > b.dataset.title) return 1;
        return 0;
      })
    }
    return moviesToSort
  }

/* Request the reviews from the API:
  - With search string
  - Without search string
*/
  let ajaxMovieRequest = searchText =>{
    let theUrl = "http://api.nytimes.com/svc/movies/v2/reviews/search.json"

    if (searchText && searchText != null){
      theUrl += "?" + $.param({
        'api-key': "24e47a7b2af940ca8060606f5fbb070a",
        'query': searchText
      })
    } else{
      theUrl += "?" + $.param({
        'api-key': "24e47a7b2af940ca8060606f5fbb070a"
      })
    }

    $.ajax({
      url:theUrl,
      method: "GET"
    }).done(function(result){
      setupMovies(result.results)
    }).fail(function(err){
      throw err;
    });
  }

/* Generate the content:
 - In sorted way
 - In unsorted way
*/
  let setupMovies = movies =>{
    $('#movieResults').empty();
    if(movies[0].tagName === "FIGURE"){
      $.each(movies, function(index, movie){
        $('#movieResults').append(movie)
      });
    }
    else{
      $.each(movies, function(index, movie){
        if ( movie.multimedia == null ){
          var background = "#ccc";
        }
        else{
          var background = "url("+movie.multimedia.src+") no-repeat 0"
        }
        console.log(movie)
        let summary = movie.summary_short == "" ? "No Summary Available" : movie.summary_short;
        let thumbnail = $('<figure class="thumbnail" data-date="' + movie.date_updated +  '" data-title="'+movie.display_title+'">\
        <figcaption class="caption">\
        <h4>' + movie.display_title + '</h4>\
        <p>' + summary + '</p>\
        </figcaption>\
        </figure>').css({
          "background": background
        });

        $('#movieResults').append(thumbnail);
      });
    }
  }
  return{
    setItUp:setItUp,
  };
}());

let init = function(){
  movieMachine.setItUp();
}
window.onload = init();
