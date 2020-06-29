var randomScalingFactor = function() {
			return Math.round(Math.random() * 100);
		};

function generateConfig(title) {
    return {
			type: 'doughnut',
			plugins: [ChartDataLabels],
			data: {
				datasets: [{
				    borderColor: '#888A85',
				    borderWidth: 1,
					data: [
						barData[0][0],
						barData[0][1],
						barData[0][2],
					],
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


window.onload = function() {
    var ctx = document.getElementById('canvas4').getContext('2d');
    var ctx2 = document.getElementById('canvas5').getContext('2d');
    window.myDoughnut = new Chart(ctx, generateConfig('Année'));
//			config2.options.title.text = 'Pourcentage des températures au cours du mois'
    window.myDoughnut2 = new Chart(ctx2, generateConfig('Mois'));
};