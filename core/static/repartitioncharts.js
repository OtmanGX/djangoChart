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

function generateConfig(title, data) {
    return {
			type: 'doughnut',
			plugins: [ChartDataLabels,
    ],
			data: {
				datasets: [{
				    borderColor: '#888A85',
				    borderWidth: 1,
					data: data,
					backgroundColor: [
						window.chartColors.green2,
						window.chartColors.orange,
						window.chartColors.red2,
					],
					label: 'Pourcentages'
				}],
				labels: [
					'% Idéal',
					'% Seuil 2',
					'% Seuil 3',
				]
			},
			options: {
			    layout: {
				padding: 2
			},
			    plugins: {
                    datalabels: window.dataLabelsConfig,
                },
				responsive: true,
				legend: {
				    display: false,
					position: 'top',
				},
				animation: {
					animateScale: true,
					animateRotate: true
				}
			}
		};
}



//window.onload = function() {
    var $yearChart = $('#canvas4');
    var ctx = $yearChart[0].getContext('2d');
    var ctx2 = document.getElementById('canvas5').getContext('2d');
    var ctx3 = document.getElementById('canvas3').getContext('2d');
    var dataYear = [barData[0][0],
						barData[0][1],
						barData[0][2]]
	var dataMonth = [barData[1][0],
						barData[1][1],
						barData[1][2]]
    window.myDoughnut = new Chart(ctx, generateConfig('Année', dataYear));
//			config2.options.title.text = 'Pourcentage des températures au cours du mois'
    window.myDoughnut2 = new Chart(ctx2, generateConfig('Mois', dataMonth));


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

    window.myBar = new Chart(ctx3, {
        type: 'bar',
        plugins: [ChartDataLabels],
        data: barChartData,
        options: {
            plugins: {
                datalabels: window.dataLabelsConfig,
            },
            layout: {
				padding: 5
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
            animation: {
					animateScale: true,
					animateRotate: true
				},
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



//};

var ajaxRepartition = async function () {
    console.log("called");
    $.ajax({
        url: $yearChart.data("url"),
        success: function (data) {
            if (data.bar_result != null) {
               window.myDoughnut.data.datasets[0].data = []
               window.myDoughnut.update()
               window.myDoughnut.data.datasets[0].data = data.bar_result[0];
               window.myDoughnut.update()

               window.myDoughnut2.data.datasets[0].data = []
               window.myDoughnut2.update()
               window.myDoughnut2.data.datasets[0].data = data.bar_result[1];
               window.myDoughnut2.update()

               window.myBar.data.datasets[0].data = []
               window.myBar.data.datasets[1].data = []
               window.myBar.data.datasets[2].data = []
               window.myBar.update()
               window.myBar.data.datasets[0].data = [data.bar_result[2][0]];
               window.myBar.data.datasets[1].data = [data.bar_result[2][1]];
               window.myBar.data.datasets[2].data = [data.bar_result[2][2]];
               window.myBar.update()

            }
        }
    });
    };