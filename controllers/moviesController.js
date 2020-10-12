const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/recommendations', async (req, res) => {
    // Test Data
    // We're making a call to request data from discover/movie
    try {
    let response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: { 
            api_key: '64bbb4feb014546a2feb336e5e661f16',
            with_genres: req.query.genre_ids,
            with_original_language: req.query.language,
            "vote_average.gte": req.query.vote_average_gte,
            "release_date.gte": req.query.release_date_gte,
            "with_runtime.gte": req.query.with_runtime_gte,
            "vote_count.gte": req.query.vote_count_gte,
        }
    })

    const context = {
        moviesList: response.data.results,
        imageEndpoint: 'https://image.tmdb.org/t/p/w500'
    }

    res.render('movies/recommendations', context);

    console.log(response.data);
    return res.status(200).json(response.data)
}
    catch(err) {
        console.log(err.message);
    }
})

// router.get('/recommendations', async (req, res) => {
//     try {
//         let imageResponse = await axios.get('https://image.tmdb.org/t/p/w500', {
//             params: {
//                 api_key: '64bbb4feb014546a2feb336e5e661f16',
//                 poster_path: req.query.poster_path,
//             }
//         })
//         return res.status(200).json(response.data);
//     }

//     catch(err) {
//         console.log(err.message);
//     }
// })

module.exports = router;