# DSC106 HW3

## Code Functionality
The way that the code works is before successfully loading in the JSON file data, functions and variables are used to hold and filter imported data for references across multiple charts and to ensure that all the charts are appropriately synced. The important files function as follows:
* *index.html* - provides the layout for the dashboard to hold the charts
* *main.js* - holds the JavaScript to create charts using the Highcharts library
* *main.css* - standardizes the stylistic choices of the charts, tables, etc.,
* */assets* - holds the external sources used in the dashboard

## Display Functionality and Aesthetics
I feel that I was very successful in replicating the dashboard to the best of my ability. The following critiques are that which I currently see and could be points of improvement for those who wish to continue with this project.

### What worked?
The dashboard itself is very clean. The charts represent the data well, and the synchronization between charts to tool tips along the charts and information displayed on the righthand side of the dashboard flow very well. Colors remained consistent across all the charts and representations. In smaller details, the buttons toggle between the bar chart and pie chart well.

### What could be improved?
There are certain functionality and aesthetic details that could be improved. The critiques comes as follows:
* Master DateTime Object could be added in the top right corner
* CSS class to prevent the righthand side charts from wiggling when zooming through the lefthand side synchronised charts.
* Button placement to be moved in between the toggle-chart and the legend
* Add lines to the legend so that it is easier to consume from right to left

## Citations
* [Highcharts Area Chart reference] (https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/area-basic/)
* [Highcharts Line Chart reference] (https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/line-basic/)
* [Highcharts Pie Chart reference] (https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/pie-basic/)
* [Highcharts Bar Chart reference] (https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/bar-basic/)
* [Highcharts Synchronised Charts reference] (https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/synchronized-charts/)
* [Markdown Tutorial] (https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)