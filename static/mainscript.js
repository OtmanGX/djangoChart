var unit = 'second';
var date = moment();
//var timeFormat = 'MM/DD/YYYY hh:mm a';
var timeFormat = 'LLL';
var now = window.moment();
var dragOptions = {
    animationDuration: 1000
};
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
    value: LIMITS[4],
    borderColor: 'rgb(0, 255, 0)',
    borderWidth: 2,
    label: {
        enabled: true,
        content: LIMITS[4]+'°C (Idéal)'
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
        content: LIMITS[1]+'°C (seuil 2)'
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
        content: LIMITS[2]+'°C (seuil 3)'
    }
}]

var annotations2 = [{
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: LIMITS[4],
    borderColor: 'rgb(0, 255, 0)',
    borderWidth: 2,
    label: {
        enabled: true,
        content: 'T° (Idéale)'
    }
}]

var data1 = {
    datasets: [{
//            backgroundColor: utils.transparentize(presets.black),
        borderColor: presets.green,
        pointRadius: 0,
        lineTension: 0,
        data: [],
        label: 'T° Min',
        fill: false,
    }, {
        backgroundColor: presets.green2,
        borderColor: presets.orange,
        label: 'T° Adéquate',
        pointRadius: 0,
        lineTension: 0,
        data: [],
        fill: '-1'
    }, {
        backgroundColor: presets.orange,
        borderColor: presets.red2,
        label: 'T° Alarme',
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
        label: 'T° Arrêt',
        fill: 1
    },{
        label: 'T°',
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
function generateLineConfig(title, data, annotations) {
    return {
        type: 'line',
        defaultFontColor: '#ffffff',
        title: {text: title, fontColor: '#ffffff', display: true},
        data: data,
        options: {
            legend: {
                display: true,
            },
            showLine: false,
            responsive: true,
            annotation: {
                annotations: annotations
            },
            title: {
                display: false,
                fontSize: 22,
                text: title,
            },
            animation: {
                duration: 0
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    type: 'time',
                    time: {
                        parser: timeFormat,
                        displayFormats: {
                        millisecond: 'H:mm:ss.SSS',
                        second: 'H:mm:ss',
                        minute: 'H:mm',
                        hour: 'H',
                         },
                        // round: 'day'
                        tooltipFormat: 'll H:mm:ss'
                    },
                    distribution: 'linear',
                    offset: true,
                    ticks: {
                        autoSkip: true,
                        beginAtZero: true,
                        autoSkipPadding: 20,
                        major: {
                            enabled: true,
                            fontStyle: 'bold'
                        },
//                        source: 'data',
//                        autoSkip: true,
//                        beginAtZero: true,
//                        autoSkipPadding: 75,
                        minRotation: 0,
                        maxRotation: 0,
                    },
                }],
                yAxes: [{
                    sampleSize: 10,
//                    min: 0,
//                    max: 30,
//                    stepSize: 1,
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    stacked: false,
                    ticks: {
                        autoSkip: true,
                        stepSize: 1,
                        min: 0,
                        max: 30
                    },
                    display: true,
                    type: 'linear',
                    scaleLabel: {
                        display: true,
                        labelString: 'Température',
                    }
                }]
            },
            tooltips: {
                intersect: false,
                mode: 'nearest',
                callbacks: {
                    label: function (tooltipItem, myData) {
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
                ChartDataLabels: false,
                zoom: {
                    zoom: {
                        enabled: true,
                        drag: dragOptions,
                        mode: 'x',
                        speed: 0.05
                    }
                }
            },
        },
    }
}

var colorNames = Object.keys(window.chartColors);


function addData(chart, data, i = 4, update = true) {
//    chart.data.datasets.forEach((dataset) => {
//        dataset.data.push(data);
//    });
    chart.data.datasets[i].data.push(data);
    if (update) chart.update();
}

function newValue(chart, date, value, i = 4, update = true) {

    addData(chart, {
        t: date.valueOf(),
        y: value
    }, i, update);
    if (i === 0)
        if (updateCount > numberElements) {
            chart.data.labels.shift();
            chart.data.datasets[i].data.shift();
        } else updateCount++;
}

function newValue2(chart) {
    var array = new Array();
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 12; j++)
            addData(chart, {
                t: new Date(year = 2020, month = j),
                y: fixedData[i]
            }, i, true);
    chart.update()
}


function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

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

//var ajax_call2 = function () {
//    $.ajax({
//        url: $lineChart2.data("url"),
//        success: function (data) {
//
////        newValue2(chart2);
//            $.each(data.data, function (i, d) {
////                 if (i===0 || i===data.data.length)
////                for (var j=0; j<4;j++) newValue(chart2, new Date(d.date), fixedData[j], j);
//                newValue(chart2, new Date(d.date), d.value);
//            });
//        }
//    });
//};

async function call2() {
    var data = queryset;
    console.log(queryset.length);
    var datomax = moment();
    datomax.set({'month': 0});
    datomax.startOf('month');

    $.each(data, function (i, d) {
//            if (i === 0 || i === data.length - 1)
//                for (var j = 0; j < 4; j++) newValue(chart2, new Date(d.date), fixedData[j], j);
        newValue(chart2, new Date(d.date), d.value, 4, false);
    });
    chart2.update();
    for (var j=1;j<13;j++) {
        for (var i = 0; i < 4; i++)
            newValue(chart2, datomax, fixedData[i], i, false);
        chart2.update();
        datomax.set({'month': j});
        datomax.endOf('month');
    }
}

window.resetZoom = function (chart) {
    chart.resetZoom();
};
window.clearChart = function () {
    chart.clear();
};