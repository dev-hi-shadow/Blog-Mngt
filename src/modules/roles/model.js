const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql");
const md5 = require("md5");

class Roles extends Model {
  static associate(db) {
    Roles.hasMany(db.Users, {
      as: "users",
      foreignKey: "role_id",
      sourceKey: "id",
    });
  }
}

Roles.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    deleted_at: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "roles",
    modelName: "Roles",
    hooks: {
      afterDestroy: async (instance, options) => {
        if (options?.deleted_by) {
          instance.setDataValue("deleted_by", options?.deleted_by);
          await instance.save();
        }
      },
    },
  }
);

module.exports = Roles;
