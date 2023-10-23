import React, { useEffect, useState } from "react";
import { useDateRange } from "../../context/DateRangeContext";
import { useGoogle } from "../../context/GoogleContext";
import shelldata from "../ui/ShellData/shelldata";
import { Box } from "@mui/material";
import { PageContentTable } from "./PageContentTable";
import { PageContentGraph } from "./PageContentGraph";
import { useNotify } from "../../context/SnackBarContext";
import { useAnalyticsApi } from "../../services/useAnalyticsApi";
import { PageContentTableSummary } from "./PageContentTableSummary";
import { useSearchParams } from "react-router-dom";
import Grid from "@mui/material/Grid";

export default function PageContent({ instance, token }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getChartData, getContentPages } = useAnalyticsApi(
    instance.ZUID,
    token
  );
  const notify = useNotify();
  const dateRange = useDateRange();
  const { googleDetails } = useGoogle();
  const [selectedPagePath, setSelectedPagePath] = useState([]);
  const [chartData, setChartData] = useState(shelldata.shellBarData);
  const [googleData, setGoogleData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("q"))
      return setSelectedPagePath([searchParams.get("q")]);
    setSelectedPagePath([]);
  }, [searchParams]);

  useEffect(async () => {
    if (googleDetails) {
      try {
        setLoading(true);
        const data = await getChartData(
          googleDetails.name,
          dateRange,
          "bar",
          selectedPagePath
        );
        const tableData = await getContentPages(
          googleDetails.name,
          dateRange,
          "bar",
          selectedPagePath,
          10
        );
        setChartData(data.chartJSData);
        setTableData(tableData);
        setGoogleData(tableData.googleData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        return notify.current.error("Error : Unable to fetch analytics data.");
      }
    }
  }, [googleDetails, selectedPagePath, dateRange]);

  const onCheckChange = (event, name) => {
    if (event.target.checked)
      return setSelectedPagePath([...selectedPagePath, name]);
    setSelectedPagePath(selectedPagePath.filter((site) => site !== name));
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <PageContentGraph
            selectedPath={selectedPagePath}
            data={chartData}
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <PageContentTableSummary
            selectedPath={selectedPagePath}
            data={tableData.googleData}
            tableData={googleData}
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <PageContentTable
            selectedPagePath={selectedPagePath}
            tableData={tableData}
            onCheckChange={onCheckChange}
            isLoading={loading}
          />
        </Grid>
      </Grid>
    </>
  );
}
