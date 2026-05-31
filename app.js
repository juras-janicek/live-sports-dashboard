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


const endpoints = {
  live_matches: '/api/volleyball/matches/live',
  categories: '/api/volleyball/tournament/categories',
  league_seasons: '/api/volleyball/unique-tournament/806/seasons',
  league_teams_standing: '/api/volleyball/unique-tournament/806/season/78004/standings/total'
}


async function fetchInfo(endpoint) {
  try {
    const response = await fetch(`https://${API_HOST}${endpoint}`, options);
    const data = await response.json();

    console.log(data); 
  } catch (error) {
    console.error('Chyba:', error);
  }
}


fetchInfo (endpoints.league_teams_standing);