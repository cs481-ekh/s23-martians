//--------------------------------------------------------------
// Mars Sol length: 24h 39m 35.244s
// Perseverance (rover) landed 2021-02-18 20:55 UTC
//--------------------------------------------------------------
const MILLIS_IN_MARS_SOL = 88775244;
const MISSION_START_DATE = new Date('2021-02-19T00:00:00');
const MISSION_START_MILLIS = MISSION_START_DATE.getTime();
const CURRENT_MISSION_SOL = Math.ceil((Date.now() - MISSION_START_MILLIS) / MILLIS_IN_MARS_SOL);

//--------------------------------------------------------------
// Muldoon Graphing Page constants for UI input elements.
//--------------------------------------------------------------
const uiMsg = document.getElementById('uiMsg');
const sol = document.getElementById('sol');
const solLabel = document.getElementById('solLabel');
const startTime = document.getElementById('startTime');
const endTime = document.getElementById('endTime');
const sensor = document.getElementById('sensor');
const plotGraphBtn = document.getElementById('plotGraphBtn');
const myChart = document.getElementById('graph');
const exportUrlBtn = document.getElementById('exportUrlBtn');
const downloadCsvBtn = document.getElementById('downloadCsvBtn');
const urlDisplay = document.getElementById('urlDisplay');
const medaFileList = [];

document.addEventListener("DOMContentLoaded", () => {
  //--------------------------------------------------------------
  // Initialize an Object with available MEDA data CSV file
  //--------------------------------------------------------------
  let medaDerivedInvURL = "https://sdp.boisestate.edu/pds/data/PDS4/Mars2020/mars2020_meda/data_derived_env/collection_meda_data_derived_env_inventory.csv";
  let medaCalibratedInvURL = "https://sdp.boisestate.edu/pds/data/PDS4/Mars2020/mars2020_meda/data_calibrated_env/collection_meda_data_calibrated_env_inventory.csv";

  d3.text(medaDerivedInvURL).then(function(data) {
    d3.csvParseRows(data, (d, i) => {
      let rowData = d[1].split(/[:]+/);
      let revision = rowData[6].replace(/\.\d$/, '');
      let fileName = (rowData[5] + revision.padStart(2, '0') + ".csv").toUpperCase();
      let fileId = Number.parseInt(fileName.match(/\d{4}/));
      let sensorName = ((rowData[5].match(/(ancillary|ps|rhs|tirs|ws)/i))[0]).toUpperCase();

      if (fileId !== NaN) {
        let parentDir = getParentDir(fileId);

        sol.max = Math.max(fileId, sol.max);

        if (parentDir !== undefined) {
          let fileDir = "sol_" + fileName.match(/\d{4}/);

          let medaFile = {
            id: fileId,
            collection: 'data_derived_env',
            parent: parentDir,
            directory: fileDir,
            filename: fileName,
            revision: revision,
            sensor: sensorName,
            xField: 'LTST',
            yField: setYField(sensorName)
          }

          medaFileList.push(medaFile);
        }
        else {
          console.log("Failed to get location for fileId: " + fileId + " filename: " + filename + " revision: " + revision + " sensor: " + sensorName);
        }
      }
    });

    solLabel.innerHTML = "Select Sol (1 - " + sol.max + "):";

    if (sol.max !== CURRENT_MISSION_SOL) {
      uiMsg.innerHTML = "(note: current mission Sol is " + CURRENT_MISSION_SOL + " w/ MEDA data available up to Sol " + sol.max + ")";
      uiMsg.hidden = false;
    }
  });

  d3.text(medaCalibratedInvURL).then(function(data) {
    d3.csvParseRows(data, (d, i) => {
      let rowData = d[1].split(/[:]+/);
      let revision = rowData[6].replace(/\.\d$/, '');
      let fileName = (rowData[5] + revision.padStart(2, '0') + ".csv").toUpperCase();
      let fileId = Number.parseInt(fileName.match(/\d{4}/));
      let sensorName = ((rowData[5].match(/(ats|eng|ps|rds|rhs|tirs|ws)/i))[0]).toUpperCase();

      if (fileId !== NaN) {
        let parentDir = getParentDir(fileId);

        sol.max = Math.max(fileId, sol.max);

        if (parentDir !== undefined) {
          let fileDir = "sol_" + fileName.match(/\d{4}/);

          let medaFile = {
            id: fileId,
            collection: 'data_calibrated_env',
            parent: parentDir,
            directory: fileDir,
            filename: fileName,
            revision: revision,
            sensor: sensorName,
            xField: 'LTST',
            yField: setYField(sensorName)
          }

          medaFileList.push(medaFile);
        }
        else {
          console.log("Failed to get location for fileId: " + fileId + " filename: " + filename + " revision: " + revision + " sensor: " + sensorName);
        }
      }
    });

    solLabel.innerHTML = "Select Sol (1 - " + sol.max + "):";

    if (sol.max !== CURRENT_MISSION_SOL) {
      uiMsg.innerHTML = "(note: current mission Sol is " + CURRENT_MISSION_SOL + " w/ MEDA data available up to Sol " + sol.max + ")";
      uiMsg.hidden = false;
    }
  });
});

function getParentDir(num) {
  if (num <= 89) {
    return 'sol_0000_0089';
  }
  else if (num <= 179) {
    return 'sol_0090_0179';
  }
  else if (num <= 299) {
    return 'sol_0180_0299';
  }
  else if (num <= 419) {
    return 'sol_0300_0419';
  }
  else if (num <= 539) {
    return 'sol_0420_0539';
  }

  return;
}

function setYField(str) {
  switch (str) {
    case "PS":
      return ["PRESSURE"];
    case "WS":
      return ["HORIZONTAL_WIND_SPEED", "WIND_SPEED_DIRECTION"];
    case "ATS":
      return ["ATS_LOCAL_TEMP1", "ATS_LOCAL_TEMP2", "ATS_LOCAL_TEMP3", "ATS_LOCAL_TEMP4", "ATS_LOCAL_TEMP5"];
    default:
      return;
  }
}