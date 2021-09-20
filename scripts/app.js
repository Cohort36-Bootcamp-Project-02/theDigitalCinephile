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
    refineGallery.innerHTML = '';
    refineSection.innerHTML = '';
    filmApp.filmSearch(userQuery)
  })
}

// Take user input, create ajax request to search for films with the user's input as the title
filmApp.filmSearch = (query) => {
  const userSearch = new URL(`${filmApp.tmdbURL}/search/movie`)
  userSearch.search = new URLSearchParams({
    api_key:filmApp.tmdbApiKey,
    include_adult:false,
    query:query
  })
  fetch(userSearch)
  .then((results) => {
    return results.json();
  })
  .then((data) => {
    filmApp.refineSearch(data.results)
  })
}
// Get data for the film the user entered (ID, title, poster)
filmApp.queryData = (searchResult) => {
  // With my current refineSearch method, I can only grab an item within the film object, not the film object itself.
    // a potential solution might be another ajax request using https://api.themoviedb.org/3/movie/${movieID} endpoint, and grabbing data from that for the results heading
      // aka: instead of using the film object as a param for this method, grab the film's ID# for another ajax request, to grab the specific details (title, poster) & create a the heading. We can still push the same filmID param into the next method
  console.log(searchResult);
  filmApp.filmRec(searchResult.id);
  // Create a heading "Since you enjoy <film title>, you may also like:"
    // Include poster beside as well?
}


  
// Use film's ID# as param in second ajax request to grab recommended films
// In separate method, display recommended film array
filmApp.filmRec = (movieId) => {
  const userRec = new URL(`${filmApp.tmdbURL}/movie/${movieId}/recommendations`)
  userRec.search = new URLSearchParams({
    api_key:filmApp.tmdbApiKey,
  })
  fetch(userRec)
  .then((results) => {
    return results.json();
  })
  .then((reco) => {
    filmApp.resultReco(reco.results)
  })
}
filmApp.resultReco = (resultArray) => {
  const resultGallery = document.createElement('div');
  resultGallery.classList.add('resultGallery');
  resultArray.forEach((rec) =>{
    const {title, poster_path, overview, id} = rec
    const resultContainer = document.createElement('div')
    resultContainer.classList.add('resultContainer');
    resultContainer.innerHTML = `
      <img src="${filmApp.posterBaseURL}${poster_path}" alt="poster of ${title}">
      <div class="resultOverlay">
        <h3>${title}</h3>
        <p>${overview}</p>
      </div>
      `
      resultGallery.appendChild(resultContainer);
  })
  filmApp.results.appendChild(resultGallery);
}


  // each film displays (in a gallery-like presentation):

  

    // film Poster
    // Film Title
    // Plot Summary
      // Button to make another search for recommened films?
        // take ID # of recommended film, use it in same previous ajax request to get a second-level of film recommendations

// call app.init
filmApp.init();