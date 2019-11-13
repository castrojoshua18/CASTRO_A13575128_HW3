'use strict';

const JSONFileName = 'https://raw.githubusercontent.com/castrojoshua18/CASTRO_A13575128_HW3/master/assets/springfield.json';

//formulate how we want to make our pie chart

var pieRecipe = {
    chart: {
        renderTo: 'toggleGrid',
        className: 'toggleGrid',
        type: 'pie',
        backgroundColor: 'transparent',
        animation: false
    },
    plotOptions: {
        pie: {
            innerSize: '50%',
            size: '75%',
            dataLabels: {
                enabled: false
            }
        },
        series: {
            animation: false
        }
    },
    title: {
        align: 'center',
        verticalAlign: 'middle',
        text: '',
        style: {
            fontSize: '13px'
        }
    },
    credits: {
        enabled: false,
    },
    series: [{
        name: 'Energy',
        colorByPoint: true,
        data: []
    }]
};

var pieRecipe = {
    chart: {
        renderTo: document.getElementById('toggleGrid'),
        className: 'toggleGrid',
        type: 'pie',
        backgroundColor: 'transparent',
        animation: false
    },
    plotOptions: {
        pie: {
            innerSize: '50%',
            size: '75%',
            dataLabels: {
                enabled: false
            }
        },
        series: {
            animation: false
        }
    },
    title: {
        align: 'center',
        verticalAlign: 'middle',
        text: '',
        style: {
            fontSize: '13px'
        }
    },
    credits: {
        enabled: false,
    },
    series: [{
        name: 'Energy',
        colorByPoint: true,
        data: []
    }]
};

var dynamicColors = {
    'black_coal': 'Black', 
    'distillate': 'Red', 
    'gas_ccgt': 'Orange',
    'hydro': 'Blue',
    'wind': 'Green',
    'exports': 'Purple',
    'pumps': 'Light Blue'
};

var toggleGrid;

function fillPie(idx, data) {
    var pieFilling = data['name'].map( function (elt, fillIdx) {
        if (data.name !== "exports" & data.name !== "pumps") {
            return {
                name: elt.split('.')[elt.split('.').length - 1],
                y: sampledEnergy['data'][fillIdx][idx],
                color: dynamicColors[elt.split('.')[elt.split('.').length - 1]]
            }
        }   
    });
    
    pieRecipe.series[0].data = pieFilling;
    var pieSum = 0;
    for (var i = 0; i < pieRecipe.series[0].data.length; i++) {
        pieSum += pieRecipe.series[0].data[i].y
    }
    pieRecipe.title.text = Math.round(pieSum) + ' MW';
    toggleGrid = Highcharts.chart(pieRecipe);
}


['mouseleave'].forEach(function (eventType) {
document.getElementById('sharedGrid').addEventListener(
    eventType,
    function (e) {
        var chart,
            point,
            i,
            event;
        
            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                event = chart.pointer.normalize(e);
                point = chart.series[0].searchPoint(event, true);
                
                if (point) {
                    point.onMouseOut(); 
                    chart.tooltip.hide(point);
                    chart.xAxis[0].hideCrosshair(); 
                }
            }
        }
    )
});

['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
document.getElementById('sharedGrid').addEventListener(
    eventType,
    function (e) {
        var chart,
            point,
            i,
            event,
            idx;

        for (i = 0; i < Highcharts.charts.length; i = i + 1) {
            chart = Highcharts.charts[i];
            // Find coordinates within the chart
            event = chart.pointer.normalize(e);
            // Get the hovered point
            point = chart.series[0].searchPoint(event, true);
            idx = chart.series[0].data.indexOf( point );

            if (point) {
                point.highlight(e);
                fillPie(idx, sampledEnergy)
            }
        }
    }
);
});

/**
* Highlight a point by showing tooltip, setting hover state and draw crosshair
*/
Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
    this.series.chart.yAxis[0].drawCrosshair(event, this);
};


/**
* Synchronize zooming through the setExtremes event handler.
*/
function syncExtremes(e) {
var thisChart = this.chart;

if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
    Highcharts.each(Highcharts.charts, function (chart) {
        if (chart !== thisChart) {
            if (chart.xAxis[0].setExtremes) { // It is null while updating
                chart.xAxis[0].setExtremes(
                    e.min,
                    e.max,
                    undefined,
                    false,
                    { trigger: 'syncExtremes' }
                );
            }
        }
    });
    }
}

//holder for sampledEnergy (energy data at 30 min intervals)
var sampledEnergy = {
    name: [],
    data: []
};

/* Add this to the xAxis attribute of each chart. */
events: {
        setExtremes: syncExtremes
    }

