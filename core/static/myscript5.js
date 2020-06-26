var unit = 'second';
var date = moment();
var color = Chart.helpers.color;
var numberElements = 100;
var fixedData = LIMITS;
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

var annotations1 = [{
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: LIMITS[0],
    borderColor: 'rgb(0, 255, 0)',
    borderWidth: 2,
    label: {
        enabled: true,
        content: 'T1 (normal)'
    }
},{
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: LIMITS[1],
    borderColor: 'rgb(255, 163, 0)',
    borderWidth: 2,
    label: {
        enabled: true,
        content: 'T2 (seuil 2)'
    }
},{
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: LIMITS[2],
    borderColor: 'rgb(239, 41, 41)',
    borderWidth: 2,
    label: {
        enabled: true,
        content: 'T3 (seuil 3)'
    }
}]

var data1 = {
    datasets: [{
//            backgroundColor: utils.transparentize(presets.black),
        borderColor: presets.green,
        pointRadius: 0,
        lineTension: 0,
        data: [],
        label: 'T normale',
        fill: false,
    }, {
        backgroundColor: presets.green2,
        borderColor: presets.orange,
        label: 'Seuil 2',
        pointRadius: 0,
        lineTension: 0,
        data: [],
        fill: '-1'
    }, {
        backgroundColor: presets.orange,
        borderColor: presets.red2,
        label: 'Seuil 3',
        pointRadius: 0,
        lineTension: 0,
        data: [],
        fill: 1
    }, {
        backgroundColor: presets.red2,
        borderColor: presets.red2,
        data: [],
        pointRadius: 0,
        lineTension: 0,
        label: 'Seuil 3 Max',
        fill: 1
    },{
        label: 'Temp °C',
        fontColor: '#ffffff',
//            title: {text:'temperature', fontColor: '#ffffff', display:true},
        backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
        backgroundColor: utils.transparentize(window.chartColors.yellow2),
        borderColor: window.chartColors.yellow2,
        data: [],
        fill:false,
//            data: [{t: date.valueOf(),y: 0}],
        pointRadius: 3,
        lineTension: 0,
        borderWidth: 2
    }]
}
var data2 = {
    datasets: [{
        type: 'line',
        fill: false,
        label: 'Temp °C',
        backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
        backgroundColor: utils.transparentize(window.chartColors.yellow2),
        borderColor: window.chartColors.yellow2,
        data: [],
        pointRadius: 4,
        lineTension: 0,
        borderWidth: 2
    }]
}

//firstData = generateData();
function generateLineConfig(data, annotations) {
    return  {
        type: 'line',
        defaultFontColor:'#ffffff',
        title: {text:'temperature', fontColor: '#ffffff', display:true},
        data: data,
        options: {
            title: {
                fontColor: '#ffffff',
            },
            legend: {
                display:true,
            },
            showLine: false,
            responsive: true,
            annotation: {
                annotations: annotations
            },
            title: {
                display: true,
                fontSize: 22,
                text: 'Température',
                fontColor: '#ffffff',
            },
            animation: {
                duration: 0
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false
                    },
                    type: 'time',

                time: {
                    displayFormats: {
                        quarter: 'h:mm:ss'
                    },
//                    unit: 'month'
                },
                    distribution: 'linear',
                    offset: true,
                    ticks: {
                        fontColor: '#ffffff',
                        major: {
                            enabled: true,
                            fontStyle: 'bold'
                        },
                        source: 'data',
                        autoSkip: true,
                        beginAtZero: true,
                        autoSkipPadding: 75,
                        minRotation: 0,
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
                            || (majorUnit === 'day' && val.hour() === 0)
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
                        display:false
                    },
                    stacked: false,
                    ticks:{
                        fontColor: '#ffffff',
                    },
                    display: true,
                    type: 'linear',
                    gridLines: {
                        drawBorder: false,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Température',
                        fontColor: '#ffffff',
                    }
                }]
            },
            tooltips: {
                intersect: false,
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
                intersect: true,
                animationDuration: 0
            },
            responsiveAnimationDuration: 0,
            plugins: {

                ChartDataLabels:false,
                zoom: {
                    // Container for pan options
                    pan: {
                        // Boolean to enable panning
                        enabled: false,

                        // Panning directions. Remove the appropriate direction to disable
                        // Eg. 'y' would only allow panning in tminRotationhe y direction
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
                        enabled: false,

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
}


var colorNames = Object.keys(window.chartColors);



function addData(chart, data, i=4, update=true) {
//    chart.data.datasets.forEach((dataset) => {
//        dataset.data.push(data);
//    });
    chart.data.datasets[i].data.push(data);
    if (update) chart.update();
}

function newValue(chart, date, value, i=4, update=true) {

    addData(chart, {
        t: date.valueOf(),
        y: value
    }, i, update);
    if (i === 0)
       if (updateCount>numberElements) {
           chart.data.labels.shift();
             chart.data.datasets[i].data.shift();
       } else updateCount++;
}

function newValue2(chart) {
    var array = new Array();
    for (var i=0; i<4;i++)
        for (var j=0; j<12;j++)
            addData(chart, {
                t: new Date(year=2020, month=j),
                y: fixedData[i]
            },i, true);
    chart.update()
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
var chart1 = new Chart.Line(ctx, generateLineConfig(data2, annotations1));

var $lineChart2 = $('#canvas2');
var ctx2 = $lineChart2[0].getContext("2d");
var chart2 = new Chart.Line(ctx2, generateLineConfig(data1, []));

function addDataIntervall() {
    dd = generateOneData();
    addData(chart, dd);
}

var ajax_call = function () {
    $.ajax({
        url: $lineChart.data("url"),

        success: function (data) {
            newValue(chart1, new Date(data.data.date), data.data.value, 0);
            tempValue.text(data.data.value);
//            $.each(data.data, function (i, d) {
//                addData(chart, data.labels[i], d);
//            })
        }
    });
};

var ajax_call2 = function () {
    $.ajax({
        url: $lineChart2.data("url"),
        success: function (data) {

//        newValue2(chart2);
            $.each(data.data, function (i, d) {
//                 if (i===0 || i===data.data.length)
//                for (var j=0; j<4;j++) newValue(chart2, new Date(d.date), fixedData[j], j);
                newValue(chart2, new Date(d.date), d.value);
            });
        }
    });
};

async function call2() {
    var data = queryset;
    console.log(queryset.length);
    $.each(data, function (i, d) {
        if (i===0 || i===data.length-1)
            for (var j=0; j<4;j++) newValue(chart2, new Date(d.date), fixedData[j], j);
        newValue(chart2, new Date(d.date), d.value, 4, false);
    });
    var datomax = moment();
    datomax.set({'year': 2020, 'month': 11});
    for (var i=0; i<4;i++)
        newValue(chart2, datomax , fixedData[i], i, false);
    chart2.update();
}

call2();
ajax_call();
//newValue2(chart2)
//ajax_call2();
//newValue2(chart2)
var interval = 500; // 1 secs
setInterval(ajax_call, interval);

window.resetZoom = function(chart) {
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