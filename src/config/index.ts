import * as dotenv from "dotenv";

function loadEnv() {
  // if (process.env.NODE_ENV !== "prod") {
  //   const configFile = `./.env.${process.env.NODE_ENV}`;
  //   dotenv.config({ path: configFile });
  // } else {
  //   dotenv.config();
  // }

  dotenv.config();
}

loadEnv();

import authConfigurations from "./auth";
import databaseConfigurations from "./database";
import serverConfigurations from "./server";

export { authConfigurations, databaseConfigurations, serverConfigurations };
