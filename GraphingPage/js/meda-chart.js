const plotGraph = function () {
  let sensorName = sensor.options[sensor.selectedIndex].text;
  let medaRef = medaFileList.find(ds => ds.id === Number.parseInt(sol.value) && ds.sensor === sensor.value);

  if (medaRef === undefined) {
    myChart.innerHTML = "Perseverence MEDA data not found for Sol " + sol.value + " " + sensorName + " sensor.";
    return;
  }
  
  let parent = medaRef.parent;
  let directory = medaRef.directory;
  let filename = medaRef.filename;
  let rawDataURL = "https://sdp.boisestate.edu/pds/data/PDS4/Mars2020/mars2020_meda/data_derived_env/" + parent + "/" + directory + "/" + filename;

  myChart.innerHTML = "Processing Perseverence MEDA...";

  console.log("Parent: " + parent);
  console.log("Directory: " + directory);
  console.log("Filename: " + filename);
  console.log(rawDataURL);

  // Load MEDA data and Generate a Plotly datavis.
  d3.csv(rawDataURL).then(function (rawData) {
    var xField = medaRef.xField;
    var yField = medaRef.yField;

    var plotTitle = "Perseverence MEDA Data: " + sensorName + " for Sol " + sol.value + ", " + startTime.value + " to " + endTime.value;
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
      modeBarButtonsToRemove: ['autoScale2d', 'lasso2d', 'select2d']
    };

    myChart.innerHTML = "";

    Plotly.newPlot(myChart, data, layout, config);
  });
}

function prepData(rawData, xField, yField) {
  var x = [];
  var y = [];

  var startBoundary = convertToSeconds(startTime.value);
  var endBoundary = convertToSeconds(endTime.value);

  rawData.forEach(function (datum, i) {
    let ts = (datum[xField].match(/\d{2}:\d{2}:\d{2}/))[0];
    let seconds = convertToSeconds(ts);

    if ((seconds >= startBoundary) && (seconds <= endBoundary)) {
      x.push(datum[xField]);
      y.push(datum[yField]);
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
  let data = str.split(':').map(Number);

  return (data[0] * 3600) + (data[1] * 60) + data[2];
}

plotGraphBtn.addEventListener('click', plotGraph, false);