import {  Grid, Box, Typography } from "@mui/material";
import moment from "moment";
export default function MetricItem({data, metric = null}){

    const Item = ({label, value}) => {
        return (<>
        <Grid item sx={{ padding: 3 }}>
        <Typography
          sx={{ fontWeight: "bold", fontSize: "10pt", color: "#5b667d" }}
        >
          {label}
        </Typography>
        <Box sx={{ marginTop: "5px" }}>
          <Typography
            color="secondary"
            sx={{ fontSize: "18pt", fontWeight: "bold", marginBottom: "5px" }}
          >
            {value}
          </Typography>
         
          <Typography
            sx={{ fontSize: "10pt", color: "#5b667d" }}
          >Last 7 Days</Typography>
        </Box>
      </Grid></>)
    }
    const AvgSessionDuration = () => {
        let sessionDur = data.googleData.reports[0].data.rows[0].metrics[0].values[0]
        sessionDur = moment().startOf("day").seconds(Number(sessionDur)).format("HH:mm:ss");
        return (
            <>
                <Item label="Average Session Duration" value={sessionDur} />
            </>
        )
    }
    const BounceRate = () => {
        let bounceRate = data.googleData.reports[0].data.rows[0].metrics[0].values[1]
        bounceRate = Number(bounceRate).toFixed(2)
        return (
            <>
                <Item label="Bounce Rate" value={bounceRate} />
            </>
        )
    }
    
    const PageValue = () => {
        let pageValue = data.googleData.reports[0].data.rows[0].metrics[0].values[2]
        return (
            <>
                <Item label="Page Value" value={pageValue} />
            </>
        )
    }
    const PageViews = () => {
        let pageViews = data.googleData.reports[0].data.rows[0].metrics[0].values[3]
        return (
            <>
                <Item label="Page Views" value={pageViews} />
            </>
        )
    }
    const EventPerSession = () => {
        let eventPerSession = data.googleData.reports[0].data.rows[0].metrics[0].values[4]
        eventPerSession = Number(eventPerSession).toFixed(2)
        return (
            <>
                <Item label="Event Per Session" value={eventPerSession} />
            </>
        )
    }
    const Conversions = () => {
        let conversion = data.googleData.reports[0].data.rows[0].metrics[0].values[5]
        return (
            <>
                <Item label="Conversions" value={conversion} />
            </>
        )
    }



    return (
        <>
            {metric === "bounce-rate" && <BounceRate />}
            {metric === "avg-session-duration" && <AvgSessionDuration />}
            {metric === "page-value" && <PageValue />}
            {metric === "page-views" && <PageViews />}
            {metric === "event-per-session" && <EventPerSession />}
            {metric === "conversions" && <Conversions />}
            {metric === null && (
                <>
                    <BounceRate />
                    <AvgSessionDuration />
                    <PageValue />
                    <PageViews />
                    <EventPerSession />
                    <Conversions />
                </>
            )}
        </>
    )
}