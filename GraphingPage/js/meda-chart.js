const plotGraph = function () {
    let parentDataDir = getParentDataDir(sol.value);
    let solId = sol.value.padStart(4, '0');
    let rawPSDataURL = "https://sdp.boisestate.edu/pds/data/PDS4/Mars2020/mars2020_meda/data_derived_env/" + parentDataDir + "/sol_" + solId + "/WE__" + solId + "___________DER_PS__________________P01.CSV";

    console.log("Sol ID: " + solId);
    console.log("Parent data dir: " + parentDataDir);
    console.log(rawPSDataURL);

    // This block is for PRESSURE data
    d3.csv(rawPSDataURL).then(function(rawData) {
        var xField = 'LMST';
        var yField = 'PRESSURE';

        var data = prepData(rawData, xField, yField);

        var layout = {
            showlegend: true,
            title: "Mars 2020 MEDA Data - Sol " + sol.value + ", " + startTime.value + " to " + endTime.value,
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
            modeBarButtonsToRemove: ['autoScale2d','lasso2d','select2d']
        };

        Plotly.newPlot(myChart, data, layout, config);
    });
}

function prepData(rawData, xField, yField) {
    var x = [];
    var y = [];

    var startBoundary = convertToSeconds(startTime.value);
    var endBoundary = convertToSeconds(endTime.value);

    rawData.forEach(function(datum, i) {

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

function getParentDataDir(n) {
    if (n <= 89) {
        return 'sol_0000_0089';
    }
    else if (n <= 179) {
        return 'sol_0090_0179';
    }
    else if (n <= 299) {
        return  'sol_0180_0299';
    }
    else if (n <= 419) {
        return 'sol_0300_0419';
    }
    else if (n <= 539) {
        return 'sol_0420_0539';
    }

    return;
}

plotGraphBtn.addEventListener('click', plotGraph, false);