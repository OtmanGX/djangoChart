var $historyChart = $('#historyCanvas');
var ctx = $historyChart[0].getContext("2d");
var chart = new Chart.Line(ctx, generateLineConfig('Température', data1, annotations2));

var history_call = async function (url) {
    $.ajax({
        url: url,
        success: function (data) {
            chart.data.labels.pop();
            chart.data.datasets.forEach((dataset) => {
                dataset.data = [];
            });
            chart.update();
            $.each(data.data, function (i, d) {
                if (i===0 || i===data.data.length-1)
                for (var j = 0; j < 4; j++)
                    newValue(chart, new Date(d.date), fixedData[j], j, false);
                newValue(chart, new Date(d.date), d.value, 4, false);
            });
            chart.update();

        }
    });
};


function filter(event) {
    var date1 = $("#datetimepicker1");
    var date_1 = $("#datetimepicker_1");
    var date2 = $("#datetimepicker2");
    var date_2= $("#datetimepicker_2");
    console.log(date1);
    if (date1) {
        var url = $historyChart.data("url")+'?date1='+date1.val()+" "+date_1.val()+
        '&date2='+date2.val()+" "+date_2.val()
    }
    console.log($historyChart.data("url"));
    history_call(url);
}

function filter2(val) {
    console.log(val);
    var url = $historyChart.data("url")+'?filter='+val
    history_call(url);
}

filter2('month')
