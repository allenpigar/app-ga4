import {
  BrowserRouter,
  Routes,
  Route,
  HashRouter
} from "react-router-dom";
import Overview from "../../Overview";
import PageContent from "../../PageContent";
import Journey from "../../Journey";
import { useGoogle } from "../../../context/GoogleContext";
import { useEffect, useState } from "react";
import { useFetchWrapper } from "../../../services/useFetchWrapper";
import ContentWrapper from "./ContentWrapper";
import MetricCard from "../../PageContent/card";
import Graph from "../../PageContent/graph";
import Table from "../../PageContent/table";
import OverviewGraph from "../../Overview/graph";

export default function AppWrapper(props) {
  const { isAuthenticated, setIsAuthenticated } = useGoogle();
  const { getUserData } = useFetchWrapper(props.instance.zuid, props.token);
  const [userId, setUserId] = useState(null);

  useEffect(async () => {
    const user = await getUserData();
    if (user.data === null) return setIsAuthenticated(false);
    setUserId(user.data);
  }, []);

  const PageNotFound = () => (
    <>
      <p>
        Page not found.
      </p>
    </>
  )

  return (
    <>
      <BrowserRouter basename="/google-analytics-4">
        <Routes>
          <Route exact path="/" element={<ContentWrapper {...props} isAuthenticated={isAuthenticated} userId={userId} ><Overview {...props} /></ContentWrapper>} />
          <Route exact path="/content" element={<ContentWrapper {...props} isAuthenticated={isAuthenticated} userId={userId} ><PageContent {...props} /></ContentWrapper>} />     
          <Route exact path="/journey" element={<ContentWrapper {...props} isAuthenticated={isAuthenticated} userId={userId} ><Journey {...props} /></ContentWrapper>} />
          <Route exact path="/content/card" element={<MetricCard {...props} isAuthenticated={isAuthenticated} /> } />
          <Route exact path="/content/card/:metric" element={<MetricCard {...props} isAuthenticated={isAuthenticated} /> } />
          <Route exact path="/content/graph" element={<Graph {...props} isAuthenticated={isAuthenticated} /> } />
          <Route exact path="/content/table" element={<Table {...props} isAuthenticated={isAuthenticated} /> } />
          <Route exact path="/journey/graph" element={<Journey {...props} />} />
          <Route exact path="/overview/graph/:type" element={<OverviewGraph {...props} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
