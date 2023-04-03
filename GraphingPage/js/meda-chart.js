let shouldImport = (window.location.search != "");

const plotGraph = function () {
  let sensorName = sensor.options[sensor.selectedIndex].text;
  let medaRef = medaFileList.find(ds => ds.id === Number.parseInt(sol.value) && ds.sensor === sensor.value);

  if (medaRef === undefined) {
    myChart.innerHTML = "Perseverance MEDA data not found for Sol " + sol.value + " " + sensorName + " sensor.";
    return;
  }
  
  let collection = medaRef.collection;
  let parent = medaRef.parent;
  let directory = medaRef.directory;
  let filename = medaRef.filename;
  let rawDataURL = "https://sdp.boisestate.edu/pds/data/PDS4/Mars2020/mars2020_meda/" + collection + "/" + parent + "/" + directory + "/" + filename;

  myChart.innerHTML = "<div class='loading-container'><div class='loading'></div>Processing Perseverance MEDA</div>";

  // Load MEDA data and generate a Plotly datavis.
  d3.csv(rawDataURL).then(function (rawData) {
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

    if(shouldImport) {
      let params = new URLSearchParams(window.location.search);
      layout.xaxis.range = [params.get('x1'), params.get('x2')];
      layout.yaxis.range = [params.get('y1'), params.get('y2')];
      layout.xaxis.automargin = false;
      layout.yaxis.autorange = false;
      shouldImport = false;
    }

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
  let data = str.split(':').map(Number);

  return (data[0] * 3600) + (data[1] * 60) + data[2];
}

plotGraphBtn.addEventListener('click', plotGraph, false);

const exportURL = function() {
  if(myChart.classList.contains('js-plotly-plot')){
    let urlBuilder = new URLSearchParams();
    urlBuilder.set('sol', sol.value);
    urlBuilder.set('t1', startTime.value);
    urlBuilder.set('t2', endTime.value);
    urlBuilder.set('s', sensor.selectedIndex)
    urlBuilder.set('x1', myChart.layout.xaxis.range[0]);
    urlBuilder.set('x2', myChart.layout.xaxis.range[1]);
    urlBuilder.set('y1', myChart.layout.yaxis.range[0]);
    urlBuilder.set('y2', myChart.layout.yaxis.range[1]);
    let url = window.location.origin + window.location.pathname + '?' + urlBuilder.toString();
    urlDisplay.href = url;
    urlDisplay.innerHTML = url;
  }
}

exportUrlBtn.addEventListener('click', exportURL, false);

if(shouldImport) {
  let params = new URLSearchParams(window.location.search);
  sol.value = params.get('sol');
  startTime.value = params.get('t1');
  endTime.value = params.get('t2');
  sensor.selectedIndex = params.get('s');
  setTimeout(() => {
    plotGraphBtn.click();
  }, 500);
}