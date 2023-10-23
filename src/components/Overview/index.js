import shelldata from "../ui/ShellData/shelldata";
import { PageviewTraffic } from "./graph/PageviewTraffic";
import { InboundTraffic } from "./graph/InboundTraffic";
import { SocialTraffic } from "./graph/SocialTraffic";
import { TopPerforming } from "./graph/TopPerforming";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useGoogle } from "../../context/GoogleContext";
import { useDateRange } from "../../context/DateRangeContext";

export default function Overview({ instance, token }) {
  const { googleDetails, setGoogleDetails } = useGoogle();
  const dateRange = useDateRange();

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7} lg={7}>
          <PageviewTraffic
            instanceZUID={instance.ZUID}
            googleDetails={googleDetails}
            data={shelldata.shellBarData}
            dateRange={dateRange}
            token={token}
          />
        </Grid>
        <Grid item xs={12} md={5} lg={5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                marginBottom: 4,
              }}
            >
              <InboundTraffic
                instanceZUID={instance.ZUID}
                googleDetails={googleDetails}
                data={shelldata.shellDoughnutData}
                dateRange={dateRange}
                token={token}
              />
            </Box>
            <Box>
              <SocialTraffic
                instanceZUID={instance.ZUID}
                googleDetails={googleDetails}
                dateRange={dateRange}
                data={shelldata.shellDoughnutData}
                token={token}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TopPerforming
            instanceZUID={instance.ZUID}
            googleDetails={googleDetails}
            dateRange={dateRange}
            token={token}
          />
        </Grid>
      </Grid>
    </>
  );
}
// );
