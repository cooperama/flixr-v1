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
            // api_key: '64bbb4feb014546a2feb336e5e661f16',
            // with_genres: "18,36",
            // with_original_language: "en",
            // "vote_average.gte": 7.3,
            // "release_date.gte": 1985,
            // // "with_runtime.gte": req.query.with_runtime_gte,
            // "vote_count.gte": 100,

            api_key: '64bbb4feb014546a2feb336e5e661f16',
            with_genres: req.query.genre_ids,
            with_original_language: req.query.language,
            "vote_average.gte": req.query.vote_average_gte,
            "release_date.gte": req.query.release_date_gte,
            "with_runtime.gte": req.query.with_runtime_gte,
            "vote_count.gte": req.query.vote_count_gte,
        }
    })

    console.log(response.config);


    const context = {
        moviesList: response.data.results,
    }

    console.log(response.data.total_results);
    res.render('movies/recommendations', context);
    }
    catch(err) {
        console.log(err.message);
    }
})


module.exports = router;