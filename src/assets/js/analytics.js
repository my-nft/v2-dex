// var optionsVolume = {
// 	series: [
// 		{
// 			name: "Inflation",
// 			data: [],
// 		},
// 	],
// 	chart: {
// 		height: 500,
// 		type: "bar",
// 		background: "#212121",
// 		toolbar: {
// 			show: false,
// 		},
// 	},
// 	plotOptions: {
// 		bar: {
// 			borderRadius: 0,
// 			dataLabels: {
// 				position: "top", // top, center, bottom
// 			},
// 			columnWidth: "55%",
// 		},
// 	},
// 	dataLabels: {
// 		enabled: false,
// 		formatter: function (val) {
// 			return val + "%";
// 		},
// 		offsetY: -20,
// 		style: {
// 			fontSize: "12px",
// 			colors: ["#ffffff"],
// 		},
// 	},

// 	xaxis: {
// 		type: "datetime",

// 		labels: {
// 			show: true,
// 			align: "right",
// 			style: {
// 				colors: "#5d8aa8",
// 				fontSize: "16px",
// 				fontWeight: 400,
// 				cssClass: "apexcharts-xaxis-label",
// 			},
// 		},
// 		position: "bottom",
// 		axisBorder: {
// 			show: false,
// 		},
// 		axisTicks: {
// 			show: false,
// 		},
// 		crosshairs: {
// 			fill: {
// 				type: "gradient",
// 				gradient: {
// 					colorFrom: "#D8E3F0",
// 					colorTo: "#BED1E6",
// 					stops: [0, 100],
// 					opacityFrom: 0.4,
// 					opacityTo: 0.5,
// 				},
// 			},
// 		},
// 		tooltip: {
// 			enabled: true,
// 		},
// 	},
// 	yaxis: {
// 		type: "numeric",
// 		show: true,
// 		opposite: true,
// 		axisBorder: {
// 			show: false,
// 		},
// 		labels: {
// 			show: true,
// 			offsetX: 10,
// 			style: {
// 				colors: ["#5d8aa8"],
// 				fontSize: "14px",
// 				fontWeight: 400,
// 				cssClass: "apexcharts-yaxis-label",
// 			},
// 			formatter: function (val, index) {
// 				if ((val) => 0) {
// 					return val.toFixed(0);
// 				} else {
// 					return val.toFixed(9);
// 				}
// 			},
// 		},
// 	},
// 	grid: {
// 		show: false,

// 		padding: {
// 			top: 50,
// 			right: 20,
// 			bottom: 0,
// 			left: 10,
// 		},
// 	},
// 	noData: {
// 		text: "Loading...",
// 	},
// };
var optionsVolume = {
	chart: {
		type: "bar",
		toolbar: {
			show: false,
		},
		background: "#212121",
		width: "100%",
		height: 500,
	},
	series: [
		{
			name: "Price",
			data: [],
		},
	],

	plotOptions: {
		bar: {
			borderRadius: 0,

			dataLabels: {
				position: "top", // top, center, bottom
			},
			columnWidth: "70%",
		},
	},
	dataLabels: {
		enabled: false,
		formatter: function (val) {
			return val + "%";
		},
		offsetY: -20,
		style: {
			fontSize: "12px",
			colors: ["#ffffff"],
		},
	},

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
		position: "bottom",
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		crosshairs: {
			fill: {
				type: "gradient",
				gradient: {
					colorFrom: "#D8E3F0",
					colorTo: "#BED1E6",
					stops: [0, 100],
					opacityFrom: 0.4,
					opacityTo: 0.5,
				},
			},
		},
		tooltip: {
			enabled: true,
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
			offsetX: 10,
			style: {
				colors: ["#5d8aa8"],
				fontSize: "14px",
				fontWeight: 400,
				cssClass: "apexcharts-yaxis-label",
			},
			formatter: function (val, index) {
				if ((val) => 1) {
					return "$" + val.toLocaleString("en-US");
				}
			},
		},
	},
	grid: {
		show: false,

		padding: {
			top: 50,
			right: 20,
			bottom: 0,
			left: 10,
		},
	},
	noData: {
		text: "Loading...",
	},
};

var chartVolume = new ApexCharts(
	document.querySelector("#chartVolume"),
	optionsVolume
);
chartVolume.render();
