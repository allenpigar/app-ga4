
import { MetricTable } from "./MetricTable";
import { useAnalyticsApi } from "../../../services/useAnalyticsApi";
import { useDateRange } from "../../../context/DateRangeContext";
import { useEffect, useState } from "react";
import { useFetchWrapper } from "../../../services/useFetchWrapper";
export default function Table({ instance, token, path = []}){

    const { getContentPages } = useAnalyticsApi(
        instance.ZUID,
        token
    );
    const { getGoogleSetting } = useFetchWrapper(
        instance.ZUID,
        token
      );
    const [tableData, setTableData] = useState([])
    const dateRange = useDateRange();

    const getData = async () =>{
        const googleDetails = await getGoogleSetting()
        const data = await getContentPages(
            googleDetails.value,
            dateRange,
            "bar",
            path,
            10
          );
        
        setTableData(data)
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            {tableData !== null && <MetricTable
            selectedPagePath={path}
            tableData={tableData}
          />}
        </>
    )

}