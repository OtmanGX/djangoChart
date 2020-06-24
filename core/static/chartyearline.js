var presets = window.chartColors;
		function generateArray(val, repeat) {
        array = new Array();
        for (var i=0;i<repeat;i++)
          array.push(val);
          return array
		}
		var utils = Samples.utils;
		var inputs = {
			min: 10,
			max: 50,
			count: 12,
			decimals: 2,
			continuity: 0
		};

		function generateData() {
			return utils.numbers(inputs);
		}

		function generateLabels() {
			return utils.months({count: inputs.count});
		}

		utils.srand(42);

		var data = {
			labels: generateLabels(),
			datasets: [{
				backgroundColor: utils.transparentize(presets.black),
				borderColor: presets.green,
				data: generateArray(14, 12),
				hidden: false,
                fill: 'start',
				label: 'D0'
			}, {
				backgroundColor: utils.transparentize(presets.green3),
				borderColor: presets.orange,
				data: generateArray(18, 12),
				label: 'D1',
				fill: 'origin'
			}, {
				backgroundColor: utils.transparentize(presets.orange),
				borderColor: presets.red2,
				data: generateArray(21, 12),
				label: 'D2',
				fill: 1
			}, {
				backgroundColor: utils.transparentize(presets.red2),
				borderColor: presets.red2,
				data: generateArray(23 ,12),
				label: 'D3',
				fill: 'start'
			},
			{
            label: 'Temp °C',
            fontColor: '#ffffff',
            backgroundColor: utils.transparentize(presets.red),
            borderColor: window.chartColors.yellow2,
            data: [12, 20 ,23,18,17,16,13, 11, 20, 23, 24 , 21],
            pointRadius: 4,
            fill: '-1',
            lineTension: 0.4,
            borderWidth: 2
        }]
		};

		var options = {
		    responsive: true,
//			maintainAspectRatio: false,
			spanGaps: false,
			elements: {
				line: {
					tension: 0.000001
				}
			},
			scales: {
			    xAxes: [{

            ticks:{
            fontColor: '#ffffff',
            }}],
				yAxes: [{
				    ticks:{
				    fontColor: '#ffffff',
				    },
					stacked: false
				}]
			},
			plugins: {
				filler: {
					propagate: false
				},
				'samples-filler-analyser': {
					target: 'chart-analyser'
				}
			}
		};

//		var chart = new Chart('canvas2', {
//			type: 'line',
//			data: data,
//			options: options
//		});
