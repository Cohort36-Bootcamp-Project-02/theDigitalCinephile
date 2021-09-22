filmApp.filterTrailers = [];

filmApp.findTrailers = async (filmID) => {
  // need film's ID # for "Video Endpoint"
  const id = filmID
  // ajax request with /movie/${movieID}/videos endpoint
  const url = new URL(`${filmApp.tmdbURL}/movie/${id}/videos`)
  url.search = new URLSearchParams({
    api_key:filmApp.tmdbApiKey
  })
  const response = await fetch(url)
  const findTrailers = await response.json();
  return findTrailers
}

filmApp.getTrailers = async (id) => {
  const trailerSearch = filmApp.findTrailers(id)
  const trailers = await trailerSearch
  .then((res) => {
    const trailerArray = res.results
    filmApp.filterTrailers = trailerArray.filter((trailer) => {
      const {type} = trailer
      return (type == "Trailer" || type == "trailer")
    })
    return filmApp.random(filmApp.filterTrailers)
  })
  return trailers
}

filmApp.random = (array) => {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

