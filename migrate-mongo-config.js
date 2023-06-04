const config = {
  mongodb: {
    url: "mongodb://mongodb:27017/express-mongoDB",
    databaseName: "express-mongoDB",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: "migrations",
  changelogCollectionName: "migrations",
};

module.exports = config;