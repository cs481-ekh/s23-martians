const generatePlot = function () {
  let sensorName = sensor.options[sensor.selectedIndex].text;
  let medaRef = medaFileList.find(ds => ds.id === Number.parseInt(sol.value) && ds.sensor === sensor.value);

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
    var xField = medaRef.xField;
    var yField = medaRef.yField[0];

    var plotTitle = sensorName + " for Sol " + sol.value + ", " + startTime.value + " to " + endTime.value;
    var data = prepData(rawData, xField, yField);

    var layout = {
      hoverlabel: {
        bgcolor: '#ffffff',
        font: {
          size: 14
        }
      },
      width: 1400,
      //showlegend: true,
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
          text: yField,
          font: {
            size: 24
          }
        },
        tickfont: {
          size: 14
        }
      }
    };

    var config = {
      displayModeBar: true,
      displaylogo: false,
      //downloadImageFilename: ???,
      modeBarButtonsToRemove: ['autoScale2d', 'lasso2d', 'select2d'],
      responsive: true
    };

    myPlot.innerHTML = "";

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
    
function displayModal(t, m) {
    myModalTitle.innerHTML = t;
    myModalMsg.innerHTML = m;

    myModal.toggle();
}

generatePlotBtn.addEventListener('click', generatePlot, false);