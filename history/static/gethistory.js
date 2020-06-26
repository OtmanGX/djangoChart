var unit = 'minute';
var date = moment();
var color = Chart.helpers.color;
var numberElements = 30;
var updateCount = 0;


function unitLessThanDay() {
    return unit === 'second' || unit === 'minute' || unit === 'hour';
}

function beforeNineThirty(date) {
    return date.hour() < 9 || (date.hour() === 9 && date.minute() < 30);
}

// Returns true if outside 9:30am-4pm on a weekday
function outsideMarketHours(date) {
    if (date.isoWeekday() > 5) {
        return true;
    }
    if (unitLessThanDay() && (beforeNineThirty(date) || date.hour() > 16)) {
        return true;
    }
    return false;
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function randomBar(date, lastClose) {
    var open = randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
    var close = randomNumber(open * 0.95, open * 1.05).toFixed(2);
    return {
        t: date.valueOf(),
        y: close
    };
}


function generateData() {
    // var date = moment('Jan 01 1990', 'MMM DD YYYY');
    var date = moment();
    date.add(2, unit);
    var now = moment();
    var data = [];
    var lessThanDay = unitLessThanDay();
    for (; data.length < 100; date = date.clone().add(1, unit).startOf(unit)) {
        if (outsideMarketHours(date)) {
            if (!lessThanDay || !beforeNineThirty(date)) {
                date = date.clone().add(date.isoWeekday() >= 5 ? 8 - date.isoWeekday() : 1, 'day');
            }
            if (lessThanDay) {
                date = date.hour(9).minute(30).second(0);
            }
        }
        console.log(date)
        data.push(randomBar(date, 10));
    }
    return data;
}

function generateOneData() {
    // var date = moment('Jan 01 1990', 'MMM DD YYYY');
    date.add(1, unit);
    // date = date.clone().add(5, unit).startOf(unit)
    return randomBar(date, 10);
}



//firstData = generateData();


var cfg = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Temp °C',
            title: 'temperature',
            backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
            borderColor: window.chartColors.red,
            data: [],
//            data: [{t: date.valueOf(),y: 0}],
            pointRadius: 4,
            fill: false,
            lineTension: 0.4,
            borderWidth: 2
        }]
    },
    options: {
    responsive: true,
    annotation: {
      annotations: [{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: 10,
        borderColor: 'rgb(237, 212, 0)',
        borderWidth: 2,
        label: {
          enabled: true,
          content: 'Min'
        }
      },{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: 20,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
        label: {
          enabled: true,
          content: 'Normal'
        }
      },{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: 25,
        borderColor: 'rgb(239, 41, 41)',
        borderWidth: 2,
        label: {
          enabled: true,
          content: 'Max'
        }
      }]
    },
    title: {
        display: true,
        text: 'Température'
				},
//        animation: {
//            duration: 0
//        },
        scales: {
            xAxes: [{
                type: 'time',
                distribution: 'series',
                offset: true,
                ticks: {
                    major: {
                        enabled: true,
                        fontStyle: 'bold'
                    },
                    source: 'data',
                    autoSkip: true,
                    beginAtZero: true,
                    autoSkipPadding: 75,
                    maxRotation: 0,
                    sampleSize: 100
                },
                afterBuildTicks: function(scale, ticks) {
                    var majorUnit = scale._majorUnit;
                    if (ticks==null || ticks.length===0) return ;
                    var firstTick = ticks[0];
                    var i, ilen, val, tick, currMajor, lastMajor;

                    val = moment(ticks[0].value);
                    if ((majorUnit === 'minute' && val.second() === 0)
                        || (majorUnit === 'hour' && val.minute() === 0)
                        || (majorUnit === 'day' && val.hour() === 9)
                        || (majorUnit === 'month' && val.date() <= 3 && val.isoWeekday() === 1)
//                        || (majorUnit === 'year' && val.month() === 0)
                        )
                        {
                        firstTick.major = true;
                    } else {
                        firstTick.major = false;
                    }
                    lastMajor = val.get(majorUnit);

                    for (i = 1, ilen = ticks.length; i < ilen; i++) {
                        tick = ticks[i];
                        val = moment(tick.value);
                        currMajor = val.get(majorUnit);
                        tick.major = currMajor !== lastMajor;
                        lastMajor = currMajor;
                    }
                    return ticks;
                }
            }],
            yAxes: [{
            display: true,
            type: 'linear',
                gridLines: {
                    drawBorder: false,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Température'
                }
            }]
        },
        tooltips: {
            intersect: true,
            mode: 'nearest',
            callbacks: {
                label: function(tooltipItem, myData) {
                    var label = myData.datasets[tooltipItem.datasetIndex].label || '';
                    if (label) {
                        label += ': ';
                    }
                    label += parseFloat(tooltipItem.value).toFixed(2);
                    return label;
                }
            }
        },
        hover: {
					mode: 'nearest',
					intersect: true
				},
		plugins: {
            zoom: {
                // Container for pan options
                pan: {
                    // Boolean to enable panning
                    enabled: true,

                    // Panning directions. Remove the appropriate direction to disable
                    // Eg. 'y' would only allow panning in the y direction
                    mode: 'xy',
                    rangeMin: {
                        // Format of min pan range depends on scale type
                        x: null,
                        y: null
                    },
                    rangeMax: {
                        // Format of max pan range depends on scale type
                        x: null,
                        y: null
                    },
                    // On category scale, factor of pan velocity
                    speed: 20,

                    // Minimal pan distance required before actually applying pan
                    threshold: 10,

                    // Function called while the user is panning
                    onPan: function({chart}) { console.log(`I'm panning!!!`); },
                    // Function called once panning is completed
                    onPanComplete: function({chart}) { console.log(`I was panned!!!`); }

                },

                // Container for zoom options
                zoom: {
                    // Boolean to enable zooming
                    enabled: true,

                    // Enable drag-to-zoom behavior
//                    drag: true,

                    // Zooming directions. Remove the appropriate direction to disable
                    // Eg. 'y' would only allow zooming in the y direction
                    mode: 'xy',
                    rangeMin: {
				// Format of min zoom range depends on scale type
				x: null,
				y: null
			},
			rangeMax: {
				// Format of max zoom range depends on scale type
				x: null,
				y: null
			},

			// Speed of zoom via mouse wheel
			// (percentage of zoom on a wheel event)
			speed: 0.1,

			// Minimal zoom distance required before actually applying zoom
			threshold: 2,

			// On category scale, minimal zoom level before actually applying zoom
			sensitivity: 3,
                }
            }
        }
    },

};
// document.getElementById('randomizeData').addEventListener('click', function() {
//     config.data.datasets.forEach(function(dataset) {
//         dataset.data = dataset.data.map(function() {
//             return randomScalingFactor();
//         });
//
//     });
//
//     window.myLine.update();
// });

