import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const projectId = process.env.GCLOUD_PROJECT;

const currentEnvironment =
  projectId === "gob-regional-callao" ? "production" : "development";

export const isProduction = currentEnvironment === "production";

if (!getApps().length) {
  initializeApp({
    serviceAccountId: isProduction
      ? "856118271104-compute@developer.gserviceaccount.com"
      : undefined,
  });
}

export const bucketAtFunction = projectId + ".appspot.com";

export const firestore = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
export const firestoreFieldValue = FieldValue;
export const firestoreTimestamp = Timestamp;

export * from "./firestore";
