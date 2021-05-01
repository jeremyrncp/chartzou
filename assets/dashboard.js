require("gridstack/dist/gridstack.min.css")

const swal = require('sweetalert')
const { GridStack } = require("gridstack")
const generateId = require('../utils/generateId.util');
const { CardEditor } = require('bootstrap-card-editor/src/card-editor')
const { DynamicFetcher } = require('bootstrap-card-editor/src/dynamic-fetcher');
const { drawChartsAndCards } = require("./drawChartsAndCards");
require('gridstack/dist/h5/gridstack-dd-native')

require('highcharts/highcharts')
require('highcharts/highcharts-more')
require('highcharts/highcharts-3d')
require('highcharts/modules/data')
require('highcharts/modules/exporting')
require('highcharts/modules/solid-gauge')

let dashboard = {
  items: [],
  charts: {
    project: {},
    conf: {}
  },
  cards: {}
};
let currentUidItem = null;

if ((typeof dashboardImport) !== 'undefined') {
  dashboard = dashboardImport;
}

const getContentByType = (item, type) => {
  if (type === 'card') {
    return '<div class="text-right p-1"><button class="btn btn-sm btn-primary btn-edit-card" data-uid="' + item.uid + '">Edit card</button> <button class="btn btn-sm btn-danger" data-uid="' + item.uid + '">remove</button></div> <div id="card-' + item.uid + '"></div>'
  }

  return '<div class="text-right p-1"><button class="btn btn-sm btn-primary btn-edit-chart" data-uid="' + item.uid + '">Edit chart</button> <button class="btn btn-sm btn-danger" data-uid="' + item.uid + '">remove</button></div> <div id="chart-' + item.uid + '"></div>'
}

const gridStack = GridStack.init()
dashboard.items.map(item => {
  item.content = getContentByType(item, item.type)
})
gridStack.load(dashboard.items);
drawChartsAndCards(dashboard)
gridStack.on('change', (event, items) => {
  drawChartsAndCards(dashboard)
})

const addCard = document.querySelector('#add-card')
addCard.addEventListener('click', (event) => {
  let uid = generateId()
    gridStack.addWidget({w: 3, content: '<div class="text-right p-1"><button class="btn btn-sm btn-primary btn-edit-card" data-uid="' + uid + '">Edit card</button> <button class="btn btn-sm btn-danger" data-uid="' + uid + '">remove</button></div> <div id="card-' + uid + '"></div>', uid: uid, type: "card"})
    listBtnRemove()
});

const addGraph = document.querySelector('#add-graph')
addGraph.addEventListener('click', (event) => {
  let uid = generateId()
    gridStack.addWidget({w: 3, content: '<div class="text-right p-1"><button class="btn btn-sm btn-primary btn-edit-chart" data-uid="' + uid + '">Edit chart</button> <button class="btn btn-sm btn-danger" data-uid="' + uid + '">remove</button></div> <div id="chart-' + uid + '"></div>', uid: uid, type: "chart"})
    listBtnRemove()
});

const listBtnRemove = () => {
  document.querySelectorAll("button.btn-danger").forEach(elm => {
    elm.addEventListener('click', () => {
      gridStack.removeWidget(elm.parentNode.parentNode.parentNode)
      let uid = elm.attributes.getNamedItem('data-uid').value
      delete dashboard.charts.conf[uid]
      delete dashboard.charts.project[uid]
      delete dashboard.cards[uid]
    });
  });

  /**
   * Card gestion
   */
  document.querySelectorAll("button.btn-edit-card").forEach(elm => {
    let uid = elm.attributes.getNamedItem('data-uid').value

    elm.addEventListener('click', () => {
      currentUidItem = uid;
      const cardEditor = dashboard.cards[uid] === undefined ? new CardEditor() : new CardEditor(dashboard.cards[uid], new DynamicFetcher(dashboard.cards[uid].dynamic));
      cardEditor.modalEditor()
    });
  });

  document.addEventListener("cardEditorConfigure", (event) => {
    dashboard.cards[currentUidItem] = event.detail
    const newCardEditor = new CardEditor(event.detail, new DynamicFetcher(event.detail.dynamic))
    newCardEditor.render(document.querySelector("#card-" + currentUidItem))
    document.removeEventListener("cardEditorConfigure")
  });


  

  /**
   * Chart gestion
   */
  document.querySelectorAll("button.btn-edit-chart").forEach(elm => {
    let uid = elm.attributes.getNamedItem('data-uid').value

    elm.addEventListener('click', () => {
      var modal = highed.ModalEditor(false, {
            defaultChartOptions: dashboard.charts.project[uid] ? dashboard.charts.project[uid] : {},
            allowDone: true,
            features: 'import templates customize welcome done',
            importer: {
                options: 'plugins csv json samples'
            }
        }, function (chart) {
          dashboard.charts.project[uid] = JSON.stringify(chart.toProject()) //use editor.chart.loadProject(<project data>) to load data project
          dashboard.charts.conf[uid] = JSON.stringify(chart.export.json())

          drawChartsAndCards(dashboard)
        });

      if(dashboard.charts.project[uid]) {
        modal.editor.chart.loadProject(JSON.parse(dashboard.charts.project[uid]))
      }
      modal.show()
    });
  });
}
listBtnRemove()








const saveDashboard = document.querySelector('#save-dashboard')
saveDashboard.addEventListener('click', (event) => {
const nameDashboard = document.querySelector('#name-dashboard').value;


  if (nameDashboard == '') {
    swal('Name is empty')
  } else {
    dashboard.name = document.querySelector('#name-dashboard').value,
    dashboard.items = gridStack.save()

    const myInit = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dashboard),
      mode: 'cors',
      cache: 'default'
    };
    const myRequest = new Request('/api/dashboard/', myInit);
    fetch(myRequest,myInit)
    .then((response) => {
       if (response.status === 200) {
        response.json().then(data => {
          dashboard.id = data.id
          swal('Dashbord saved')
        })
       } else {
        swal('Error :' + error)
       }
    })
    .catch((error) => {
      swal('Error :' + error)
    });
  }
});