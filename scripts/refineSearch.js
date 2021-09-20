const refineSection = document.querySelector('.refineSearch')
const refineGallery = document.createElement('div')
refineGallery.classList.add('refineGallery');
filmApp.topResults = [] 


filmApp.refineSearch = (resultArray) => {
  const refineHeader = document.createElement('h2')
  refineHeader.textContent = `Please refine your search by selecting your desired film below:`
  refineSection.prepend(refineHeader)
  // Create array of search results (filter to top 6-8 results)
  filmApp.topResults = resultArray.slice(0,8)
  filmApp.topResults.forEach((film) => {
    if(film.poster_path !== null) {
      const {title, id, poster_path} = film
      // display poster for each result with a button with the title of the film
        const refineContainer = document.createElement('div')
        refineContainer.classList.add('refineContainer');
        refineContainer.innerHTML = `
        <img src="${filmApp.posterBaseURL}${poster_path}" alt="poster of ${title}">
        <button type="submit" class="refineSubmit" value="${id}"> ${title}</button>
        `
        refineGallery.appendChild(refineContainer)
      }
      refineSection.appendChild(refineGallery);
  })
  const refineButtons = document.querySelectorAll('.refineSubmit')
  refineButtons.forEach((refinedQuery) => {
    refinedQuery.addEventListener('click', function() {
      const refinedId = this.value
      refineSection.innerHTML = '';
      filmApp.filmRec(refinedId)
    })
  })
    //Button has value of film's ID#
  // when user clicks the button, calls getQueryData() method & the process continues


  // ****   ALSO    ****
    // create a refineGallery <div> to store the refine search elements
      // each item is stored in a refineContainer <div>
    // Make 'em distribute evenly & responsively with flex-flow
}