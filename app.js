
// fetch api from volleyballapi and get data by endpoint 
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
  matches_by_date: {url: '/api/volleyball/matches/',
                    GetDate(){
                      return new Date().toLocaleDateString("en-GB")
                    }
  },
  categories: '/api/volleyball/tournament/categories',
  league_seasons: '/api/volleyball/unique-tournament/806/seasons',
  league_teams_standing: '/api/volleyball/unique-tournament/806/season/78004/standings/total'
}

// fetching function 
async function fetchInfo(endpoint) {
  try {
    const response = await fetch(`https://${API_HOST}${endpoint}`, options);
    const data = await response.json();

    console.log(data);

    return data
  } catch (error) {
    console.error('Chyba:', error);
  }
}

// add todays matches
async function getTodaysMatches(){
  const data = await fetchInfo(endpoints.live_matches)

  data.events.forEach(event => {
    const score = event.lastPeriod

    matches.innerHTML += `
      <div id="match_${event.homeTeam.gender}" class="match">
        <h4 class="legue" >${event.tournament.name}</h4>
        <h2 class="game" >${event.homeTeam.name} : ${event.awayTeam.name}</h2>
        <div class="time" >${formatTimestamp(event.startTimestamp)}</div>
        <button class="start_match" onclick="showMatch('${event.homeTeam.name}', '${event.awayTeam.name}', ${event.homeScore[event.lastPeriod]}, ${event.awayScore[event.lastPeriod]}, ${event.status.code})">watch</button>
      </div>`
  });
}

// show match on scoreboard
function showMatch(homeName, awayName, homeScore, awayScore, status){
  const scoreboard = document.querySelector(".scoreboard")

  scoreboard.innerHTML = '';
  scoreboard.innerHTML += `
    <div class="scoreboard__topline">
        <p class="live-badge" ${status == 0 || status == 100 ? 'style="display: none"' : 'style="display: inline-flex"'}>LIVE</p>
        <p class="time" id="current-time">--:--:--</p>
    </div>

    <h1 id="scoreboard-title">Score dashboard</h1>

    <div class="main_scoring" aria-live="polite">
        <article class="team-panel">
          <h4 class="name_home" id="home-name-display">${homeName}</h4>
          <h1 class="score_home" id="home-score">${homeScore}</h1>
        </article>

        <h3 class="team-panel" id="divided" aria-hidden="true">:</h3>

        <article class="team-panel">
            <h4 class="name_away" id="away-name-display">${awayName}</h4>
            <h1 class="score_away" id="away-score">${awayScore}</h1>
        </article>
    </div>
  `

  ShowContent(1);
}
// time in CZ
function formatTimestamp(timestamp) {
  if (typeof timestamp !== "number") {
    return "Neplatný čas";
  }

  return new Date(timestamp * 1000).toLocaleString("cs-CZ", {
    timeZone: "Europe/Prague",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// switching sides
async function ShowContent(num){
  const matches = document.getElementById("matches");

  switch(true){
    case num == 1:
      document.querySelector(".matches").style.display = "none"
      document.querySelector(".scoreboard").style.display = "block"
      break

    default:
      document.querySelector(".matches").style.display = "block";
      document.querySelector(".scoreboard").style.display = "none";   
      break
    
  }
    
}


//start 
getTodaysMatches()


