
// fetch api from volleyballapi and get data by endpoint 

const API_KEY = import.meta.env.VITE_API_KEY;
const API_HOST = import.meta.env.VITE_API_HOST;


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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Chyba:', error);
    return null;
  }
}

function getScoreValue(scoreObj, fallback = 0) {
  if (!scoreObj || typeof scoreObj !== 'object') return fallback;
  return scoreObj.display ?? scoreObj.current ?? fallback;
}

function createMatchCard(event) {
  const container = document.createElement('div');
  container.className = 'match';
  container.id = `match_${event.homeTeam?.gender || 'unknown'}`;

  const meta = document.createElement('div');
  meta.className = 'match-meta';

  const league = document.createElement('h4');
  league.className = 'legue';
  league.textContent = event.tournament?.name || 'Match';

  const time = document.createElement('div');
  time.className = 'time';
  time.textContent = formatTimestamp(event.startTimestamp);

  meta.append(league, time);

  const game = document.createElement('h2');
  game.className = 'game';
  game.textContent = `${event.homeTeam?.name || 'Unknown'} : ${event.awayTeam?.name || 'Unknown'}`;

  const button = document.createElement('button');
  button.className = 'start_match';
  button.type = 'button';
  button.textContent = 'watch';

  if(event.status.code == 0 || event.status.code == 100){
      button.addEventListener('click', () => {
      const homeName = event.homeTeam?.name || 'Unknown';
      const awayName = event.awayTeam?.name || 'Unknown';
      const homeScore = getScoreValue(event.homeScore);
      const awayScore = getScoreValue(event.awayScore);
      const statusCode = event.status?.code ?? 0;
      const time = event.status.code == 100 ? 'ended' : 'not start yet';


      showMatch(homeName, awayName, homeScore, awayScore, statusCode, time);
      });
  }else{
      button.addEventListener('click', () => {
      const homeName = event.homeTeam?.name || 'Unknown';
      const awayName = event.awayTeam?.name || 'Unknown';
      const homeScore = event.homeScore[event.lastPeriod];
      const awayScore = event.awayScore[event.lastPeriod];
      const statusCode = event.status?.code ?? 0;
      const time = formatTimestamp(event.changes.changeTimestamp);

      showMatch(homeName, awayName, homeScore, awayScore, statusCode, time)
      });    
  }


  container.append(meta, game, button);
  return container;
}

function showEmptyState(container, message = 'There is not any matches') {
  container.innerHTML = '';

  const emptyMessage = document.createElement('p');
  emptyMessage.className = 'empty-state';
  emptyMessage.textContent = message;

  container.appendChild(emptyMessage);
}

// add todays matches
async function getTodaysMatches() {
  const data = await fetchInfo(`${endpoints.matches_by_date.url}${endpoints.matches_by_date.GetDate()}`);
  const matches = document.getElementById('matches');

  if (!matches) return;

  if (!data?.events || data.events.length === 0) {
    showEmptyState(matches);
    return;
  }

  matches.innerHTML = '';

  data.events.forEach(event => {
    matches.appendChild(createMatchCard(event));
  });
}

// add live matches
async function getLiveMatches() {
  const data = await fetchInfo(endpoints.live_matches);
  const live_matches = document.getElementById('live_matches');

  if (!live_matches) return;

  if (!data?.events || data.events.length === 0) {
    showEmptyState(live_matches);
    return;
  }

  live_matches.innerHTML = '';

  data.events.forEach(event => {
    live_matches.appendChild(createMatchCard(event, true));
  });
}

// show match on scoreboard
function showMatch(homeName, awayName, homeScore, awayScore, status, time) {
  const scoreboard = document.querySelector('.scoreboard');

  if (!scoreboard) return;

  scoreboard.innerHTML = `
    <div class="scoreboard__topline">
        <p class="live-badge" style="display: ${status === 0 || status === 100 ? 'none' : 'inline-flex'}">LIVE</p>
        <p class="time" id="current-time">${time}</p>
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
  `;

  showContent(1);
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
function showContent(num) {
  const matchesSection = document.getElementById('matches');
  const liveMatchesSection = document.getElementById('live_matches');
  const scoreboardSection = document.querySelector('.scoreboard');

  if (!matchesSection || !liveMatchesSection || !scoreboardSection) return;

  switch (num) {
    case 1:
      matchesSection.style.display = 'none';
      scoreboardSection.style.display = 'block';
      liveMatchesSection.style.display = 'none';
      break;
    case 2:
      matchesSection.style.display = 'none';
      scoreboardSection.style.display = 'none';
      liveMatchesSection.style.display = 'block';
      break;
    case 0:
    default:
      matchesSection.style.display = 'block';
      scoreboardSection.style.display = 'none';
      liveMatchesSection.style.display = 'none';
      break;
  }
}

window.showContent = showContent;
window.ShowContent = showContent;

function initNavigation() {
  document.querySelectorAll('.nav-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const target = Number(button.dataset.target ?? 0);
      showContent(target);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
});

//start 
getTodaysMatches();
getLiveMatches();
showContent(0);


