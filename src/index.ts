import express from "express";
import { serverConfigurations } from "./config";
import expressApp from "./express-app";
import databaseConnection from "./general/database-connection";

const startServer = async () => {
  const app = express();

  await databaseConnection();

  await expressApp(app);

  // Start server
  app
    .listen(serverConfigurations.PORT, () => {
      console.log(`listening to port ${serverConfigurations.PORT}`);
    })
    .on("error", err => {
      console.log(err);
      process.exit();
    });
};

startServer();
