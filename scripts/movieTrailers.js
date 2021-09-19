filmApp.filterTrailers = [];

filmApp.getTrailers = (filmID) => {
  // need film's ID # for "Video Endpoint"
  const id = filmID
  // ajax request with /movie/${movieID}/videos endpoint
  const url = new URL(`${filmApp.tmdbURL}/movie/${id}/videos`)
  url.search = new URLSearchParams({
    api_key:filmApp.tmdbApiKey
  })
  fetch(url)
  .then((result) => {
    return result.json();
  })
  .then((data) => {
    console.log(data.results)
      // filter out trailers that aren't Official or less than 720p quality
      // if that new array actually has data in it (length >= 1) -- store that array data
  })
}



