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
            "vote_average.lte": req.query.vote_average_lte,
            "vote_average.gte": req.query.vote_average_gte,
            "vote_count.gte": 1000,
            with_original_language: req.query.language,
            "release_date.lte": req.query.release_date_lte,
            "release_date.gte": req.query.release_date_gte
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