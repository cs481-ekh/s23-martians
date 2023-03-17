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

//--------------------------------------------------------------
// Initialize an Object with available MEDA data CSV file
//--------------------------------------------------------------
const medaInvURL = "https://sdp.boisestate.edu/pds/data/PDS4/Mars2020/mars2020_meda/data_derived_env/collection_meda_data_derived_env_inventory.csv";

const medaFiles = function() {
  d3.text(medaInvURL).then(function(data) {
    d3.csvParseRows(data, (d, i) => {
      let rowData = d[1].split(/[:]+/);
      let revision = rowData[6].replace(/\.\d$/, '');
      let fName = rowData[5] + revision + ".csv";
      let id = fName.match(/\d{4}/);
      let sensor_id = (rowData[5].match(/(ancillary|ps|rhs|tirs|ws)/i))[0];
      
      console.log("id: " + id + " filename: " + fName.toUpperCase() + " revision: " + revision + " sensor_id: " + sensor_id.toUpperCase());
    });
  });
}

medaFiles();