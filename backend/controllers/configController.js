import {
  fetchConfigs,
  fetchConfigsAsList,
  fetchConfigById,
  addConfig,
  editConfig,
  remvoveConfig,
  fetchAllCountrySpecificValues,
  fetchCountrySpecificValue,
  editCountrySpecificValue,
  removeCountrySpecificValue,
  bulkEditConfigs,
} from "../services/configService.js";

export const getAllConfigs = async (req, res, next) => {
  try {
    const clientType = req.query.client;
    const countryCode = req.query.country;
    let data;

    if (clientType === "mobile") {
      data = await fetchConfigsAsList(countryCode);
    } else {
      data = await fetchConfigs(countryCode);
    }
    console.log("Gotten all: ", data);
    res.status(200).json({
      success: true,
      data: data,
      message: "Fetched data successfully!",
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err });
  }
};

export const getConfigById = async (req, res, next) => {
  try {
    const data = await fetchConfigById(req.params.configId);
    console.log("Gotten: ", data);
    res.status(200).json({
      success: true,
      data: data,
      message: "Fetched data successfully!",
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err });
  }
};

export const createConfig = async (req, res, next) => {
  try {
    const config = await addConfig(req.body);
    console.log("Created config with ID:", config.id);
    res.status(201).json({
      success: true,
      data: config,
      message: "Config created successfully!",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateConfig = async (req, res, next) => {
  try {
    const updatedConfig = await editConfig(req.params.configId, req.body);
    console.log("Updated config with ID:", updatedConfig.id);
    res.status(200).json({
      success: true,
      data: updatedConfig,
      message: "Config updated successfully!",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteConfig = async (req, res, next) => {
  try {
    await remvoveConfig(req.params.configId);
    console.log("Deleted config with ID:", req.params.configId);
    res.status(200).json({
      success: true,
      data: req.params.configId,
      message: "Config deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllCountrySpecificValues = async (req, res, next) => {
  try {
    const configId = req.params.configId;

    const data = await fetchAllCountrySpecificValues(configId);
    res.status(200).json({
      success: true,
      data: data,
      message: "Fetched data successfully!",
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err });
  }
};

export const getCountrySpecificValue = async (req, res, next) => {
  try {
    const configId = req.params.configId;
    const countryCode = req.params.countryCode;

    const data = await fetchCountrySpecificValue(configId, countryCode);
    res.status(200).json({
      success: true,
      data: data,
      message: "Fetched data successfully!",
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err });
  }
};

export const upsertCountrySpecificValue = async (req, res, next) => {
  try {
    const configId = req.params.configId;
    const countryCode = req.params.countryCode;
    const countrySpecificValue = req.body.value;
    const configLastUpdatedAt = req.body.configLastUpdatedAt;

    const updatedAt = await editCountrySpecificValue(
      configId,
      countryCode,
      countrySpecificValue,
      configLastUpdatedAt,
    );
    res.status(200).json({
      success: true,
      data: updatedAt,
      message: "Updated data successfully!",
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err });
  }
};

export const deleteCountrySpecificValue = async (req, res, next) => {
  try {
    const configId = req.params.configId;
    const countryCode = req.params.countryCode;

    await removeCountrySpecificValue(configId, countryCode);
    console.log("Deleted country value with config ID:", configId);
    res.status(200).json({
      success: true,
      data: countryCode,
      message: "Value deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const bulkUpdateConfigs = async (req, res) => {
  try {
    const updatingCountry = req.body.updatingCountry;
    const updates = req.body.updates;

    await bulkEditConfigs(updatingCountry, updates);
    console.log("Bulk updated: ", updates);
    res.status(200).json({
      success: true,
      data: updates,
      message: "Bulk updated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
