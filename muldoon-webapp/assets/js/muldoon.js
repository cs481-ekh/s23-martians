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
const endTime = document.getElementById('endTime');
const exportDataBtn = document.getElementById('exportDataBtn');
const generatePlotBtn = document.getElementById('generatePlotBtn');
const myModal = new bootstrap.Modal(document.getElementById('plotModal'));
const myModalTitle = document.getElementById('plotModalTitle');
const myModalMsg = document.getElementById('plotModalMsg');
const myPlot = document.getElementById('graph');
const processLevel = document.getElementById('processLevel');
const sensor = document.getElementById('sensor');
const sensorAttr = document.getElementById('sensorAttr');
const shareURLBtn = document.getElementById('shareURLBtn');
const sol = document.getElementById('sol');
const solHelp = document.getElementById('solHelp');
const startTime = document.getElementById('startTime');

const medaDataConfig = [];
const medaFileList = [];

//--------------------------------------------------------------
// Muldoon MEDA Data JSON
//--------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  //--------------------------------------------------------------
  // Initialize an Object with available MEDA data specification
  // attributes.
  //--------------------------------------------------------------
  let medaDataConfigCSV = "assets/config/meda-data-config.csv";

  d3.text(medaDataConfigCSV).then(function(data) {
    d3.csvParse(data, (d, i) => {
      medaDataConfig.push(d);
    });
    
    populateProcessLevelList();
  });

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
          }

          medaFileList.push(medaFile);
        }
        else {
          let errMsg = "Failed to get location for fileId: " + fileId + " filename: " + fileName + " revision: " + revision + " sensor: " + sensorName;
          // console.log(errMsg);
        }
      }
    });

    if (sol.max !== CURRENT_MISSION_SOL) {
      solHelp.innerHTML = "MEDA data available up to Sol " + sol.max;
      solHelp.hidden = false;
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
          }

          medaFileList.push(medaFile);
        }
        else {
          let errMsg = "Failed to get location for fileId: " + fileId + " filename: " + fileName + " revision: " + revision + " sensor: " + sensorName;
          // console.log(errMsg);
        }
      }
    });

    if (sol.max !== CURRENT_MISSION_SOL) {
      solHelp.innerHTML = "MEDA data available up to Sol " + sol.max;
      solHelp.hidden = false;
    }
  });

  if (window.location.search !== "") {
    let params = new URLSearchParams(window.location.search);

    sol.value = params.get('sol');
    startTime.value = params.get('start');
    endTime.value = params.get('end');
    processLevel.selectedIndex = params.get('processLevel');
    sensor.selectedIndex = params.get('sensor');
    sensorAttr.selectedIndex = params.get('sensorAttr');

    setTimeout(() => {
      generatePlotBtn.click();
    }, 500);
  }
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
  else if (num <= 539) {
    return 'sol_0540_0659';
  }

  return;
}

// This function populates the 'Process Level' options.
const populateProcessLevelList = function() {
  generatePlotBtn.disabled = true;

  let processLevelList = medaDataConfig.filter(function (d) {
    let key = d.Product_Type;

    if (!this[key]) {
      this[key] = true;
      return true;
    }
  }, Object.create(null));

  let htmlOptions = [];

  processLevelList.sort((a, b) => (a.Product_Type > b.Product_Type) ? 1 : -1);

  for (const item of processLevelList) {
    let html = `<option value="${item.Product_Type}">${item.Processing_Level}</option>`;

    htmlOptions.push(html);
  }

  processLevel.innerHTML = htmlOptions.join("");
  processLevel.selectedIndex = 0;

  populateSensorList();
}

// This function populates the 'Sensor ID' options
// based on the selected 'Process Level'.
const populateSensorList = function() {
  generatePlotBtn.disabled = true;

  let sensorList = medaDataConfig.filter(function (d) {
    let key = d.Product_Subtype;

    if (d.Product_Type === processLevel.value) {
      if (!this[key]) {
        this[key] = true;
        return true;
      }
    }
  }, Object.create(null));

  sensorList.sort((a, b) => (a.Product_Subtype_Desc > b.Product_Subtype_Desc) ? 1 : -1);

  let htmlOptions = [];

  for (const item of sensorList) {
    let html = `<option value="${item.Product_Subtype}">${item.Product_Subtype_Desc} (${item.Product_Subtype})</option>`;

    htmlOptions.push(html);
  }

  sensor.innerHTML = htmlOptions.join("");
  sensor.selectedIndex = 0;

  populateSensorAttrList();
}

// This function populates the 'Sensor Attribute' options
// based on the selected 'Sensor ID'.
const populateSensorAttrList = function() {
  generatePlotBtn.disabled = true;

  let sensorAttrList = medaDataConfig.filter(function (d) {
    let key = d.Attr;

    if (
      (d.Product_Type === processLevel.value) &&
      (d.Product_Subtype === sensor.value) &&
      (! d.Attr.match(/^(SCLK|LMST|LTST)$/))
    ) {
      if (!this[key]) {
        this[key] = true;
        return true;
      }
    }
  }, Object.create(null));

  let htmlOptions = [];

  sensorAttrList.sort((a, b) => (a.Attr > b.Attr) ? 1 : -1);

  for (const item of sensorAttrList) {
    let html = `<option value="${item.Attr}">${item.Attr}</option>`;

    htmlOptions.push(html);
  }

  sensorAttr.innerHTML = htmlOptions.join("");
  sensorAttr.selectedIndex = 0;
  generatePlotBtn.disabled = false;
}

processLevel.addEventListener('change', populateSensorList, false);
sensor.addEventListener('change', populateSensorAttrList, false);
