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
    xAxis: {
        visible: false,
    },
    yAxis: {
        visible: false,
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

//holders for toggle grid and sum of pie/bar data
var toggleGrid;
var pieSum;
var loadSum=0;

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

    pieSum=0;
    pieRecipe.series[0].data = pieFilling;
    for (var i = 0; i < pieRecipe.series[0].data.length; i++) {
        pieSum += pieRecipe.series[0].data[i].y
    }
    pieRecipe.title.text = Math.round(pieSum) + ' MW';
    toggleGrid = Highcharts.chart(pieRecipe);
    
}
//holder for current price
var currPrice;
//function to get the total load energy data
function getLegendInfo(idx) {
    loadSum = 0
    for (var i = 0; i < 2; i++) {
        loadSum += nonPowerData['data'][i][idx];
    }
    currPrice = nonPowerData['data'][2][idx];
}

function updateLegend(idx) {
    //get the necessary info
    getLegendInfo(idx);
    var totalPower = pieSum + loadSum;
    //row 1 info
    document.getElementById("sourceTotal").innerHTML = pieSum.toFixed(2);
    document.getElementById('avPrice').innerHTML = currPrice.toFixed(2);
    //row 2 info
    document.getElementById("windPower").innerHTML = sampledEnergy.data[0][idx].toFixed(2)
    document.getElementById("windCont").innerHTML = ((sampledEnergy.data[0][idx] / totalPower) * 100).toFixed(2) + "%"
    //row 3 info
    document.getElementById("hydPower").innerHTML = sampledEnergy.data[1][idx].toFixed(2)
    document.getElementById("hydCont").innerHTML = ((sampledEnergy.data[1][idx] / totalPower) * 100).toFixed(2) + "%"
    //row 4 info
    document.getElementById("gasPower").innerHTML = sampledEnergy.data[2][idx].toFixed(2)
    document.getElementById("gasCont").innerHTML = ((sampledEnergy.data[2][idx] / totalPower) * 100).toFixed(2) + "%"
    //row 5
    document.getElementById("distPower").innerHTML = sampledEnergy.data[3][idx].toFixed(2)
    document.getElementById("distCont").innerHTML = ((sampledEnergy.data[3][idx] / totalPower) * 100).toFixed(2) + "%"
    //row 6
    document.getElementById("coalPower").innerHTML = sampledEnergy.data[4][idx].toFixed(2)
    document.getElementById("coalCont").innerHTML = ((sampledEnergy.data[4][idx] / totalPower) * 100).toFixed(2) + "%"
    //row 7
    document.getElementById("loadPower").innerHTML = loadSum.toFixed(2);
    //row 8
    document.getElementById("expPower").innerHTML = nonPowerData.data[1][idx].toFixed(2)
    document.getElementById("expCont").innerHTML = ((nonPowerData.data[1][idx] / totalPower) * 100).toFixed(2) + "%"
    //row 9
    document.getElementById("pmPower").innerHTML = nonPowerData.data[0][idx].toFixed(2)
    document.getElementById("pmCont").innerHTML = ((nonPowerData.data[0][idx] / totalPower) * 100).toFixed(2) + "%"
    //row 10
    document.getElementById("netPower").innerHTML = totalPower.toFixed(2)
    //row 11
    var renewables = (((sampledEnergy.data[0][idx] / totalPower) + (sampledEnergy.data[1][idx] / totalPower)) * 100)
    document.getElementById("renCont").innerHTML = renewables.toFixed(2) + "%"
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
                fillPie(idx, sampledEnergy);
                updateLegend(idx);
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

var nonPowerData = {
    name: [],
    data:[]
}
var fullData;

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
        fullData = activity;

        //sample the data
        for (var i = 0; i < 6; i++) {
            if (i == 4) {
                continue;
            }
            var temp_data = activity[i];
            var to_sample = new Array();
            for (var j = 1; j < 2016; j = j + 6) {
                to_sample.push(temp_data.history.data[j]);
            }
            console.log(to_sample)
            sampledEnergy.name.push(temp_data.fuel_tech);
            sampledEnergy.data.push(to_sample);
        }
        sampledEnergy.name = sampledEnergy.name.reverse();
        sampledEnergy.data = sampledEnergy.data.reverse();

        //get the rest of the data
        for (var i = 4; i < 11; i = i + 1) {
            var temp_data = activity[i];
            var to_sample = new Array();
            
            if (i == 5 || i == 7) {
                continue;
            }
            if (temp_data.history.data.length== 2016) {
                for (var j = 0; j < 2016; j = j + 6) {
                    to_sample.push(temp_data.history.data[j]);
                }
                if (i == 9) {
                    nonPowerData.name.push(temp_data.type);
                }
                else {
                    nonPowerData.name.push(temp_data.fuel_tech);
                }
                nonPowerData.data.push(to_sample);
            }
            else {
                for (var j = 0; j < temp_data.history.data.length; j++) {
                    to_sample.push(temp_data.history.data[j]);
                }
                nonPowerData.name.push(temp_data.type);
                nonPowerData.data.push(to_sample);
            }
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
                tickInterval: 24 * 3600 * 1000
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

                snap:50,

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
                    pointStart: (activity[4].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                    data: sampledEnergy.data[0],
                    color: 'Green'
                
                },
                {
                    name: "Hydro",
                    pointStart: (activity[3].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                    data: sampledEnergy.data[1],
                    color: 'Blue'
                }, 
                {
                    name: "Gas (CCGT)",
                    pointStart: (activity[2].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                    data: sampledEnergy.data[2],
                    color: 'Orange'
                },
                {
                    name: 'Distillate',
                    pointStart: (activity[1].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                    data: sampledEnergy.data[3],
                    color: 'Red'
                }, 
                {
                    name: "Black Coal",
                    pointStart: (activity[0].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                    data: sampledEnergy.data[4],
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
                tickInterval: 24 * 3600 * 1000
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
                enabled: true,
                snap:50,
            },

            credits: {
                enabled: false
            },
        
            series: [
            {
                name: "Price",
                pointStart: (activity[8].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
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
                tickInterval: 24 * 3600 * 1000
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

                enabled: true,
                snap: 50,
              },
        
            series: [
            {
                name: "Temperature",
                pointStart: (activity[10].history.start + 5 * 60)*1000,
                    pointInterval: 1000 * 60 * 30,
                data: activity[10].history.data,
                color: 'Red'
            }
            ],
        });

        //initialize functions to load in initial data on success
        fillPie(0,sampledEnergy);
        updateLegend(0);

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
                    visible: false,
                },
                yAxis: {
                    visible: false,
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