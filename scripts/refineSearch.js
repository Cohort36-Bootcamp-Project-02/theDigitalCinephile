const refineGallery = document.querySelector('.refineGallery')
filmApp.topResults = [] 


filmApp.refineSearch = (resultArray) => {
  // Create array of search results (filter to top 6-8 results)
  filmApp.topResults = resultArray.slice(0,8)
  filmApp.topResults.forEach((film) => {
    if(film.poster_path !== null) {
      // for Each film, get:
        // Title of film
        // film's ID #
        // film's poster
      const refineTitle = film.title;
      const refineID = film.id;
      const refinePoster = `${filmApp.posterBaseURL}${film.poster_path}`
      // display poster for each result with a button with the title of the film
        const refineContainer = document.createElement('div')
        refineContainer.className = 'refineContainer'
        refineContainer.innerHTML = `
        <img src="${refinePoster}" alt="poster fof ${refineTitle}">
        <button type="submit" class="refineSubmit" value="${refineID}"> ${refineTitle}</button>
        `
        refineGallery.appendChild(refineContainer)
    }
  })
  const refineButtons = document.querySelectorAll('.refineSubmit')
  refineButtons.forEach((refinedQuery) => {
    refinedQuery.addEventListener('click', function() {
      const refinedQuery = this.value
      console.log(refinedQuery)
    })
  })
    //Button has value of film's ID#
  // when user clicks the button, calls getQueryData() method & the process continues


  // ****   ALSO    ****
    // create a refineGallery <div> to store the refine search elements
      // each item is stored in a refineContainer <div>
    // Make 'em distribute evenly & responsively with flex-flow
}