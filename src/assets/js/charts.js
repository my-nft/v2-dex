var options = {
	chart: {
		type: "area",
		toolbar: {
			show: false,
		},

		width: "100%",
		height: 500,
	},
	series: [
		{
			name: "Price",
			data: [],
		},
	],

	xaxis: {
		type: "datetime",
		labels: {
			show: true,
			align: "right",
			style: {
				colors: "#5d8aa8",
				fontSize: "16px",
				fontWeight: 400,
				cssClass: "apexcharts-xaxis-label",
			},
		},
	},
	yaxis: {
		type: "numeric",
		show: true,
		opposite: true,
		axisBorder: {
			show: false,
		},
		labels: {
			show: true,
			style: {
				colors: ["#5d8aa8"],
				fontSize: "12px",
				fontWeight: 400,
				cssClass: "apexcharts-yaxis-label",
			},
			formatter: function (val, index) {
				if (val > 1) {
					return val.toFixed(0);
				} else {
					return val.toFixed(9);
				}
			},
		},
	},
	grid: {
		show: true,
		borderColor: "#90A4AE",
		strokeDashArray: 0,
		position: "back",
		xaxis: {
			lines: {
				show: false,
			},
		},
		yaxis: {
			lines: {
				show: true,
			},
		},
		row: {
			colors: undefined,
			opacity: 0.5,
		},
		column: {
			colors: undefined,
			opacity: 0.5,
		},
		padding: {
			top: 50,
			right: 20,
			bottom: 0,
			left: 10,
		},
	},

	markers: {
		colors: ["#ffffff"],
	},
	dataLabels: {
		enabled: false,
	},
	fill: {
		type: "gradient",
		gradient: {
			shade: "dark",
			type: "horizontal",
			shadeIntensity: 0.5,
			gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
			inverseColors: true,
			opacityFrom: 1,
			opacityTo: 1,
			stops: [0, 50, 100],
			colorStops: [],
		},
	},

	stroke: {
		curve: "smooth",
	},
	noData: {
		text: "Loading...",
	},
};
var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();
// var options = {
// 	chart: {
// 		height: 380,
// 		width: "100%",
// 		type: "area",
// 		animations: {
// 			initialAnimation: {
// 				enabled: false,
// 			},
// 		},
// 	},
// 	series: [
// 		{
// 			name: "Series 1",
// 			data: [
// 				[1486684800000, 34],
// 				[1486771200000, 43],
// 				[1486857600000, 31],
// 				[1486944000000, 43],
// 				[1487030400000, 33],
// 				[1487116800000, 52],
// 			],
// 		},
// 	],
// 	xaxis: {
// 		type: "datetime",
// 	},
// };
