//--------------------------------------------------------------
// Muldoon Graphing Page constants for UI input elements.
//--------------------------------------------------------------
const sol = document.getElementById('sol');
const solLabel = document.getElementById('solLabel');
const startTime = document.getElementById('startTime');
const endTime = document.getElementById('endTime');
const myChart = document.getElementById('graph');
const plotGraphBtn = document.getElementById('plotGraphBtn');

//--------------------------------------------------------------
// Mars Sol length: 24h 39m 35.244s
// Perseverance (rover) landed 2021-02-18 20:55 UTC
//--------------------------------------------------------------
function setMaxSol(sol, solLabel) {
  const MILLIS_IN_MARS_SOL = 88775244;
  const MISSION_START_DATE = new Date('2021-02-19T00:00:00');
  const MISSION_START_MILLIS = MISSION_START_DATE.getTime();
  const CURRENT_MISSION_SOL = Math.ceil((Date.now() - MISSION_START_MILLIS) / MILLIS_IN_MARS_SOL);

  sol.max = CURRENT_MISSION_SOL;
  solLabel.innerHTML = "Sol (1-" + CURRENT_MISSION_SOL + "):";
}

document.addEventListener("DOMContentLoaded", () => {
    setMaxSol(sol, solLabel);
});