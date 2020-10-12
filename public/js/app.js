// const { delete } = require("../../controllers/moviesController");

const genreCount = {
  28: 0,
  12: 0,
  16: 0,
  35: 0,
  80: 0,
  99: 0,
  18: 0,
  10751: 0,
  14: 0,
  36: 0,
  27: 0,
  10402: 0,
  9648: 0,
  10749: 0,
  878: 0,
  10770: 0,
  53: 0,
  10752: 0,
  37: 0,
};

const genreIncrementCount = {
  childhood: {
    12: 4,
    16: 5,
    35: 2,
    10751: 4,
    14: 3,
    10402: 3,
    9648: 2,
    878: 3,
    10770: 2,
    37: 4,
  },
  adulthood: {
    28: 3,
    80: 5,
    99: 3,
    18: 3,
    36: 4,
    27: 3,
    10749: 3,
    53: 2,
    10752: 3,
  },
  "ask permission": {
    16: 4,
    18: 4,
    10751: 5,
    14: 2,
    10402: 4,
    10749: 2,
    10770: 3,
  },
  "ask forgiveness": {
    28: 5,
    12: 5,
    35: 3,
    80: 3,
    99: 1,
    27: 5,
    9648: 3,
    878: 4,
    53: 5,
    10752: 2,
    37: 2,
  },
  sandwich: {
    16: 3,
    35: 4,
    99: 3,
    10751: 3,
    14: 1,
    10402: 2,
    10770: 4,
    10752: 1,
  },
  spaghetti: {
    28: 2,
    12: 1,
    80: 4,
    18: 1,
    36: 3,
    27: 2,
    9648: 5,
    10749: 1,
    878: 1,
    53: 4,
    37: 5,
  },
  air: {
    28: 1,
    12: 2,
    16: 2,
    35: 5,
    10751: 2,
    14: 5,
    10402: 5,
    10749: 4,
    878: 5,
  },
  earth: {
    80: 1,
    99: 5,
    18: 2,
    36: 5,
    27: 1,
    9648: 4,
    10770: 1,
    53: 1,
    10752: 5,
    37: 1,
  },
  blue: {
    16: 1,
    35: 1,
    80: 2,
    99: 4,
    18: 5,
    10751: 1,
    36: 1,
    10402: 1,
    10770: 5,
  },
  red: {
    28: 4,
    12: 3,
    14: 4,
    27: 4,
    9648: 1,
    10749: 5,
    878: 2,
    53: 3,
    10752: 4,
    37: 3,
  },
}

const comparisonOptions = [
  ['New York', 'Seoul'], // language
  ['Bangkok', 'Las Vegas'], // language
  ['London', 'Paris'], // language
  ['iguana', 'dolphin'], // rating
  ['dine-in', 'take-out'], // runtime
  ['awkward', 'witty'], // vote average
  ['breakfast', 'brunch'], // release date
  ['childhood', 'adulthood'],
  ['ask permission', 'ask forgiveness'],
  ['sandwich', 'spaghetti'],
  ['air', 'earth'],
  ['blue', 'red'], 
  ['camping', 'skiing'], // vote count
  // ['dragon', 'spaceship'],
  // ['present', 'future'],
  // ['vacation', 'staycation'],
  // ['vacation', 'staycation'],
];

function randomIndexGenerator(arr) {
  return Math.floor(Math.random() * arr.length);
}

function generateQuestionnaire() {
  const indices = [];
  const questionsArr = [];

  for (let i = 0; i < 10; i++) {
    let index = randomIndexGenerator(comparisonOptions);
    while (indices.includes(index)) {
      index = randomIndexGenerator(comparisonOptions);
    }
    indices.push(index);
    const options = comparisonOptions[index];
    if (Math.random() > 0.5) {
      [options[0], options[1]] = [options[1], options[0]];
    }
    
    const questionEl = document.createElement('div')
    questionEl.classList.add('options-div');

    options.forEach((option, i) => {
      const choice = document.createElement('button')
      choice.innerText = options[i];
      questionEl.appendChild(choice);
    })
    questionsArr.push(questionEl);
  }
  return questionsArr;
}

function incrementGenre(choice) {
  const genresToInc = Object.keys(genreIncrementCount[choice]);
  genresToInc.forEach(genre => {
    genreCount[genre] += genreIncrementCount[choice][genre];
  })
}

function getTopGenres(genreCountObj) {
  let paramString = [];
  // sort genres descending order and get first two
  // https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
  const sortedGenres = [];
  for (genre in genreCountObj) {
    sortedGenres.push([genre, genreCountObj[genre]]);
  }
  sortedGenres.sort((a, b) => b[1] - a[1]);
  paramString.push(sortedGenres[0][0], sortedGenres[1][0])

  return paramString.join(',');
}

function addQueryParams(choice) {
  switch (choice) {
    case 'Las Vegas':
    case 'London':
    case 'New York':
      queryParams.with_original_language = 'en';
      break;
    case 'Paris':
    case 'Bangkok':
    case 'Seoul':
      delete queryParams.with_original_language;
      break;
    case 'dolphin':
      queryParams["vote_average.gte"] = 7.3;
      break;
    case 'dine-in':
      queryParams["with_runtime.gte"] = 90;
      break;
    case 'brunch':
      queryParams["release_date.gte"] = 1985;
      break;
    case 'skiing':
      queryParams["vote_count.gte"] = 100
      break;
  }
  return queryParams;
}



// -------------- Event Listeners
const quizletEl = document.querySelector('.quizlet');
const startQuizBtn = document.querySelector('.start-quiz');
const genreIdsArr = Object.keys(genreCount);

let questionsArr;
let questionIndex = 0;
let queryParams = {};


startQuizBtn.addEventListener('click', (e) => {
  questionsArr = generateQuestionnaire();
  quizletEl.appendChild(questionsArr[questionIndex]);
  startQuizBtn.remove();
})


quizletEl.addEventListener('click', (e) => {
  const genre = e.target.innerText;
  if (genreIncrementCount.hasOwnProperty(genre)) {
    incrementGenre(genre);
  } else {
    addQueryParams(genre);
  }

  if (questionIndex === questionsArr.length - 1) {
    queryParams.with_genres = getTopGenres(genreCount)
    let queryParamString = queryParams;

    genreIdsArr.forEach(genre => genreCount[genre] = 0)
    questionIndex = 0;
    queryParams = {};

    // ---------------- 

    console.log('queryParamString: ', queryParamString)

    // ----------------

  } else {
    questionIndex++;
    quizletEl.appendChild(questionsArr[questionIndex]);
  }
  document.querySelector('.options-div').remove();
})




