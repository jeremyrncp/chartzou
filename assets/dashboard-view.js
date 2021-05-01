require("gridstack/dist/gridstack.min.css")

const { GridStack } = require("gridstack")

require('gridstack/dist/h5/gridstack-dd-native')

require('highcharts/highcharts')
require('highcharts/highcharts-more')
require('highcharts/highcharts-3d')
require('highcharts/modules/data')
require('highcharts/modules/exporting')
require('highcharts/modules/solid-gauge')

const { drawChartsAndCards } = require("./drawChartsAndCards");

const gridStack = GridStack.init()
dashboardImport.items.map(item => {
  item.locked = true
  item.content = '<div id="' + item.type + '-' + item.uid + '"></div>'
})
gridStack.load(dashboardImport.items);
drawChartsAndCards(dashboardImport)