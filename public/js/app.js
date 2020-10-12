
function createMovieDiv(movieObj) { 
  const movieDiv = document.createElement('div');
  
  movieDiv.appendChild(document.createElement('img')
    .setAttribute('src', imageEndpoint + movieObj.poster_path));
  
  movieDiv.appendChild(document.createElement('h3')
    .innerText = movieObj.title);
  movieDiv.appendChild(document.createElement('p')
    .innerText = movieObj.overview);

  return movieDiv;
}


