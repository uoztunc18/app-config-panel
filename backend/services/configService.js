import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { db } from "../database/firestore.js";

export const fetchConfigs = async (countryCode) => {
  try {
    const response = await db.collection("configs").get();

    let configArr = [];
    response.forEach((doc) => {
      configArr.push({ id: doc.id, ...doc.data() });
    });

    return configArr;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchConfigsAsList = async (countryCode) => {
  try {
    const response = await db.collection("configs").get();

    let configList = {};
    response.forEach((doc) => {
      configList = {
        ...configList,
        [doc.data().parameterKey]:
          doc.data().overrides?.[countryCode] ?? doc.data().defaultValue,
      };
    });

    return configList;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchConfigById = async (configId) => {
  try {
    const docRef = db.collection("configs").doc(configId);
    const docSnapshot = await docRef.get();

    if (docSnapshot.empty) {
      throw new Error(`No config found for ${configId}`);
    }

    return { id: docRef.id, ...docSnapshot.data() };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addConfig = async (newConfig) => {
  try {
    const timestamp = FieldValue.serverTimestamp();

    const docRef = await db.collection("configs").add({
      ...newConfig,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const addedData = await docRef.get();

    return { id: docRef.id, ...addedData.data() };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const editConfig = async (configId, editedConfig) => {
  try {
    await db.runTransaction(async (transaction) => {
      const configRef = db.collection("configs").doc(configId);
      const freshDocSnapshot = await transaction.get(configRef);

      if (!freshDocSnapshot.exists) throw new Error("Config does not exist!");

      const freshData = freshDocSnapshot.data();
      const freshTimestamp = new Timestamp(
        freshData.updatedAt._seconds,
        freshData.updatedAt._nanoseconds,
      );
      const editedTimestamp = new Timestamp(
        editedConfig.updatedAt._seconds,
        editedConfig.updatedAt._nanoseconds,
      );

      if (editedTimestamp.toMillis() < freshTimestamp.toMillis())
        throw new Error("Data has modified by another user!");

      transaction.update(configRef, {
        parameterKey: editedConfig.parameterKey,
        defaultValue: editedConfig.defaultValue,
        description: editedConfig.description,
        overrides: editedConfig.overrides ?? {},
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    const addedData = await db.collection("configs").doc(configId).get();
    return { id: configId, ...addedData.data() };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const remvoveConfig = async (configId) => {
  try {
    await db.runTransaction(async (transaction) => {
      const configRef = db.collection("configs").doc(configId);
      await transaction.delete(configRef);
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchAllCountrySpecificValues = async (configId) => {
  try {
    const configRef = db.collection("configs").doc(configId);
    const configSnapshot = await configRef.get();

    if (!configSnapshot.exists)
      throw new Error(`No config found for ${configId}`);
    const config = configSnapshot.data();

    return config.overrides;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchCountrySpecificValue = async (configId, countryCode) => {
  try {
    const configRef = db.collection("configs").doc(configId);
    const configSnapshot = await configRef.get();

    if (!configSnapshot.exists)
      throw new Error(`No config found for ${configId}`);
    const config = configSnapshot.data();

    return {
      countryCode: countryCode,
      value: config.overrides?.[countryCode] ?? null,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const editCountrySpecificValue = async (
  configId,
  countryCode,
  countrySpecificValue,
  configLastUpdatedAt,
) => {
  try {
    let configRef = db.collection("configs").doc(configId);

    await db.runTransaction(async (transaction) => {
      const freshDocSnapshot = await transaction.get(configRef);

      if (!freshDocSnapshot.exists) throw new Error("Config does not exist!");

      const freshData = freshDocSnapshot.data();
      const freshTimestamp = new Timestamp(
        freshData.updatedAt._seconds,
        freshData.updatedAt._nanoseconds,
      );
      const editedTimestamp = new Timestamp(
        configLastUpdatedAt._seconds,
        configLastUpdatedAt._nanoseconds,
      );

      if (editedTimestamp.toMillis() < freshTimestamp.toMillis()) {
        throw new Error("Data has modified by another user!");
      }

      transaction.update(configRef, {
        [`overrides.${countryCode}`]: countrySpecificValue,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    const updatedSnapshot = await configRef.get();
    const updatedConfig = updatedSnapshot.data();
    return updatedConfig.updatedAt;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const removeCountrySpecificValue = async (configId, countryCode) => {
  try {
    await db.runTransaction(async (transaction) => {
      const configRef = db.collection("configs").doc(configId);
      const freshDocSnapshot = await transaction.get(configRef);

      if (!freshDocSnapshot.exists)
        throw new Error(`No config found for ${configId}`);

      const config = freshDocSnapshot.data();
      delete config.overrides[countryCode];

      await transaction.update(configRef, { overrides: config.overrides });
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const bulkEditConfigs = async (updatingCountry, updates) => {
  try {
    const batch = db.batch();

    updates.forEach((update) => {
      const docRef = db.collection("configs").doc(update.id);
      batch.update(docRef, {
        [`overrides.${updatingCountry}`]: update.value,
        lastUpdatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
  } catch (err) {
    throw new Error(err.message);
  }
};
