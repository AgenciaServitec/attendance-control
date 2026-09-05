import {config} from "./config";

const projectId = process.env.GCLOUD_PROJECT;

const currentEnvironment =
  projectId === "attendance-control-83a6d" ? "production" : "development";

const isProduction = currentEnvironment === "production";

const environmentConfig: EnvironmentConfig = {
  ...config[currentEnvironment],
  ...config.common,
};

export { isProduction, environmentConfig, config };
