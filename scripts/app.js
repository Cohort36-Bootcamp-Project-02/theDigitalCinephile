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
filmApp.queryResult = document.querySelector('.queryResult')
filmApp.results = document.querySelector('.results')
filmApp.trending = document.querySelector('.trending')
filmApp.criteria = document.querySelector("#criteria")

//
filmApp.userCriteria = document.querySelector("#criteria").value;

// app.init
filmApp.init = () => {
  filmApp.userDropDownSelection();
  filmApp.userInput();
  filmApp.getTrending();
}

// User form input => search for a movie
filmApp.userInput = () => {
  filmApp.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userQuery = document.querySelector("input[name=searchFilmTitle]").value
    refineGallery.innerHTML = '';
    refineSection.innerHTML = '';
    filmApp.queryResult.innerHTML = '';
    filmApp.results.innerHTML = '';
    filmApp.filmSearch(userQuery)
  })
}

//adding event listener for TV or Movie selection
filmApp.userDropDownSelection = () => {
  filmApp.criteria.addEventListener('change', (event) => {
    filmApp.userCriteria = document.querySelector("#criteria").value;
  })
}

// Take user input, create ajax request to search for films with the user's input as the title
filmApp.filmSearch = (query) => {
  const userSearch = new URL(`${filmApp.tmdbURL}/search/${filmApp.userCriteria}`)
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
        filmApp.filterSearch(searchResults, query)
    }
  }).catch((error) => {
    const queryError = document.createElement('h4')
    if(error.message === "Unprocessable Entity"){
      queryError.textContent = `Please enter the name of a film and try again!`
      filmApp.results.appendChild(queryError)
    } else if(error.message === "No Results") {
      queryError.textContent = `Sorry! I couldn't find that film! Maybe check the spelling?`
      filmApp.results.appendChild(queryError)
    } else {
      queryError.textContent = `Sorry! Something happened and I don't know what it was! Please try again.`
      filmApp.results.appendChild(queryError)
    }
  })
}

filmApp.filterSearch = (results, userQuery) => {
  if(results[0].title == userQuery || results[1].title == userQuery) {
    const filterQuery = results.filter((film) => {
      const {title, poster_path} = film
      return(title === userQuery && poster_path !== null)
    })
    if(filterQuery.length == 1){
      const queryID = filterQuery[0].id
      filmApp.displayResult(queryID)
    } else {
      filmApp.refineSearch(filterQuery)
    }
  } else {
    filmApp.refineSearch(results)
  }
}
  // send results[0].id to displayResults()


  // send searchResults to refineSearch();
// Get data for the film the user entered (ID, title, poster)
filmApp.queryData = async (movieId) => {
  const filmQuery = new URL(`${filmApp.tmdbURL}/${filmApp.userCriteria}/${movieId}`)
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
  const userRec = new URL(`${filmApp.tmdbURL}/${filmApp.userCriteria}/${movieId}/recommendations`)
  userRec.search = new URLSearchParams({
    api_key:filmApp.tmdbApiKey,
  })
  const recSearch = await fetch(userRec)
  const response = await recSearch.json();
  return response;
}

//Rounding number to 1 decimal
filmApp.getRoundedNum = (num) => {
  const numRounded = (Math.round(num * 10) / 10).toFixed(1);
  return numRounded;
}
filmApp.displayResult = (filmId) => {
  const queryData = filmApp.queryData(filmId);
  queryData.then((film) => {
    const {title, name} = film
    const mediaName = filmApp.getMediaName(title, name);
    const queryTitle = document.createElement('h4')
    queryTitle.textContent = `Since you like ${mediaName}, you may also enjoy:`
    filmApp.queryResult.append(queryTitle)
  })

const getRecs = filmApp.filmRec(filmId);
getRecs.then((recs) => {
    const resultArray = recs.results.filter((films) => {
      return(films.poster_path !== null)
    });
    console.log(resultArray)
  filmApp.display(filmApp.results, resultArray);
  }).catch((error) => {
    const recError = document.createElement('h4')
    if(error.message === "No Recommendations!"){
      recError.textContent = `No Recommendations! Try another film?`
      filmApp.results.appendChild(recError)
    } else {
      recError.textContent = `Sorry! Something happened and I don't know what it was! Please try again.`
      filmApp.results.appendChild(recError)
    }
  })
}


//get API call for trending endpoint
filmApp.getTrending = () => {
  console.log(filmApp.userCriteria)
  const trendingUrl = new URL(`${filmApp.tmdbURL}/trending/${filmApp.userCriteria}/day`)
  trendingUrl.search = new URLSearchParams({
    api_key:filmApp.tmdbApiKey
  });
  fetch(trendingUrl)
  .then((response) =>{
      return response.json();
  })
  .then((data) => {
    const trendingResults = data.results.slice(0, 2)
    filmApp.display(filmApp.trending, trendingResults);
  })
}

// update page load with top trending for the past day

filmApp.getMediaName = (title, name) => {
  let mediaName = "";
  if (filmApp.userCriteria === "movie"){
    mediaName = title
  } else {
    mediaName = name
  }
  return mediaName;
}

filmApp.display = (htmlElement, resultArray) => {
  const resultGallery = document.createElement('div');
  resultGallery.classList.add('resultGallery');
  if(resultArray.length > 0) {
    resultArray.forEach((rec) =>{
      //movie has title property, tv show has the name property.  Using the getMediaName function to pick the right property value.
      const {title, name, poster_path, overview, id, vote_average} = rec
      const resultContainer = document.createElement('div');
      resultContainer.classList.add('resultContainer');
      const overlayElement = document.createElement('div')
      overlayElement.classList.add('resultOverlay')
      const mediaName = filmApp.getMediaName(title, name);
      overlayElement.innerHTML = `
        <a href="${filmApp.tmdbMovieURL}/${id}"><h3>${mediaName}</h3></a>
        <div>
          <p>User Rating:</p>
          <div><span>${filmApp.getRoundedNum(vote_average)}</span></div>
        </div>
        <p>${overview.substring(0,200)}...</p>
        `
      const resImg = document.createElement('img')
      resImg.src = `${filmApp.posterBaseURL}${poster_path}`
      resImg.alt = `poster of $${mediaName}`
        resultContainer.appendChild(resImg)
        resultContainer.appendChild(overlayElement)
        resultGallery.appendChild(resultContainer);
        const trailers = filmApp.getTrailers(id)
        trailers 
        .then((trailer) => {
          if(trailer) {
            const {key} = trailer
            const ytLink = `${filmApp.youtubeURL}?v=${key}`
            const trailerButton = document.createElement('a')
            trailerButton.classList.add('trailerLink')
            trailerButton.href = ytLink
            trailerButton.innerHTML = `
            <button>Watch Trailer</button>
            ` 
            overlayElement.appendChild(trailerButton)
          }
        })    
        const moreRecs = document.createElement('button')
        moreRecs.value = id
        moreRecs.classList.add('moreRecs')
        moreRecs.textContent = `Get More Recommendations!`
        overlayElement.appendChild(moreRecs)
    })
    htmlElement.appendChild(resultGallery);
  
    const recButtons = document.querySelectorAll('.moreRecs')
    recButtons.forEach((button) => {
      button.addEventListener('click', function() {
          recValue = this.value
          filmApp.results.innerHTML = '';
          filmApp.queryResult.innerHTML = '';
          filmApp.displayResult(recValue)
      })
    })
  } else {
    throw new Error("No Recommendations!")
  }
}


// call app.init
filmApp.init();
