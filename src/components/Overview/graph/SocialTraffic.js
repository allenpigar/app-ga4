import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import GraphContainer from "../../ui/GraphContainer";
import { useNotify } from "../../../context/SnackBarContext";
import { parseData } from "../../../utility/parseData";

export const SocialTraffic = ({
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
        const data = await getSocialTraffic();
        setChartData(data.chartJSData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        return notify.current.error("Unable to fetch social traffic data.");
      }
    }
  }, [googleDetails, dateRange]);

  const getSocialTraffic = async () => {
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
                  name: "firstUserSource",
                },
              ],
              metrics: [
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
              limit: 10,
              orderBys: [
                {
                  metric: {
                    metricName: "sessions",
                  },
                  desc: true,
                },
              ],
            },
          ],
        }),
      }
    ).then((res) => res.json());

    return parseData(res, "pie");
  };

  return (
    <GraphContainer
      title="Social Traffic"
      subTitle={
        dateRange.selectedItem === "Custom"
          ? dateRange.startDate + " to " + dateRange.endDate
          : dateRange.selectedItem
      }
      loading={loading}
    >
      <Doughnut
        data={chartData}
        // width={250}
        height={220}
        options={{
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: "left",
          },
        }}
      />
    </GraphContainer>
  );
};
