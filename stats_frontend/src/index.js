import * as Plot from "@observablehq/plot";

const charDiv = document.getElementById("chart");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");

startDateInput.value = "2023-02-01"
endDateInput.value = new Date().toISOString().substring(0, 10)

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

  return result
}

function renderPlot(data) {
  console.log(data)
  let plot = Plot.plot({
    marks: [
      Plot.areaY(data, {
        filter: d => !d.status,
        x: "date",
        y2: "status",
        fill: "#eee"
      }),
      Plot.areaY(data, {
        x: "date",
        y2: "status",
        fill: "steelblue"
      })
    ]
  })

  charDiv.innerHTML = ''
  charDiv.append(plot)
}

async function getData(startDate, endDate) {
  const response = await fetch('./src/data.json');
  const rawStatusData = (await response.json())
  let data = transformStatusData(rawStatusData);

  return data.filter(entry => {
    return entry.date > startDate && entry.date <= endDate
  })
}

async function init() {
  const data = await getData(new Date(startDateInput.value), new Date(endDateInput.value));
  renderPlot(data);

  [startDateInput, endDateInput].forEach(inp => inp.addEventListener("change", async (e) => {
    const data = await getData(new Date(startDateInput.value), new Date(endDateInput.value))
    renderPlot(data)
  }))
}

init()


// console.log(chart)
//
//
//
// let col = ['status', ...transformStatusData(rawStatusData)]
// console.log(col)
//
// c3.generate({
//   bindto: "#chart",
//   zoom: {
//     enabled: true
//   },
//   axis: {
//     x: {
//         type: 'timeseries' // this needed to load string x value
//     },
//     status: {
//       type: 'category',
//       categories: [1, 0]
//     }
// },
//   data: {
//     x: 'x',
//     columns: [
//       ['x', ...(transformStatusData(rawStatusData).map(x=>x.date))],
//       ['status', ...transformStatusData(rawStatusData).map(x=>x.status)]
//     ],
//     types: {
//       status: 'line'
//     }
//   }
// });

