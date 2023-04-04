const generatePlot = function () {
  console.log("begin generatePlot()");

  let sensorName = sensor.options[sensor.selectedIndex].text;
  let medaRef = medaFileList.find(ds => ds.id === Number.parseInt(sol.value) && ds.sensor === sensor.value);

  if (medaRef === undefined) {
    myPlot.innerHTML = "Perseverance MEDA data not found for Sol " + sol.value + " " + sensorName + " sensor.";
    return;
  }
  
  let collection = medaRef.collection;
  let parent = medaRef.parent;
  let directory = medaRef.directory;
  let filename = medaRef.filename;
  let rawDataURL = "https://sdp.boisestate.edu/pds/data/PDS4/Mars2020/mars2020_meda/" + collection + "/" + parent + "/" + directory + "/" + filename;

  myPlot.innerHTML = "<div class='loading-container'><div class='loading'></div>Processing Perseverance MEDA</div>";

  console.log("d3.csv(): " + rawDataURL);

  // Load MEDA data and generate a Plotly datavis.
  d3.csv(rawDataURL).then(function (rawData) {
    console.log("d3.csv().then()");

    var xField = medaRef.xField;
    var yField = medaRef.yField[0];

    var plotTitle = "Perseverance MEDA Data: " + sensorName + " for Sol " + sol.value + ", " + startTime.value + " to " + endTime.value;
    var data = prepData(rawData, xField, yField);

    var layout = {
      showlegend: true,
      title: plotTitle,
      xaxis: {
        automargin: true,
        tickangle: 45,
        title: {
          text: xField,
          standoff: 16
        }
      },
      yaxis: {
        autorange: true,
        rangemode: "normal",
        title: {
          text: yField,
          standoff: 16
        }
      }
    };

    var config = {
      displayModeBar: true,
      displaylogo: false,
      //downloadImageFilename: ???,
      modeBarButtonsToRemove: ['autoScale2d', 'lasso2d', 'select2d']
    };

    myPlot.innerHTML = "";

    console.log("Plotly.newPlot()");

    Plotly.newPlot(myPlot, data, layout, config);
  });
}

function prepData(rawData, xField, yField) {
  console.log("prepData()");

  var x = [];
  var y = [];

  var startBoundary = convertToSeconds(startTime.value + ":00");
  var endBoundary = convertToSeconds(endTime.value + ":59");

  console.log("rawData.forEach()");

  rawData.forEach(function (datum, i) {
    let ts = (datum[xField].match(/\d{2}:\d{2}:\d{2}/))[0];
    let seconds = convertToSeconds(ts);

    if ((seconds >= startBoundary) && (seconds <= endBoundary)) {
      if (!isNaN(datum[yField]) && !isNaN(parseFloat(datum[yField])) && (datum[yField] < 9999999)) {
        x.push(datum[xField]);
        y.push(datum[yField]);
      }
    }
  });

  return [{
    name: yField,
    type: 'scatter',
    mode: 'lines+markers',
    x: x,
    y: y,
  }];
}

function convertToSeconds(str) {
  console.log("convertToSeconds()");

  let data = str.split(':').map(Number);

  return (data[0] * 3600) + (data[1] * 60) + data[2];
}

generatePlotBtn.addEventListener('click', generatePlot, false);