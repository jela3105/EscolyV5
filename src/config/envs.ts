import "dotenv/config";

import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  MYSQL_HOST: get("MYSQL_HOST").required().asString(),
  MYSQL_DOCKER_PORT: get("MYSQL_DOCKER_PORT").required().asPortNumber(),
  MYSQL_PASSWORD: get("MYSQL_ROOT_PASSWORD").required().asString(),
  MYSQL_DATABASE: get("MYSQL_DATABASE").required().asString(),
  JWT_SEED: get("JWT_SEED").required().asString(),
  NODE_ENV: get("NODE_ENV").required().asString(),
  MAILER_EMAIL: get("MAILER_EMAIL").required().asEmailString(),
  MAILER_SERVICE: get("MAILER_SERVICE").required().asString(),
  MAILER_SECRET_KEY: get("MAILER_SECRET_KEY").required().asString(),
  WEB_SERVICE_URL: get("WEB_SERVICE_URL").required().asString(),
  FIREBASE_CREDENTIAL: get("FIREBASE_CREDENTIAL").required().asString(),
  FIREBASE_REALTIME_DATABASE_URL: get("FIREBASE_REALTIME_DATABASE_URL").required().asString(),
};
