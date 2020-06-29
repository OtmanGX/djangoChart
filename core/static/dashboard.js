var $lineChart = $('#canvas');
var ctx = $lineChart[0].getContext("2d");
var tempValue = $('#tempValue');
var chart1 = new Chart.Line(ctx, generateLineConfig('',data2, annotations1));

var $lineChart2 = $('#canvas2');
var ctx2 = $lineChart2[0].getContext("2d");
var chart2 = new Chart.Line(ctx2, generateLineConfig('Température annuelle', data1, annotations2));

call2();
ajax_call();
var interval = 1000; // 1 secs
setInterval(ajax_call, interval);

window.resetZoom = function (chart) {
    chart.resetZoom();
};
window.clearChart = function () {
    chart.clear();
};