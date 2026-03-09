import { Router } from "express";
import {
  createConfig,
  getAllConfigs,
  getConfigById,
  updateConfig,
  deleteConfig,
  getAllCountrySpecificValues,
  getCountrySpecificValue,
  upsertCountrySpecificValue,
  deleteCountrySpecificValue,
  bulkUpdateConfigs,
} from "../controllers/configController.js";
import { isAuthenticated } from "../middleware/is-auth.js";

const configRoutes = Router();

configRoutes.get("/", getAllConfigs);

configRoutes.get("/:configId", getConfigById);

configRoutes.post("/", isAuthenticated, createConfig);

configRoutes.put("/:configId", isAuthenticated, updateConfig);

configRoutes.delete("/:configId", isAuthenticated, deleteConfig);

configRoutes.get("/:configId/overrides", getAllCountrySpecificValues);

configRoutes.get(
  "/:configId/overrides/:countryCode",
  getCountrySpecificValue,
);

configRoutes.put(
  "/:configId/overrides/:countryCode",
  isAuthenticated,
  upsertCountrySpecificValue,
);

configRoutes.delete(
  "/:configId/overrides/:countryCode",
  isAuthenticated,
  deleteCountrySpecificValue,
);

configRoutes.patch("/bulk", isAuthenticated, bulkUpdateConfigs);

export default configRoutes;
