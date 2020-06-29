var barChartData = {
            labels: [''],
			datasets: [{
				label: 'T Normale %',
				backgroundColor: window.chartColors.green2,
				data: [
					barData[2][0],
				]
			}, {
				label: 'Seuil 2 %',
				backgroundColor: window.chartColors.orange,
				data: [
					barData[2][1],
				]
			}, {
				label: 'Seuil 3 %',
				backgroundColor: window.chartColors.red2,
				data: [
					barData[2][2],
				]
			}]

		};
        var ctx = document.getElementById('canvas3').getContext('2d');
        window.myBar = new Chart(ctx, {
            type: 'bar',
            plugins: [ChartDataLabels],
            data: barChartData,
            options: {
                plugins: {
                    datalabels: window.dataLabelsConfig,
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
                        stacked: true, scaleLabel: {
                    display: true,
                    labelString: 'Pourcentage %',
                }
                    }]
                }
            }
        });