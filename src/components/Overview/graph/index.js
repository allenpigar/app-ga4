import { InboundTraffic } from "./InboundTraffic";
import { PageviewTraffic } from "./PageviewTraffic";
import { TopPerforming } from "./TopPerforming";
import { SocialTraffic } from "./SocialTraffic";
import { useParams } from "react-router-dom";
import { useDateRange } from "../../../context/DateRangeContext";
import { useFetchWrapper } from "../../../services/useFetchWrapper";
import { useEffect, useState } from "react";
import shelldata from "../../ui/ShellData/shelldata";
export default function OverviewGraph({instance, token}){

    const { type } = useParams();

    const { getGoogleSetting } = useFetchWrapper(
        instance.ZUID,
        token
      );
    const dateRange = useDateRange();
    const [ googleDetails, setGoogleDetails ] = useState(null)

    const getProperty = async () => {
        const googleSetting = await getGoogleSetting()
        if(googleSetting){
            setGoogleDetails({ name : googleSetting.value })
        }
    }
    
    useEffect(() => {
        getProperty()
    }, [])

    return (
        <>
           {googleDetails !== null && type === "pageview-traffic" &&  
                <PageviewTraffic
                        instanceZUID={instance.ZUID}
                        googleDetails={googleDetails}
                        data={shelldata.shellBarData}
                        dateRange={dateRange}
                        token={token}
                    />
            }
            {googleDetails !== null && type === "inbound-traffic" &&  
                <InboundTraffic
                    instanceZUID={instance.ZUID}
                    googleDetails={googleDetails}
                    data={shelldata.shellDoughnutData}
                    dateRange={dateRange}
                    token={token}
                    />
            }
            {googleDetails !== null && type === "social-traffic" &&  
                <SocialTraffic
                    instanceZUID={instance.ZUID}
                    googleDetails={googleDetails}
                    dateRange={dateRange}
                    data={shelldata.shellDoughnutData}
                    token={token}
                    />
            }
            {googleDetails !== null && type === "top-performing" &&  
                <TopPerforming
                    instanceZUID={instance.ZUID}
                    googleDetails={googleDetails}
                    dateRange={dateRange}
                    token={token}
                />
            }
        </>
    )

}