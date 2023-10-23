import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import GraphContainer from "../../ui/GraphContainer";
import { useNotify } from "../../../context/SnackBarContext";
import { parseData } from "../../../utility/parseData";

export const InboundTraffic = ({
  data,
  instanceZUID,
  googleDetails,
  dateRange,
  token,
}) => {
  const notify = useNotify();
  const [chartData, setChartData] = useState(data);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (googleDetails) {
      try {
        setLoading(true);
        const data = await getInboundTraffic();
        setChartData(data.chartJSData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        return notify.current.error("Unable to fetch Inbound traffic data.");
      }
    }
  }, [googleDetails, dateRange]);

  const getInboundTraffic = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_SERVICE_GOOGLE_ANALYTICS_GA4_READ}/?zuid=${instanceZUID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          property: googleDetails.name,
          requests: [
            {
              dimensions: [{ name: "firstUserDefaultChannelGroup" }],
              metrics: [{ name: "sessions" }],
              dateRanges: [
                { startDate: dateRange.startDate, endDate: dateRange.endDate },
              ],
              dimensionFilter: {
                notExpression: {
                  filter: {
                    fieldName: "firstUserDefaultChannelGroup",
                    stringFilter: { matchType: "EXACT", value: "(not set)" },
                  },
                },
              },
            },
          ],
        }),
      }
    ).then((res) => res.json());

    return parseData(res, "pie");
  };

  return (
    <GraphContainer
      title="Inbound Traffic"
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
