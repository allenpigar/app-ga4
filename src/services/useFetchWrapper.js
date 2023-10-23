import { request } from "../utility/request";

export const useFetchWrapper = (zuid, token) => {
  const ZestyAPI = new window.Zesty.FetchWrapper(zuid, token, {
    authAPIURL: `${process.env.REACT_APP_AUTH_API}`,
    instancesAPIURL: `${process.env.REACT_APP_INSTANCE_API}`,
    accountsAPIURL: `${process.env.REACT_APP_ACCOUNTS_API}`,
    mediaAPIURL: `${process.env.REACT_APP_MEDIA_API}`,
    sitesServiceURL: `${process.env.REACT_APP_SITES_SERVICE}`,
  });

  const getGoogleSetting = async () => {
    const settings = await ZestyAPI.getSettings();
    // if (Object.keys(settings.data).length === 0)

    return settings.data.find(
      (setting) => setting.key === "google_property_id"
    );
  };

  const getGooglePropertyID = async () => {
    const settings = await ZestyAPI.getSettings();
    // if (Object.keys(settings.data).length === 0)

    return settings.data.find(
      (setting) => setting.key === "google_property_id"
    );
  };

  const getUserData = async () => {
    return await ZestyAPI.verify();
  };

  const updateSetting = async (settingZuid, data) => {
    return await ZestyAPI.updateSetting(settingZuid, data);
  };

  const searchItems = async (filter) => {
    const result = await fetch(
      `https://${
        zuid + process.env.REACT_APP_INSTANCE_API
      }/search/items?q=${filter}&order=created&dir=DESC`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await result.json();
    return data;
  };

  const createGa4Setting = async () => {
    return await request(
      `https://${zuid + process.env.REACT_APP_INSTANCE_API}/env/settings`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: "analytics",
          key: "google_property_id",
          keyFriendly: "Google Property ID",
          value: "",
          dataType: "text",
        }),
      }
    );
  };

  return {
    getGoogleSetting,
    getUserData,
    updateSetting,
    searchItems,
    getGooglePropertyID,
    createGa4Setting,
  };
};
