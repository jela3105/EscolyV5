import admin from "firebase-admin";
import { envs } from "../../config";

const serviceAccount = JSON.parse(envs.FIREBASE_CREDENTIAL);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: envs.FIREBASE_REALTIME_DATABASE_URL,
});

export const db = admin.database();