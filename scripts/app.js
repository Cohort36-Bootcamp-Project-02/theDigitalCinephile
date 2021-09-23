// Global filmApp object (store all Methods/variables/etc.)
const filmApp = {}

// API properties
filmApp.tmdbMovieURL = `https://www.themoviedb.org/movie`
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
    filmApp.results.innerHTML = '';
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
    if(results.ok) {
      return results.json();
    } else {
      throw new Error(results.statusText)
    }
  })
  .then((data) => {
    const searchResults = data.results
    if(searchResults.length === 0){
      throw new Error("No Results")
    } else {
      filmApp.refineSearch(searchResults)
    }
  }).catch((error) => {
    console.log(error)
    const queryError = document.createElement('h4')
    if(error = "Unprocessable Entity"){
      queryError.textContent = `Please enter the name of a film and try again!`
      filmApp.results.appendChild(queryError)
    } else if(error = "No Results") {
      queryError.textContent = `Sorry! I couldn't find that film! Maybe check the spelling?`
    } else {
      queryError.textContent = `Sorry! Something happened and I don't know what it was! Please try again.`
    }
  })
}
// Get data for the film the user entered (ID, title, poster)
filmApp.queryData = async (movieId) => {
  const filmQuery = new URL(`${filmApp.tmdbURL}/movie/${movieId}`)
  filmQuery.search = new URLSearchParams({
    api_key:filmApp.tmdbApiKey,
  })
  const filmInfo = await fetch(filmQuery)
    const response = await filmInfo.json();
    return response;
}


// Use film's ID# as param in second ajax request to grab recommended films
// In separate method, display recommended film array
filmApp.filmRec = async (movieId) => {
  const userRec = new URL(`${filmApp.tmdbURL}/movie/${movieId}/recommendations`)
  userRec.search = new URLSearchParams({
    api_key:filmApp.tmdbApiKey,
  })
  const recSearch = await fetch(userRec)
    const response = await recSearch.json();
    return response;
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

        <p>${overview}</p>
      </div>
      `
      resultGallery.appendChild(resultContainer);
  })
  filmApp.results.appendChild(resultGallery);
}


  // each film displays (in a gallery-like presentation):

filmApp.displayResult = (filmId) => {
  const queryData = filmApp.queryData(filmId);
  queryData.then((film) => {
    const {title, poster_path} = film
    
    // Since you like {title}, you may also like:
    //styling/DOM manipulation
  })
const getRecs = filmApp.filmRec(filmId);
getRecs.then((recs) => {
    const resultArray = recs.results;
    const resultGallery = document.createElement('div');
    resultGallery.classList.add('resultGallery');
    if(resultArray.length > 0) {
      resultArray.forEach((rec) =>{
        const {title, poster_path, overview, id} = rec
        const resultContainer = document.createElement('div');
        resultContainer.classList.add('resultContainer');
        const overlayElement = document.createElement('div')
        overlayElement.classList.add('resultOverlay')
        overlayElement.innerHTML = `
        <a href="${filmApp.tmdbMovieURL}/${id}"><h3>${title}</h3></a>
        <p>${overview.substring(0,200)}...</p>
        `
        const resImg = document.createElement('img')
        resImg.src = `${filmApp.posterBaseURL}${poster_path}`
        resImg.alt = `poster of ${title}`
          resultContainer.appendChild(resImg)
          resultContainer.appendChild(overlayElement)
          resultGallery.appendChild(resultContainer);
          const trailers = filmApp.getTrailers(id)
          trailers 
          .then((trailer) => {
            if(trailer) {
              const {key} = trailer
              const ytLink = `${filmApp.youtubeURL}?v=${key}`
              const trailerButton = document.createElement('button')
              trailerButton.innerHTML = `<a href="${ytLink}"> Watch Trailer! </a>`
              overlayElement.appendChild(trailerButton)
            }
          })    
          const moreRecs = document.createElement('button')
          moreRecs.value = id
          moreRecs.classList.add('moreRecs')
          moreRecs.textContent = `More Recommendations!`
          overlayElement.appendChild(moreRecs)
      })
      filmApp.results.appendChild(resultGallery);
    
      const recButtons = document.querySelectorAll('.moreRecs')
      recButtons.forEach((button) => {
        button.addEventListener('click', function() {
            recValue = this.value
            filmApp.results.innerHTML = '';
            filmApp.displayResult(recValue)
        })
      })
    } else {
      throw new Error("No Recommendations!")
    }
}).catch((error) => {
  const recError = document.createElement('h4')
  recError.textContent = `No Recommendations! Try another film?`
  filmApp.results.appendChild(recError)
})
}

    // film Poster
    // Film Title
    // Plot Summary
      // Button to make another search for recommened films?
        // take ID # of recommended film, use it in same previous ajax request to get a second-level of film recommendations

// call app.init
filmApp.init();