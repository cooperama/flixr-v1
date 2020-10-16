const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/recommendations', async (req, res) => {
    console.log('req.query object: ', req.query);
    // Test Data
    // We're making a call to request data from discover/movie
    try {
        let response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: { 
                api_key: '64bbb4feb014546a2feb336e5e661f16',
                with_genres: req.query.genre_ids,
                with_original_language: req.query.language,
                "vote_average.gte": req.query.vote_average_gte,
                "vote_average.lte": req.query.vote_average_lte,
                "release_date.gte": req.query.release_date_gte,
                "release_date.lte": req.query.release_date_lte,
                "with_runtime.gte": req.query.with_runtime_gte,
                "with_runtime.lte": req.query.with_runtime_lte,
                "vote_count.gte": req.query.vote_count_gte,
                include_adult: req.query.include_adult,
            }
        })
        // get first 50 results, shuffle them, send them as context
        const movies = response.data.results.slice(0, 50).filter(movie => {
            if (movie.poster_path) return movie;
        });
        const selectedIndices = [];
        let index;
        while (selectedIndices.length < 10) {
            index = Math.floor(Math.random() * movies.length);
            if (selectedIndices.indexOf(index) === -1) selectedIndices.push(index);
        }
        const chosenMovies = [];
        selectedIndices.forEach(index => {
            chosenMovies.push(movies[index]);
        })
        const context = {
            moviesList: chosenMovies,
        }
        console.log(chosenMovies)
        console.log(response.data.total_results);
        res.render('movies/recommendations', context);
    }
    catch(err) {
        console.log(err.message);
    }
})


module.exports = router;