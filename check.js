'use strict';

const JSONFileName = 'https://raw.githubusercontent.com/castrojoshua18/CASTRO_A13575128_HW3/master/assets/springfield.json';

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
            event;

        for (i = 0; i < Highcharts.charts.length; i = i + 1) {
            chart = Highcharts.charts[i];
            // Find coordinates within the chart
            event = chart.pointer.normalize(e);
            // Get the hovered point
            point = chart.series[0].searchPoint(event, true);

            if (point) {
                point.highlight(e);
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


/* Add this to the xAxis attribute of each chart. */
events: {
        setExtremes: syncExtremes
    }

// Get the data. The contents of the data file can be viewed at
Highcharts.ajax({
    url: JSONFileName,
    dataType: 'text',
    success: function (activity) {

        //read in the data
        activity = JSON.parse(activity);

        //helper function for sampling; gets the sum of an array
        function calcSum(sum, to_add) {
            return sum + to_add
        }

        //sample the data
        var sampled = new Array();
        for (var i = 0; i < 7; i++) {
            var temp_data = activity[i].history.data;
            var to_sample = new Array();
            for (var j = 0; j < 2016; j += 6) {
                to_sample.push(temp_data.slice(j,j+6).reduce(calcSum,0))
            }
            sampled.push(to_sample)
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

                enabled: false
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
                    data: sampled[5],
                    color: 'Green'
                
                },
                {
                    name: "Hydro",
                    pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                    pointInterval: 1800000/5,
                    data: sampled[3],
                    color: 'Blue'
                }, 
                {
                    name: "Gas (CCGT)",
                    pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                    pointInterval: 1800000/5,
                    data: sampled[2],
                    color: 'Orange'
                },
                {
                    name: 'Distillate',
                    pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                    pointInterval: 1800000/5,
                    data: sampled[1],
                    color: 'Red'
                }, 
                {
                    name: "Black Coal",
                    pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                    pointInterval: 1800000/5,
                    data: sampled[0],
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

                enabled: false
              },

            credits: {
                enabled: false
            },
        
            series: [
            {
                name: "Price",
                pointStart: Date.UTC(2019, 0, 0, 0, 0, 1571579700, 0),
                pointInterval: 1800000/5,
                step: 'right',
                data: activity[8].history.data,
                color: 'Red'
            }
            ],
        });

        //make price chart div to hold chart
        var tempChartDiv = document.createElement('div');
        tempChartDiv.className = 'sharedChartSmall';
        document.getElementById('tempChart').appendChild(tempChartDiv);
        

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

                enabled: false
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
    }
});