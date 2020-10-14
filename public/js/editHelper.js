// -------------- Edit Playlist Functions

function updatePlaylistMovies() {
  let movieChoices = '';
  const movieIdInputs = document.querySelectorAll('.movie-id-checkbox');
  // push checked movies into array
  movieIdInputs.forEach(input => {
    let movieId = input.getAttribute('name');
    if (input.checked) {
      movieChoices += movieId + ',';
    }
  })
  // set value of movie choices input to checked movies
  const moviesToUpdate = document.getElementById('movie-choices');
  moviesToUpdate.setAttribute('value', movieChoices)
  console.log('movie choices: ', movieChoices)
}
