const mainPictureContainer = document.querySelector('#main-picture');
const previousPicturesContainer = document.querySelector('#previous-pictures');
const myChart = document.querySelector('#my-chart');

const API_KEY = 'gqcyTNAPWMzJfKNabSIXbq9xCqyBHKx1nFwHffvs';

let marsWeatherDataUrl = 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json'

async function fetchCuriosityData() {
  let response = await fetch(marsWeatherDataUrl);
  let data = await response.json();
  let marsData = data.soles;
  // console.log(marsData);
  let {solArray, minTempArray, maxTempArray} = extractWeatherData(marsData, 50);
  // console.log(solArray)
  // console.log(minTempArray)
  // console.log(maxTempArray)
  
  // per il grafico mi serviranno: temp. max. / temp. min. e numero giorno (sol)

  new Chart(myChart, {
    type: 'line',
    data: {
      labels: solArray,
      datasets: [
        {
          label: 'max temp',
          data: maxTempArray,
          borderWidth: 2
        },
        {
          label: 'min temp',
          data: minTempArray,
          borderWidth: 2
        },
      ]
    },
    options: {
      scales: {
        y: {
        }
      }
    }
  });
  
}

fetchCuriosityData()

function extractWeatherData(soles, solesNum) {
  // let newArray = []
  let solArray = [];
  let minTempArray = [];
  let maxTempArray = [];
  // estrapolo i primi 100
  for(let i = 0; i < solesNum; i++) {
    // newArray.push({
    //   min_temp: soles[i].min_temp,
    //   max_temp: soles[i].max_temp,
    //   sol: soles[i].sol
    // })
    solArray.push(soles[i].sol)
    minTempArray.push(soles[i].min_temp)
    maxTempArray.push(soles[i].max_temp)
  }

  solArray.reverse()
  minTempArray.reverse()
  maxTempArray.reverse()
  // newArray.reverse();
  
  return {
    solArray,
    minTempArray,
    maxTempArray
  }
  // return newArray
}



let today = new Date();
// console.log(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)

function convertDaysInMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

function createFormattedDate(milliseconds) {
  // ritorna il formato AAAA-MM-GG
  let date = new Date(milliseconds);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

// converto la data di oggi in millisecondi
let todayMilliseconds = Date.now();
// calcolo quanti millisecondi ci sono in 12 giorni
let millisecondsInTenDays = convertDaysInMilliseconds(12);
// sottraggo quel numero alla data di oggi
let startingDateInMilliseconds = todayMilliseconds - millisecondsInTenDays;
// ho ottenuto la data di 10 giorni fa espressa in millisecondi
let startDate = createFormattedDate(startingDateInMilliseconds);
let endDate = createFormattedDate(todayMilliseconds); // data odierna 

// fetch con data specifica
fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&thumbs=true&start_date=${startDate}&end_date=${endDate}`)
  .then(response => response.json())
  .then(pictures => {
    let reservedPictures = [...pictures].reverse();
    // console.log(reservedPictures);
    let mainPicture = pictures[0];
    let previousPictures = reservedPictures.slice(1);
    showMainPicture(mainPicture);
    showPreviousPictures(previousPictures);
  })

// fetch per range di date
// fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&thumbs=true&start_date=2024-01-15&end_date=2024-01-30`)
//   .then(response => response.json())
//   .then(data => console.log(data))

function showMainPicture(picture) {
  mainPictureContainer.innerHTML = `
    <h3>${picture.title}</h3>
    <img class="main-img" src="${picture.url}"/>
    <p>${picture.explanation}</p>
  `
  // let myImg = document.createElement('img');
  // myImg.classList.add('main-img');
  // myImg.src = `${image}`;
  // mainPictureContainer.append(myImg);
}

function showPreviousPictures(pictures) {
  // svuoto il contenitore
  previousPicturesContainer.innerHTML = '';
  // codice per mostrarle nel DOM
  pictures.forEach(picture => {
    // console.log(picture)
    // per ogni foto, creo un <div> con dentro <img />
    let pictureContainer = document.createElement('div');
    pictureContainer.innerHTML = `
      <img src="${picture.url}"/>
    `
    previousPicturesContainer.append(pictureContainer)
  })
  // for(let picture of pictures) {
  //   console.log(picture)
  // }
}