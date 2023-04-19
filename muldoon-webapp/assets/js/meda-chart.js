let plotChartFromURL = (window.location.search !== "");

const generatePlot = function () {
  if(!checkTime(startTime, startHelp) || !checkTime(endTime, endHelp)){
    return;
  }

  let sensorName = sensor.options[sensor.selectedIndex].text;
  let medaRef = medaFileList.find(ds => ds.id === Number.parseInt(sol.value) && ds.sensor === sensor.value);

  shareURLBtn.disabled = true;
  exportDataBtn.disabled = true;

  if (medaRef === undefined) {
    let title = "Data not found";
    let msg = "Perseverance MEDA data is not available for Sol " + sol.value + " " + sensorName + " sensor.";

    displayModal(title, msg);

    return;
  }

  let collection = medaRef.collection;
  let parent = medaRef.parent;
  let directory = medaRef.directory;
  let filename = medaRef.filename;
  let rawDataURL = "https://sdp.boisestate.edu/pds/data/PDS4/Mars2020/mars2020_meda/" + collection + "/" + parent + "/" + directory + "/" + filename;

  myPlot.innerHTML = "<div class='loading-container'><div class='loading'></div>Processing Perseverance MEDA</div>";

  // Load MEDA data and generate a Plotly datavis.
  d3.csv(rawDataURL).then(function (rawData) {
    var dataObj = medaDataConfig.filter(function (d) {
      return ((d.Product_Type === processLevel.value) &&
              (d.Product_Subtype === sensor.value) &&
              (d.Attr === sensorAttr.value)
             );
    }, Object.create(null));

    var xField = 'LMST';
    var yField = sensorAttr.value;
    var yUnits = dataObj.map(item => item.Unit);

    if (yUnits.length > 0) {
      yUnits = `(${yUnits})`;
    }

    var plotTitle = sensorName + "<br><sup>Sol " + sol.value + " - " + startTime.value + " to " + endTime.value + "</sup>";
    var data = prepData(rawData, xField, yField);

    var layout = {
      hoverlabel: {
        bgcolor: '#ffffff',
        font: {
          size: 14
        }
      },
      height: 725,
      width: 1400,
      title: {
        text: plotTitle,
        font: {
          weight: 'bold',
          size: 36
        }
      },
      xaxis: {
        automargin: true,
        title: {
          text: xField,
          standoff: 12,
          font: {
            size: 24
          }
        },
        tickfont: {
          size: 14
        }
      },
      yaxis: {
        autorange: true,
        rangemode: "normal",
        title: {
          text: `${yField} &nbsp; ${yUnits}`,
          font: {
            size: 24
          }
        },
        tickfont: {
          size: 14
        }
      }
    };

    let ts = getTimestamp();
    let savePNGFilename = `Sol-${sol.value}-${processLevel.value}-${sensor.value}-${yField}-${ts}`;

    if (plotChartFromURL) {
      let params = new URLSearchParams(window.location.search);
      layout.xaxis.range = [params.get('x1'), params.get('x2')];
      layout.yaxis.range = [params.get('y1'), params.get('y2')];
      layout.yaxis.autorange = false;

      plotChartFromURL = false;
    }

    var config = {
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['autoScale2d', 'lasso2d', 'select2d'],
      responsive: true,
      toImageButtonOptions: {
        format: 'png',
        filename: savePNGFilename,
        scale: 1
      }
    };

    myPlot.innerHTML = "";

    exportDataBtn.onclick = function() {
      window.open(rawDataURL);
    }

    shareURLBtn.disabled = false;
    exportDataBtn.disabled = false;

    Plotly.newPlot(myPlot, data, layout, config);
  });
}

function prepData(rawData, xField, yField) {
  var x = [];
  var y = [];

  var startBoundary = convertToSeconds(startTime.value + ":00");
  var endBoundary = convertToSeconds(endTime.value + ":59");

  rawData.forEach(function (datum, i) {
    let ts = (datum[xField].match(/\d{2}:\d{2}:\d{2}/))[0];
    let seconds = convertToSeconds(ts);

    if ((seconds >= startBoundary) && (seconds <= endBoundary)) {
      if (!isNaN(datum[yField]) && !isNaN(parseFloat(datum[yField])) && (datum[yField] < 9999999)) {
        x.push(ts);
        y.push(datum[yField]);
      }
    }
  });

  return [{
    name: "",
    type: 'scatter',
    mode: 'lines+markers',
    x: x,
    y: y,
    hovertemplate: '%{yaxis.title.text}: %{y}<br>' +
                   '%{xaxis.title.text}: %{x}'
  }];
}

function convertToSeconds(str) {
  let data = str.split(':').map(Number);

  return (data[0] * 3600) + (data[1] * 60) + data[2];
}
    
function getTimestamp() {
    let d = new Date();
    let year = d.getFullYear();
    let month = ("0" + (d.getMonth() + 1)).slice(-2);
    let day = ("0" + d.getDate()).slice(-2);
    let hours = ("0" + d.getHours()).slice(-2);
    let mins = ("0" + d.getMinutes()).slice(-2);
    let secs = ("0" + d.getSeconds()).slice(-2);
    let ts = `${year}${month}${day}${hours}${mins}${secs}`;

    return ts;
}
    
function displayModal(t, m) {
    myModalTitle.innerHTML = t;
    myModalMsg.innerHTML = m;

    myModal.toggle();
}

function shareURL() {
  if (myPlot.classList.contains('js-plotly-plot')) {
    let urlBuilder = new URLSearchParams();

    urlBuilder.set('sol', sol.value);
    urlBuilder.set('start', startTime.value);
    urlBuilder.set('end', endTime.value);
    urlBuilder.set('processLevel', processLevel.selectedIndex);
    urlBuilder.set('sensor', sensor.selectedIndex);
    urlBuilder.set('sensorAttr', sensorAttr.selectedIndex);
    urlBuilder.set('x1', myPlot.layout.xaxis.range[0]);
    urlBuilder.set('x2', myPlot.layout.xaxis.range[1]);
    urlBuilder.set('y1', myPlot.layout.yaxis.range[0]);
    urlBuilder.set('y2', myPlot.layout.yaxis.range[1]);

    let url = window.location.origin + window.location.pathname + '?' + urlBuilder.toString();

    navigator.clipboard.writeText(url);

    urlDisplay.innerHTML = url;
    urlDisplay.href = url;

    alert("URL copied to clipboard");
  }
}

generatePlotBtn.addEventListener('click', generatePlot, false);
shareURLBtn.addEventListener('click', shareURL, false);