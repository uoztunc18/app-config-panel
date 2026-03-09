import router from "@/router/router";
import { getAuth } from "firebase/auth";

export const getAllConfigs = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/configs`,
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    throw new Error(`Config service failed: ${err.message}`);
  }
};

export const createConfig = async (newConfig) => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      router.push("/signin");
      return;
    }
    const token = await user.getIdToken();

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/configs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newConfig, userId: user.uid }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    throw new Error(`Config service failed: ${err.message}`);
  }
};

export const updateConfig = async (updatedConfig) => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      router.push("/signin");
      return;
    }
    const token = await user.getIdToken();

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/configs/${updatedConfig.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedConfig),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    throw new Error(`Config service failed: ${err.message}`);
  }
};

export const deleteConfig = async (configId) => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      router.push("/signin");
      return;
    }
    const token = await user.getIdToken();

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/configs/${configId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    throw new Error(`Config service failed: ${err.message}`);
  }
};

export const createCountrySpecificValue = async (
  configId,
  countryCode,
  countryValue,
  configLastUpdatedAt,
) => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      router.push("/signin");
      return;
    }
    const token = await user.getIdToken();

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/configs/${configId}/overrides/${countryCode}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: countryValue,
          configLastUpdatedAt: configLastUpdatedAt,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    throw new Error(`Config service failed: ${err.message}`);
  }
};

export const deleteCountrySpecificValue = async (
  configId,
  currentCountryCode,
) => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      router.push("/signin");
      return;
    }
    const token = await user.getIdToken();

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/configs/${configId}/overrides/${currentCountryCode}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    throw new Error(`Config service failed: ${err.message}`);
  }
};

export const bulkUpdateConfigs = async (
  updatingCountry,
  updates,
) => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      router.push("/signin");
      return;
    }
    const token = await user.getIdToken();

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_API_URL}/configs/bulk`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updatingCountry: updatingCountry,
          updates: updates,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    throw new Error(`Config service failed: ${err.message}`);
  }
};