

function addData(chart, label, data) {
    chart.data.labels.push(label);
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
var $populationChart = $("#population-chart");
var ctx = $populationChart[0].getContext("2d");
var data = {};
data.labels = [];
data.data = [];
var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: data.labels,
        datasets: [{
            label: 'Population',
            backgroundColor: 'blue',
            data: data.data
        }]
    },
    options: {
        responsive: true,
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Population Bar Chart'
        }
    }
});


var ajax_call = function () {
    $.ajax({
        url: $populationChart.data("url"),

        success: function (data) {
            $.each(data.data, function (i, d) {
                addData(chart, data.labels[i], d);
            })

        }
    });
};
ajax_call();
//var interval = 1000; // 5 secs
//setInterval(ajax_call, interval);