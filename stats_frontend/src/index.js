import {Chart, registerables, Tooltip} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';

Chart.register(zoomPlugin, ...registerables);

const charDiv = document.getElementById("chart");
const ctx = document.getElementById('myChart');


function transformStatusEntry(timestamp, status) {
  return {
    date: new Date(timestamp * 1000),
    status: status
  }
}

function transformStatusData(statusData) {
  let lastStatusEntry = statusData.shift();
  let wasPowerOff = false
  let result = [];

  for (const currentStatusEntry of statusData) {
    if (currentStatusEntry[0] - lastStatusEntry[0] > 300) {
      result.push(transformStatusEntry(lastStatusEntry[0], lastStatusEntry[1]));
      result.push(transformStatusEntry(lastStatusEntry[0] + 60, 1 - lastStatusEntry[1]));
      wasPowerOff = true;
    }
    if (wasPowerOff) {
      wasPowerOff = false
      result.push(transformStatusEntry(currentStatusEntry[0] - 60, 1 - currentStatusEntry[1]))

      result.push(transformStatusEntry(currentStatusEntry[0], currentStatusEntry[1]))
    }

    lastStatusEntry = currentStatusEntry;
  }

  result.push(transformStatusEntry(Date.now()/1000, result[result.length-1].status))

  return result
}
let tooltipCoords = {x: 0, y: 0}

function titleHandler(tooltipItems) {
  console.log(arguments)
  let event = tooltipItems[0]
  let msBetweenChartEnds = event.chart.scales.x.max - event.chart.scales.x.min
  let msInOneXPixel = msBetweenChartEnds / event.chart.width

  let currentTimestamp = event.chart.scales.x.min + (tooltipCoords.x * msInOneXPixel)
  const currentDate = new Date(currentTimestamp)
  return currentDate.toLocaleString('en-US')
}


Tooltip.positioners.op = function (elements, coords) {
  //tooltipCoords = coords
  return coords;
};

function renderPlot(data) {
  console.log(data)
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(e => e.date),
      datasets: [{
        label: 'Status',
        data: data.map(e => e.status),
        borderWidth: 1,
        fill: true
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'x'
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      onHover: (e) => {tooltipCoords=e},

      scales: {
        x: {
          type: 'time',
          timeseries: {
            unit: 'day',
            displayFormats: {
              'hour': 'DD-MMM HH:mm'
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          position: 'op',
          callbacks: {
            title: titleHandler

          }
        },
        zoom: {
          limits: {
            x: {minRange: 24 * 60 * 60 * 1000},
          },
          pan: {
            enabled: true,
            mode: 'x'
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
          }
        }
      }

    }
  });
}

async function getData() {
  const response = await fetch('./src/data.json');
  const rawStatusData = (await response.json())
  let data = transformStatusData(rawStatusData);

  return data
}

async function init() {
  const data = await getData();
  renderPlot(data);
}

init()
