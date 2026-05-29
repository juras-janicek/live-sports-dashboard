// app.js - úplný základ

const API_KEY = '66ec0d1e4bmsh3643c7487adb1cbp1a7cd5jsnf7e1b531f6e2';
const API_HOST = 'volleyballapi.p.rapidapi.com';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST,

  }
};

// Funkce která zavolá API a vypíše data do konzole
async function fetchLeagues() {
  try {
    const response = await fetch(
      'https://volleyballapi.p.rapidapi.com/api/volleyball/matches/live',
      options
    );
    const data = await response.json();
    console.log(data); // zatím jen vypiš - chceme vidět strukturu
  } catch (error) {
    console.error('Chyba:', error);
  }
}

// Spusť funkci
fetchLeagues();