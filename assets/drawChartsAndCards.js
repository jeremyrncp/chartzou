const { CardEditor } = require('bootstrap-card-editor/src/card-editor');
const { DynamicFetcher } = require('bootstrap-card-editor/src/dynamic-fetcher');

const drawChartsAndCards = (dashboard) => {
  Object.keys(dashboard.charts.conf).map((uid) => {
    Highcharts.chart('chart-' + uid, JSON.parse(dashboard.charts.conf[uid]));
  });

  Object.keys(dashboard.cards).map((uid) => {
    const cardEditor = new CardEditor(dashboard.cards[uid], new DynamicFetcher(dashboard.cards[uid].dynamic));
    cardEditor.render(document.querySelector("#card-" + uid));
  });
};
exports.drawChartsAndCards = drawChartsAndCards;
