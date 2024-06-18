const databaseConfigurations = {
  DB_URL: process.env.MONGODB_URI || "",
  APP_SECRET: process.env.APP_SECRET || "secret",
};

export default databaseConfigurations;
