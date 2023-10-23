import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import GraphContainer from "../../ui/GraphContainer";
import { useNotify } from "../../../context/SnackBarContext";
import { parseData } from "../../../utility/parseData";

export const PageviewTraffic = ({
  instanceZUID,
  googleDetails,
  dateRange,
  data,
  token,
}) => {
  const notify = useNotify();
  const [chartData, setChartData] = useState(data);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (googleDetails) {
      try {
        setLoading(true);
        const data = await getBarChartData();
        setChartData(data.chartJSData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        return notify.current.error("Unable to fetch Page View Traffic data.");
      }
    }
  }, [googleDetails, dateRange]);

  const getBarChartData = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_SERVICE_GOOGLE_ANALYTICS_GA4_READ}/?zuid=${instanceZUID}`,
      {
        method: "POST",
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          property: googleDetails.name,
          requests: [
            {
              dimensions: [
                {
                  name: "date",
                },
              ],
              metrics: [
                {
                  name: "screenPageViews",
                },
                {
                  name: "sessions",
                },
              ],
              dateRanges: [
                {
                  startDate: dateRange.startDate,
                  endDate: dateRange.endDate,
                },
              ],
              orderBys: [
                {
                  dimension: {
                    orderType: "ALPHANUMERIC",
                    dimensionName: "date",
                  },
                },
              ],
              keepEmptyRows: true,
            },
          ],
        }),
      }
    ).then((res) => res.json());

    return parseData(res, "bar");
  };

  return (
    <GraphContainer
      title="Pageview Traffic"
      subTitle={
        dateRange.selectedItem === "Custom"
          ? dateRange.startDate + " to " + dateRange.endDate
          : dateRange.selectedItem
      }
      loading={loading}
    >
      <Line
        data={chartData}
        // width={500}
        height={553}
        options={{
          maintainAspectRatio: false,
          bezierCurve: false,
          scales: {
            yAxes: [
              {
                display: true,
              },
            ],
            xAxes: [
              {
                display: false,
              },
            ],
          },
          options: {
            legend: {
              display: true,
              position: "bottom",
            },
          },
        }}
      />
    </GraphContainer>
  );
};
