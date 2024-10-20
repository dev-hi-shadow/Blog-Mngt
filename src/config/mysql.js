const { Sequelize } = require("sequelize");
const config = require("./config")[process.env.APP_MODE];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: 3306,
    logging: false,
    dialect: config.dialect,
    pool: {
      min: 0, // Minimum number of connection in pool
      max: 5, // Maximum number of connection in pool
      idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released.
      acquire: 60000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      evict: 1000, // The time interval, in milliseconds, after which sequelize-pool will remove idle connections.
    },
    define: {
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    },
  }
);

module.exports = {
  sequelize,
};