// Get the data
Highcharts.ajax({
    url: JSONFileName,
    dataType: 'text',
    success: function (activity) {

        //read in the data
        activity = JSON.parse(activity);

        //sample the data
        for (var i = 0; i < 6; i++) {
            if (i == 4) {
                continue;
            }
            var temp_data = activity[i];
            var to_sample = new Array();
            for (var j = 0; j < 2016; j += 6) {
                to_sample.push(temp_data.history.data[j])
            }
            sampledEnergy.name.push(temp_data.fuel_tech)
            sampledEnergy.data.push(to_sample)
        }

        //attach a div to the location of the energy chart in the html file
        var energyChartDiv = document.createElement('div');
        energyChartDiv.className = 'sharedChartLarge';
        document.getElementById('energyChart').appendChild(energyChartDiv);

        //create the energy chart
        Highcharts.chart(energyChartDiv, {
            chart:{
                type: 'area',
                backgroundColor: 'transparent'
            },

            title:{
                text: 'Generation (MW)'   
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                day: '%e. %b',
                month: '%b \'%y',
                },
                tickInterval: 86400000/300000/6,
                title: {
                    enabled: false
                }
            },

            yAxis: {
                title: {
                    enabled: false
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    align: 'left',
                    reserveSpace: false,
                    y: -3,
                    x: 5,
                },
            },

            tooltip: {
                crosshairs: [{
                  width: 2,
                  color: 'red',
                  zIndex: 3
                }],

                enabled: true
              },

            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 0,
                    
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                },

                series: {
                    states: {
                      inactive: {
                        opacity: 1
                      }
                    }
                  }

            },

            credits: {
                enabled: false
            },

            series: [ //JSON DATA FOR USAGE HERE
                {
                    name: "Wind",
                    pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                    pointInterval: 1800000/5,
                    data: sampledEnergy.data[4],
                    color: 'Green'
                
                },
                {
                    name: "Hydro",
                    pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                    pointInterval: 1800000/5,
                    data: sampledEnergy.data[3],
                    color: 'Blue'
                }, 
                {
                    name: "Gas (CCGT)",
                    pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                    pointInterval: 1800000/5,
                    data: sampledEnergy.data[2],
                    color: 'Orange'
                },
                {
                    name: 'Distillate',
                    pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                    pointInterval: 1800000/5,
                    data: sampledEnergy.data[1],
                    color: 'Red'
                }, 
                {
                    name: "Black Coal",
                    pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                    pointInterval: 1800000/5,
                    data: sampledEnergy.data[0],
                    color: 'Black'
                }
            ]
        });

        //make price chart div to hold chart
        var priceChartDiv = document.createElement('div');
        priceChartDiv.className = 'sharedChartMedium';
        document.getElementById('priceChart').appendChild(priceChartDiv);
        

        Highcharts.chart(priceChartDiv, {
            chart:{
                type: 'line',
                backgroundColor: 'transparent'
            },
        
            title:{
                text: 'Price ($/MWh)'   
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                day: '%e. %b',
                month: '%b \'%y',
                },
                tickInterval: 86400000/300000/6,
                title: {
                    enabled: false
                }
            },

            yAxis: {
                title: {
                    enabled: false
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    align: 'left',
                    reserveSpace: false,
                    y: -3,
                    x: 5,
                },
            },

            line: {
                lineWidth: "1"
            },

            tooltip: {
                crosshairs: [{
                  width: 2,
                  color: 'red',
                  zIndex: 3
                }],

                enabled: true
              },

            credits: {
                enabled: false
            },
        
            series: [
            {
                name: "Price",
                pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                pointInterval: 1800000/5,
                step: 'left',
                data: activity[8].history.data,
                color: 'Red'
            }
            ],
        });

        //make temp chart div to hold chart
        var tempChartDiv = document.createElement('div');
        tempChartDiv.className = 'sharedChartSmall';
        document.getElementById('tempChart').appendChild(tempChartDiv);
        
        //make temp chart
        Highcharts.chart(tempChartDiv, {
            chart:{
                type: 'line',
                backgroundColor: 'transparent'
            },
        
            title:{
                text: 'ºF'   
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                day: '%e. %b',
                month: '%b \'%y',
                },
                tickInterval: 86400000/300000/6,
                title: {
                    enabled: false
                }
            },

            yAxis: {
                title: {
                    enabled: false
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    align: 'left',
                    reserveSpace: false,
                    y: -3,
                    x: 5,
                },
            },

            line: {
                lineWidth: "1"
            },

            credits: {
                enabled: false
            },

            tooltip: {
                crosshairs: [{
                  width: 2,
                  color: 'red',
                  zIndex: 3
                }],

                enabled: false,
                snap: 100
              },
        
            series: [
            {
                name: "Temperature",
                pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                pointInterval: 1800000/5,
                data: activity[10].history.data,
                color: 'Red'
            }
            ],
        });

        fillPie(0,sampledEnergy);

        $('#btnPie').click(function() {
            toggleGrid.update({
                chart: {
                    type: 'pie',
                },
                plotOptions: {
                    pie: {
                        innerSize: '50%',
                        size: '75%',
                        dataLabels: {
                            enabled: false
                        }
                    },
                    series: {
                        animation: false
                    }
                },
                title: {
                    align: 'center',
                    verticalAlign: 'middle',
                    text: '',
                    style: {
                        fontSize: '13px'
                    },
                    enabled: true,
                },
            })
        }
        )

        $('#btnTable').click(function() {
            toggleGrid.update({
                chart: {
                    type: 'bar',
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                xAxis: {
                    title: {
                        enabled: false
                    }
                },
                yAxis: {
                    title: {
                        enabled: false
                    }
                },
                legend: {
                        enabled: false,
                },
                title: {
                    align: 'right',
                    verticalAlign: 'bottom',
                    text: '',
                    style: {
                        fontSize: '13px'
                    },
                    enabled: false,
                },
            })
        }
        )
    }
});