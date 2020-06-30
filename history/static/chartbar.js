function generateChart(ctx, title, data) {
    return new Chart(ctx, {
            type: 'bar',
            title: {text: title, display: true},
            plugins: [ChartDataLabels],
            data: data,
            options: {
                title: {
                display: true,
                fontSize: 22,
                text: title,
                },
                plugins: {
                    ChartDataLabels: false,
//                    datalabels: window.dataLabelsConfig,
                },
                legend: {
                    display: false,
                    labels: {
                        // This more specific font property overrides the global property
                        fontSize:9,
                    }
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
//                maintainAspectRatio:false,
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: false,
                    }],
                    yAxes: [{
                        ticks: {
                            autoSkip: true,
                            beginAtZero: true,},
                        scaleLabel: {
                        display: true,
                        labelString: 'Heures',
                }
                    }]
                }
            }
        });
}



var barChartData = {
            labels: [''],
			datasets: [{
				backgroundColor: window.chartColors.green2,
				label: 'Plage Normale',
				data: [
					10
				]
			},{
				backgroundColor: window.chartColors.orange,
				label: 'Plage Alarme',
				data: [
					1
				]
			},{
				backgroundColor: window.chartColors.red2,
				label: 'Plage Arrêt',
				data: [
					3
				]
			},
			]

		};

function generateData(data) {
    return {
            labels: [''],
			datasets: [{
				backgroundColor: window.chartColors.green2,
				label: 'Plage Normale',
				data: [
					data[0]
				]
			},{
				backgroundColor: window.chartColors.orange,
				label: 'Plage Alarme',
				data: [
					data[1]
				]
			},{
				backgroundColor: window.chartColors.red2,
				label: 'Plage Arrêt',
				data: [
					data[2]
				]
			},
			]

		};

}
var ctx = document.getElementById('canvas1').getContext('2d');
var ctx2 = document.getElementById('canvas2').getContext('2d');
var ctx3 = document.getElementById('canvas3').getContext('2d');
window.myBar = generateChart(ctx, 'Jour', generateData(barData[2]))
window.myBar = generateChart(ctx2, 'Mois', generateData(barData[1]))
window.myBar = generateChart(ctx3, 'Année', generateData(barData[0]))



function filter(event) {
    var date1 = $("#datetimepicker1");
    var date_1 = $("#datetimepicker_1");
    var date2 = $("#datetimepicker2");
    var date_2= $("#datetimepicker_2");
    console.log(date1);
    var url = 'http://'+window.location.host+"/history_alarm/";
    if (date1) {
        var url = url+'?date1='+date1.val()+" "+date_1.val()+
        '&date2='+date2.val()+" "+date_2.val()
    }
    window.open(url, '_self')
}

function filter2(val) {
    console.log(val);
    console.log(window.location.host);
    var url = 'http://'+window.location.host+"/history_alarm/";
    var url = url+'?filter='+val
    window.open(url, '_self')
}