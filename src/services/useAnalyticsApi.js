import { request } from "../utility/request";
import { parseData } from "../utility/parseData";

export const useAnalyticsApi = (zuid, token) => {
  const dataApiUrl = `${process.env.REACT_APP_SERVICE_GOOGLE_ANALYTICS_GA4_READ}?zuid=${zuid}`;
  const domainApiUrl = `${process.env.REACT_APP_SERVICE_GOOGLE_GA4_PROPERTY_LIST}?zuid=${zuid}`;

  const getChartData = async (googleId, dateRange, type, filters = []) => {
    const query = {
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
        { name: "eventValue" },
        { name: "screenPageViews" },
        { name: "eventsPerSession" },
        { name: "conversions" },
      ],
      dateRanges: [
        { startDate: dateRange.startDate, endDate: dateRange.endDate },
      ],
      orderBys: [
        {
          dimension: { orderType: "NUMERIC", dimensionName: "date" },
          desc: false,
        },
      ],
    };

    if (filters.length !== 0) {
      query.dimensionFilter = {
        filter: {
          fieldName: "pagePath",
          inListFilter: {
            values: filters,
            caseSensitive: true,
          },
        },
      };
    }

    const data = await request(dataApiUrl, {
      method: "POST",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        property: googleId,
        requests: [query],
      }),
    });

    return parseData(data, type);
  };

  const getContentPages = async (
    googleId,
    dateRange,
    type,
    filters = [],
    limit = 10
  ) => {
    const query = {
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
        { name: "eventValue" },
        { name: "screenPageViews" },
        { name: "eventsPerSession" },
        { name: "conversions" },
      ],
      dateRanges: [
        { startDate: dateRange.startDate, endDate: dateRange.endDate },
      ],
      orderBys: [
        {
          metric: { orderType: "NUMERIC", metricName: "screenPageViews" },
          desc: true,
        },
      ],
      metricAggregations: ["TOTAL"],
      limit: limit,
    };

    if (filters.length !== 0) {
      query.dimensionFilter = {
        filter: {
          fieldName: "pagePath",
          inListFilter: {
            values: filters,
            caseSensitive: true,
          },
        },
      };
    }

    const data = await request(dataApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        property: googleId,
        requests: [query],
      }),
    });

    return parseData(data, type);
  };

  const getContentSinglePage = async (
    googleId,
    dateRange,
    type,
    filters = [],
    limit = 10
  ) => {
    const query = {
      
      metrics: [
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
        { name: "eventValue" },
        { name: "screenPageViews" },
        { name: "eventsPerSession" },
        { name: "conversions" },
      ],
      dateRanges: [
        { startDate: dateRange.startDate, endDate: dateRange.endDate },
      ],
      orderBys: [
        {
          metric: { orderType: "NUMERIC", metricName: "screenPageViews" },
          desc: true,
        },
      ],
      metricAggregations: ["TOTAL"],
      limit: limit,
    };

    if (filters.length !== 0) {
      query.dimension = [{ name: "pagePath" }]
      query.dimensionFilter = {
        filter: {
          fieldName: "pagePath",
          inListFilter: {
            values: filters,
            caseSensitive: true,
          },
        },
      };
    }

    const data = await request(dataApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        property: googleId,
        requests: [query],
      }),
    });

    return parseData(data, type);
  };
  
  

  const getGaDomain = () => {
    return request(domainApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // const getPageJourney = (googleId, dateRange) => {
  //   return request(dataApiUrl, {
  //     method: "POST",
  //     headers: {
  //       "content-type": "text/plain",
  //     },
  //     body: JSON.stringify({
  //       gaRequest: {
  //         reportRequests: {
  //           viewId: googleId,
  //           includeEmptyRows: true,
  //           dateRanges: [
  //             { startDate: dateRange.startDate, endDate: dateRange.endDate },
  //           ],
  //           metrics: [
  //             { expression: "ga:sessions" },
  //             { expression: "ga:pageviews" },
  //           ],
  //           dimensions: [
  //             { name: "ga:previousPagePath" },
  //             { name: "ga:pagePath" },
  //           ],
  //           orderBys: [
  //             {
  //               fieldName: "ga:previousPagePath",
  //               sortOrder: "ASCENDING",
  //             },
  //             {
  //               fieldName: "ga:sessions",
  //               sortOrder: "DESCENDING",
  //             },
  //           ],
  //         },
  //       },
  //     }),
  //   });
  // };

  const getPageJourney = async (googleId, dateRange, token) => {
    const res = await request(dataApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        property: googleId,
        requests: [
          {
            dimensions: [{ name: "pageReferrer" }, { name: "pagePath" }],
            metrics: [{ name: "sessions" }, { name: "screenPageViews" }],
            dateRanges: [
              { startDate: dateRange.startDate, endDate: dateRange.endDate },
            ],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
            metricAggregations: ["TOTAL"],
          },
        ],
      }),
    });

    const data = parseData(res);
    let googleData = data.googleData;
    googleData.reports[0].data.rows = data.googleData.reports[0].data.rows.map(
      (row) => {
        let pageReferrer = row.dimensions[0];
        if (pageReferrer.includes("https://www.zesty.io")) {
          pageReferrer = pageReferrer.replace("https://www.zesty.io", "");
        }
        if (
          pageReferrer.includes("https") ||
          pageReferrer.includes("http") ||
          pageReferrer === ""
        ) {
          pageReferrer = "(entrance)";
        }

        return {
          ...row,
          dimensions: [pageReferrer, row.dimensions[1]],
        };
      }
    );

    return {
      ...data,
      googleData: googleData,
    };
  };

  return {
    getChartData,
    getContentPages,
    getGaDomain,
    getPageJourney,
    getContentSinglePage
  };
};
