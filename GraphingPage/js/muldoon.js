function setMaxSol(sol, solLabel) {
  // Mars Sol length: 24h 39m 35.244s
  // Perseverance (rover) landed 2021-02-18 20:55 UTC
  const MILLIS_IN_MARS_SOL = 88775244;
  const MISSION_START_DATE = new Date('2021-02-19T00:00:00');
  const MISSION_START_MILLIS = MISSION_START_DATE.getTime();
  const CURRENT_MISSION_SOL = Math.ceil((Date.now() - MISSION_START_MILLIS) / MILLIS_IN_MARS_SOL);

  sol.max = CURRENT_MISSION_SOL;
  solLabel.innerHTML = "Sol (1-" + CURRENT_MISSION_SOL + "):";
}

const sol = document.querySelector('#sol');
const solLabel = document.querySelector('#solLabel');

setMaxSol(sol, solLabel);