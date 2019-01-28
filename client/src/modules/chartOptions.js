module.exports.data = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        arc: {
            borderColor: "#d6d6d6"
        }
    },
    legend: {
        display: false
    },
    scales: {
        xAxes: [{
            gridLines: {
                drawOnChartArea: false,
                color: "rgba(235, 235, 235, 1)"
            },
            ticks: {
                suggestedMax: 100,
                fontColor: "#EBEBEB"
            }
        }],
        yAxes: [{
            gridLines: {
                drawOnChartArea: false,
                color: "rgba(235, 235, 235, 1)"
            },
            ticks: {
                suggestedMax: 100,
                fontColor: "#EBEBEB"
            }
        }]
    },
    tooltips: {
        callbacks: {
            label: function (tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex];
                var currentValue = dataset.data[tooltipItem.index];
                return currentValue + "%";
            }
        }
    }
}