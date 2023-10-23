
import { useAnalyticsApi } from "../../../services/useAnalyticsApi"
import { Card, Grid} from "@mui/material";
import { useEffect, useState } from "react";
import { useDateRange } from "../../../context/DateRangeContext";
import { useFetchWrapper } from "../../../services/useFetchWrapper";
import MetricItem from "./MetricItem";
import {
    useParams,
  } from "react-router-dom";

export default function MetricCard({ instance, token, path = []}){
    const { metric } = useParams();
    const [metricData, setMetricData] = useState(null)
    const dateRange = useDateRange();
    const { getContentSinglePage } = useAnalyticsApi(
        instance.ZUID,
        token
    );

    const { getGoogleSetting } = useFetchWrapper(
        instance.ZUID,
        token
      );

    const getData = async () =>{
        const googleData = await getGoogleSetting()
        const contentData = await getContentSinglePage(
            googleData.value,
            dateRange,
            "bar",
            path,
            10
          );
        setMetricData(contentData)
    }

    useEffect(() => {
        getData();
    }, [])

    

    return(
        <>
        <Card>
            <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            >
                {metricData !== null && <MetricItem data={metricData} metric={metric} />}
            </Grid> 
        </Card>
        </>
    )
    
}