var colorNames = Object.keys(window.chartColors);



function addData(chart, data) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function newValue(date, value) {
    addData(chart, {
        t: date.valueOf(),
        y: value
    });
//    if (updateCount>numberElements) {
//        chart.data.labels.shift();
//          chart.data.datasets[0].data.shift();
//    } else updateCount++;
}


function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}


var $lineChart = $('#canvas');
var ctx = $lineChart[0].getContext("2d");
var tempValue = $('#tempValue');
//var chart = new Chart.Line(ctx, cfg);

function recreateChart() {
    $lineChart = $('#canvas');
    ctx = $lineChart[0].getContext("2d");
    tempValue = $('#tempValue');
    chart = new Chart.Line(ctx, cfg);
}

function addDataIntervall() {
    dd = generateOneData();
    addData(chart, dd);
}

var ajax_call = function (url) {
    $.ajax({
        url: url,

        success: function (data) {
//                date.add(1, unit);
//                newValue(date, data.data.value);
//                tempValue.text(data.data.value);
//            chart.data.dataset = [];
        chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
//        while(dataset.data.pop()) dataset.data.pop();
    });
    chart.update();
            $.each(data.data, function (i, d) {
                date.add(1, unit);
                newValue(date, d.value);
//                addData(chart, data.labels[i], d);
            })
            chart.update();

        }
    });
};
//ajax_call($lineChart.data("url"));
function filter(event) {
        var date1 = $("#datetimepicker1");
        console.log(date1);
        if (date1) {
            var url = $lineChart.data("url")+'?date1='+date1.val()
        }
        console.log($lineChart.data("url"));
        ajax_call(url);
}

function filter2(val) {
    console.log(val);
    var url = $lineChart.data("url")+'?filter='+val
    ajax_call(url);
}

//$('#filter').on('click', function(event) {
//        var date1 = $("#datetimepicker1");
//        console.log(date1);
//        if (date1) {
//            var url = $lineChart.data("url")+'?date1='+date1.val()
//        }
//        console.log($lineChart.data("url"));
//        ajax_call(url);
//    });

window.resetZoom = function() {
			chart.resetZoom();
		};
window.clearChart = function() {
			chart.clear();
		};
// document.getElementById('addDataset').addEventListener('click', function() {
//     var colorName = colorNames[config.data.datasets.length % colorNames.length];
//     var newColor = window.chartColors[colorName];
//     var newDataset = {
//         label: 'Dataset ' + config.data.datasets.length,
//         backgroundColor: newColor,
//         borderColor: newColor,
//         data: [],
//         fill: false
//     };
//
//     for (var index = 0; index < config.data.labels.length; ++index) {
//         newDataset.data.push(randomScalingFactor());
//     }
//
//     config.data.datasets.push(newDataset);
//     window.myLine.update();
// });

// document.getElementById('addData').addEventListener('click', function() {
//     if (config.data.datasets.length > 0) {
//         var month = MONTHS[config.data.labels.length % MONTHS.length];
//         config.data.labels.push(month);
//
//         config.data.datasets.forEach(function(dataset) {
//             dataset.data.push(randomScalingFactor());
//         });
//
//         window.myLine.update();
//     }
// });
//
// document.getElementById('removeDataset').addEventListener('click', function() {
//     config.data.datasets.splice(0, 1);
//     window.myLine.update();
// });
//
// document.getElementById('removeData').addEventListener('click', function() {
//     config.data.labels.splice(-1, 1); // remove the label first
//
//     config.data.datasets.forEach(function(dataset) {
//         dataset.data.pop();
//     });
//
//     window.myLine.update();
// });