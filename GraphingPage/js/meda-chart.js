
const myChart = document.getElementById('graph');
const rawPSDataURL = 'https://sdp.boisestate.edu/pds/data/PDS4/Mars2020/mars2020_meda/data_derived_env/sol_0300_0419/sol_0304/WE__0304___________DER_PS__________________P01.CSV';

const medaSol = 304;
const startBoundary = convertToSeconds('07:23:45');
const endBoundary = convertToSeconds('07:34:56');

d3.csv(rawPSDataURL).then(function(rawData) {
    var data = prepPSData(rawData);
    var layout = {
        showlegend: true,
        title: "Time series Mars 2020 MEDA data for Sol " + medaSol,
        xaxis: {
            automargin: true,
            tickangle: 45,
            title: {
                text: 'LMST',
                standoff: 16
            }
        },
        yaxis: {
            autorange: true,
            rangemode: "normal",
            title: {
                text: 'PRESSURE',
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

function prepPSData(rawData) {
    var x = [];
    var y = [];
    var xField = 'LMST';
    var yField = 'PRESSURE';

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