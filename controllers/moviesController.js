const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/recommendations', async (req, res) => {
    // Test Data
    // We're making a call to request data from discover/movie
    try {
    let response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
            // ?????????????? Do we not need to keep the key secret? Like in the .env file?
            api_key: '64bbb4feb014546a2feb336e5e661f16',
            with_genres: req.query.genre_ids,
            with_original_language: req.query.language,
            "vote_average.gte": req.query.vote_average_gte,
            "release_date.gte": req.query.release_date_gte,
            "with_runtime.gte": req.query.with_runtime_gte
            // "vote_average.lte": req.query.vote_average_lte,
            // "vote_count.gte": 1000,
            // "release_date.lte": req.query.release_date_lte,
        }
    })
    console.log(response.data);
    return res.status(200).json(response.data)
}
    catch(err) {
        console.log(err.message);
    }
})

module.exports = router;