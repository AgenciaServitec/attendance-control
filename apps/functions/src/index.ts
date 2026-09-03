import {HttpsOptions, onRequest} from "firebase-functions/v2/https";
import {app} from "./api";

const httpsOptions = (httpsOptions?: Partial<HttpsOptions>): HttpsOptions => ({
    timeoutSeconds: 540,
    memory: "256MiB",
    maxInstances: 10,
    ...httpsOptions,
});

exports.api = onRequest(httpsOptions(), app);
