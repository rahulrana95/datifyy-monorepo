module.exports = {
    type: "postgres",
    host: process.env.POSTGRES_DB_HOST,
    port: process.env.POSTGRES_DB_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    synchronize: false,
    logging: false,
    entities: process.env.NODE_ENV !== "development"
      ? ["src/entity/**/*.ts"]  // Use TypeScript entities in development
      : ["dist/entity/**/*.js"], // Use JavaScript entities in production
    migrations: ["dist/migration/**/*.js"],
    subscribers: ["dist/subscriber/**/*.js"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber"
    }
  };