// Global filmApp object (store all Methods/variables/etc.)
const filmApp = {}

// API properties
filmApp.tmdbURL = `https://api.themoviedb.org/3`
filmApp.tmdbApiKey = `6466215c94f1a824318fbdb48759e82e`
filmApp.posterBaseURL = `https://image.tmdb.org/t/p/original`
filmApp.youtubeURL = `https://youtube.com/watch`


// HTML properties
filmApp.searchForm = document.querySelector('.filmSearch')
filmApp.results = document.querySelector('.results')

// app.init
filmApp.init = () => {
  filmApp.userInput();
}

// User form input => search for a movie
filmApp.userInput = () => {
  filmApp.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userQuery = document.querySelector("input[name=searchFilmTitle]").value
    filmApp.filmSearch(userQuery)
  })
}

// Take user input, create ajax request to search for films with the user's input as the title
filmApp.filmSearch = (query) => {
  const search = new URL(`${filmApp.tmdbURL}/search/movie`)
  search.search = new URLSearchParams({
    api_key:filmApp.tmdbApiKey,
    include_adult:false,
    query:query
  })
  fetch(search)
  .then((results) => {
    return results.json();
  })
  .then((data) => {
    filmApp.queryData(data.results[0])
  })
}
// Get data for the film the user entered (ID, title, poster)
filmApp.queryData = (searchResult) => {
  console.log(searchResult)
  // Create a heading "Since you enjoy <film title>, you may also like:"
    // Include poster beside as well?
}


  
// Use film's ID# as param in second ajax request to grab recommended films

// In separate method, display recommended film array
  // each film displays (in a gallery-like presentation):
    // film Poster
    // Film Title
    // Plot Summary
      // Button to make another search for recommened films?
        // take ID # of recommended film, use it in same previous ajax request to get a second-level of film recommendations

// call app.init
filmApp.init();