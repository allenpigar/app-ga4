import { useAnalyticsApi } from "../../../services/useAnalyticsApi"
import { useEffect, useState } from "react";
import { useDateRange } from "../../../context/DateRangeContext";
import { useFetchWrapper } from "../../../services/useFetchWrapper";
import MetricGraph from "./MetricGraph";
export default function Graph({ instance, token, path = []}){
    const [metricData, setMetricData] = useState(null)
    const [loading, setLoading] = useState(false);
    const dateRange = useDateRange();
    const { getChartData } = useAnalyticsApi(
        instance.ZUID,
        token
    );

    const { getGoogleSetting } = useFetchWrapper(
        instance.ZUID,
        token
      );

    const getData = async () =>{
        const googleData = await getGoogleSetting()
        const contentData = await getChartData(
            googleData.value,
            dateRange,
            "bar",
            path
          );
        setMetricData(contentData.chartJSData)
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            {metricData !== null && <MetricGraph data={metricData} isLoading={loading} selectedPath={path} />}
        </>
    )

}