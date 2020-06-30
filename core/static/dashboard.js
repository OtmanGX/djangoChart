var currentDate = moment();
var ajaxCallRealTime = async function () {
    $.ajax({
        url: $lineChart.data("url"),
        success: function (data) {
            if (data.data != null) {
                var newCurrentDate = moment(data.data.date);
                if (currentDate.isBefore(newCurrentDate)) {
                    currentDate = newCurrentDate;
                    newValue(chart1, currentDate, data.data.value, 0, true, true);
                    tempValue.text(data.data.value);
                }
            }
//            $.each(data.data, function (i, d) {
//                addData(chart, data.labels[i], d);
//            })
        }
    });
};

var ajaxBarHistory = async function () {
    $.ajax({
        url: $lineChart.data("url"),
        success: function (data) {
            if (data.data != null) {
                var newCurrentDate = moment(data.data.date);
                if (currentDate.isBefore(newCurrentDate)) {
                    currentDate = newCurrentDate;
                    newValue(chart1, currentDate, data.data.value, 0);
                    tempValue.text(data.data.value);
                }
            }
//            $.each(data.data, function (i, d) {
//                addData(chart, data.labels[i], d);
//            })
        }
    });
};

var ajaxYearHistory = async function () {
    $.ajax({
        url: $lineChart2.data("url"),
        success: function (data) {
            updateYearHistory(data.data);
        }
    });
};

async function updateYearHistory(data) {
    clearChart(chart2);
    await sleep(300);
    console.log("update called");
    var datomax = moment();
    datomax.set({'month': 0});
    datomax.startOf('month');

    $.each(data, function (i, d) {
//            if (i === 0 || i === data.length - 1)
//                for (var j = 0; j < 4; j++) newValue(chart2, new Date(d.date), fixedData[j], j);
        newValue(chart2, new Date(d.date), d.value, 4, false);
    });
    newValue(chart2, new Date(), data[data.length-1].value, 4, false);
    chart2.update();
    for (var j=1;j<13;j++) {
        for (var i = 0; i < 4; i++)
            newValue(chart2, datomax, fixedData[i], i, false);
        chart2.update();
        datomax.set({'month': j});
        datomax.endOf('month');
    }
}


var $lineChart = $('#canvas');
var ctx = $lineChart[0].getContext("2d");
var tempValue = $('#tempValue');
var chart1 = new Chart.Line(ctx, generateLineConfig('',data2, annotations1));

var $lineChart2 = $('#canvas2');
var ctx2 = $lineChart2[0].getContext("2d");
var chart2 = new Chart.Line(ctx2, generateLineConfig('Température annuelle', data1, annotations2));


// Interval and ajax
var interval = 1000; // 1 secs
var data = queryset;
updateYearHistory(data);
setInterval(ajaxCallRealTime, interval);

window.resetZoom = function (chart) {
    chart.resetZoom();
};


function displayTime() {
    $("#timeValue").text(moment().format("D-MM-Y HH:mm:ss"));
}

var interval = 1000; // 1 secs
setInterval(displayTime, interval);