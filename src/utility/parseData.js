const colors = [
  "rgba(122,86,255,0.9)",
  "rgba(54,162,235,0.9)",
  "rgba(255,206,86,0.9)",
  "rgba(65,234,212,0.9)",
  "rgba(255,0,34,0.9)",
  "rgba(86,255,122,0.9)",
  "rgba(255,86,219,0.9)",
  "rgba(255,122,86,0.9)",
  "rgba(86,219,255,0.9)",
];

const colorsArray = [...colors, ...colors, ...colors];

const cleanLabel = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const toChartJS = (data, type = "bar") => {
  let chartJSData = {
    labels: [],
    datasets: [],
  };

  data.reports[0].metricHeaders.forEach((value, i) => {
    let newDataset = {
      label: cleanLabel(value.name),
      data: [],
      backgroundColor: colorsArray[i],
    };

    if (type === "pie") {
      newDataset.backgroundColor = [];
    }

    chartJSData.datasets.push(newDataset);
  });

  data.reports[0].rows.forEach((value, i) => {
    let labelParts = [];
    value.dimensionValues.forEach((dimension) => {
      labelParts.push(dimension.value);
    });

    chartJSData.labels.push(labelParts.join(" "));

    value.metricValues.forEach((metric, index) => {
      chartJSData.datasets[index].data.push(metric.value);
      if (type === "pie") {
        chartJSData.datasets[index].backgroundColor.push(colorsArray[i]);
      }
    });
  });

  return chartJSData;
};

const toTableData = (data) => {
  let tableData = {
    headers: [],
    data: [],
  };

  data.reports[0].dimensionHeaders.forEach((header, i) => {
    tableData.headers.push(cleanLabel(header.name));
  });

  data.reports[0].metricHeaders.forEach((header, i) => {
    tableData.headers.push(cleanLabel(header.name));
  });
  data.reports[0].rows.forEach((row) => {
    let tempValue = [];

    row.dimensionValues.forEach((dimension) => {
      tempValue.push(dimension.value);
    });

    row.metricValues.forEach((metric) => {
      tempValue.push(metric.value);
    });

    tableData.data.push(tempValue);
  });

  return tableData;
};

const toGoogleUaData = (data) => {
  return {
    reports: [
      {
        columnHeader: {
          dimensions: data.reports[0].dimensionHeaders.map((val) =>
            cleanLabel(val.name)
          ),
          metricHeader: {
            metricHeaderEntries: data.reports[0].metricHeaders.map((val) => {
              return {
                name: cleanLabel(val.name),
                type: "",
              };
            }),
          },
        },
        data: {
          rows: data.reports[0].rows.map((row) => {
            return {
              dimensions: row.dimensionValues.map((val) => val.value),
              metrics: [
                {
                  values: row.metricValues.map((val) => val.value),
                },
              ],
            };
          }),
          totals: [
            {
              values: data.reports[0].totals[0]?.metricValues?.map(
                (metric) => metric.value
              ),
            },
          ],
        },
      },
    ],
  };
};

export const parseData = (data, type = "bar") => {
  return {
    chartJSData: toChartJS(data, type),
    tableData: toTableData(data),
    googleData: toGoogleUaData(data),
  };
};
