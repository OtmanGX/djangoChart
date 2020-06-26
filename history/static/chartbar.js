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
                        scaleLabel: {
                    display: true,
                    labelString: 'Hours',
                }
                    }]
                }
            }
        });
}

var barChartData = {
            labels: ['Plages'],
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
        var ctx = document.getElementById('canvas1').getContext('2d');
        var ctx2 = document.getElementById('canvas2').getContext('2d');
        var ctx3 = document.getElementById('canvas3').getContext('2d');
        window.myBar = generateChart(ctx, 'Jour', barChartData)
        window.myBar = generateChart(ctx2, 'Mois', barChartData)
        window.myBar = generateChart(ctx3, 'Année', barChartData)