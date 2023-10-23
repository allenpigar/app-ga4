import React, { useEffect, useState } from "react";
import { CustomDatePicker } from "../DatePicker/DatePicker";
import DomainPicker from "../DomainPicker/DomainPicker";
import { Box, Typography, Paper } from "@mui/material";
import { useGoogle } from "../../../context/GoogleContext";
import { useFetchWrapper } from "../../../services/useFetchWrapper";
import { useAnalyticsApi } from "../../../services/useAnalyticsApi";
import SearchBar from "../SearchBar/SearchBar";

export default function NavBar({ zuid, token }) {
  const { getGaDomain } = useAnalyticsApi(zuid, token);
  const { googleDetails, setGoogleDetails, setIsAuthenticated } = useGoogle();
  const [domainList, setDomainList] = useState([]);
  const { getGoogleSetting, updateSetting, createGa4Setting } = useFetchWrapper(
    zuid,
    token
  );
  const [googleProfile, setGoogleProfile] = useState(null);
  const [showSelection, setShowSelection] = useState(false);

  useEffect(async () => {
    try {
      const domains = await getGaDomain();
      setDomainList(domains.properties);
      setIsAuthenticated(true);
    } catch (err) {
      console.log(err);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(async () => {
    if (domainList && domainList.length !== 0) {
      let gData = await getGoogleSetting();
      if (!gData) {
        await createGa4Setting();
        gData = await getGoogleSetting();
      }
      const selectedProfile = domainList.find(
        (domain) => domain.name === gData.value
      );

      if (gData.value === "") setShowSelection(true);
      setGoogleProfile(gData);
      setGoogleDetails(selectedProfile);
    }
  }, [domainList]);

  const onDomainSelect = async (domain) => {
    setGoogleDetails(domain);

    var property = googleProfile;
    property["value"] = domain.name;

    await updateSetting(property.ZUID, property);
  };

  return (
    <>
      <Paper
        square
        sx={{
          display: "flex",
          paddingBottom: "0px",
          alignItems: "center",
          gap: 4,
          position: "fixed",
          backgroundColor: "#fff",
          left: 0,
          right: 0,
          top: 0,
          paddingBottom: 2,
          paddingTop: 2,
          paddingLeft: 4,
          paddingRight: 4,
          zIndex: 20,
        }}
      >
        <Box>
          {googleDetails && (
            <>
              <Box sx={{ display: "flex", minWidth: 250 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: "600",
                    fontSize: "16pt",
                    color: "#5b667d",
                  }}
                >
                  {googleDetails
                    ? googleDetails.displayName
                    : "No Domain Selected"}
                </Typography>
                <DomainPicker
                  domainList={domainList}
                  onSelect={onDomainSelect}
                  domainSelect={googleDetails}
                  buttonName="Change"
                  variant="text"
                  size="small"
                />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: "200",
                  fontSize: "12pt",
                  color: "#5b667d",
                }}
              >
                {googleDetails &&
                  googleDetails.dataStreams[0].webStreamData.defaultUri}
              </Typography>
            </>
          )}
          {!googleDetails && (
            <Box sx={{ width: 250 }}>
              <DomainPicker
                domainList={domainList}
                onSelect={onDomainSelect}
                domainSelect={googleDetails}
                show={showSelection}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SearchBar zuid={zuid} token={token} />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <CustomDatePicker />
        </Box>
      </Paper>
    </>
  );
}
