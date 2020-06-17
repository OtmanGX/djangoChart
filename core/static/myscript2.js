var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var unit = 'second';
var date = moment();
var color = Chart.helpers.color;


var config = {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Temerature Line Chart'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                }
            }]
        }
    }
};


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
    data: {
        datasets: [{
            label: 'Temp °C',
            backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
            borderColor: window.chartColors.red,
            data: [generateOneData(),
                generateOneData(),
                generateOneData(),
                generateOneData(),
                generateOneData()],
            type: 'line',
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderWidth: 2
        }]
    },
    options: {
        animation: {
            duration: 0
        },
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
                    autoSkipPadding: 75,
                    maxRotation: 0,
                    sampleSize: 100
                },
                afterBuildTicks: function(scale, ticks) {
                    var majorUnit = scale._majorUnit;
                    var firstTick = ticks[0];
                    var i, ilen, val, tick, currMajor, lastMajor;

                    val = moment(ticks[0].value);
                    if ((majorUnit === 'minute' && val.second() === 0)
                        || (majorUnit === 'hour' && val.minute() === 0)
                        || (majorUnit === 'day' && val.hour() === 9)
                        || (majorUnit === 'month' && val.date() <= 3 && val.isoWeekday() === 1)
                        || (majorUnit === 'year' && val.month() === 0)) {
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
                gridLines: {
                    drawBorder: false
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Température'
                }
            }]
        },
        tooltips: {
            intersect: false,
            mode: 'index',
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
        }
    }
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

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}


var ctx = document.getElementById('canvas').getContext('2d');
var chart = new Chart(ctx, cfg);

function addDataIntervall() {
    dd = generateOneData();
    addData(chart, dd);
}
 var interval = 1000; // 1 secs
 setInterval(addDataIntervall, interval);
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