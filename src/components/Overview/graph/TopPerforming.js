import { useState, useEffect } from "react";
import GraphContainer from "../../ui/GraphContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNotify } from "../../../context/SnackBarContext";
import { parseData } from "../../../utility/parseData";

export function TopPerforming({
  googleDetails,
  dateRange,
  instanceZUID,
  token,
}) {
  const notify = useNotify();
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (googleDetails) {
      try {
        setLoading(true);
        const data = await getTopTenContent();

        const truncatedData = data.tableData.data.map((row) => {
          return row.map((col) => {
            // will not attempt conversion on a path
            if (Number(col)) {
              return Number(Math.round(col + "e" + 2) + "e-" + 2);
            } else {
              return col;
            }
          });
        });

        setHeaders(data.tableData.headers);
        setData(truncatedData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        return notify.current.error("Unable to get top contents data.");
      }
    }
  }, [googleDetails, dateRange]);

  const getTopTenContent = async () => {
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
              dimensions: [{ name: "pagePath" }],
              metrics: [
                { name: "averageSessionDuration" },
                { name: "bounceRate" },
                { name: "sessions" },
              ],
              dateRanges: [
                { startDate: dateRange.startDate, endDate: dateRange.endDate },
              ],
              limit: "10",
              orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
            },
          ],
        }),
      }
    ).then((res) => res.json());

    return parseData(res, "bar");
  };

  return (
    <GraphContainer
      title="Top Performing Content"
      loading={loading}
      subTitle={
        dateRange.selectedItem === "Custom"
          ? dateRange.startDate + " to " + dateRange.endDate
          : dateRange.selectedItem
      }
    >
      {headers.length && data.length ? (
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((item) => (
                <TableCell
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {item.replace(/([A-Z])/g, " $1").trim()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data, i) => (
              <TableRow>
                {data.map((field) => (
                  <TableCell>{field}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        "No content performance data to display"
      )}
    </GraphContainer>
  );
}
