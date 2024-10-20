const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql");
const md5 = require("md5");

class Users extends Model {
  static associate(db) {
    Users.belongsTo(db.Users, {
      foreignKey: "created_by",
      sourceKey: "id",
    });
    Users.belongsTo(db.Users, {
      foreignKey: "updated_by",
      sourceKey: "id",
    });
    Users.belongsTo(db.Users, {
      foreignKey: "deleted_by",
      sourceKey: "id",
    });
    Users.belongsTo(db.Roles, {
      as: "role",
      foreignKey: "role_id",
      targetKey: "id",
    });
  }
  isValidPassword = (password) => {
    return md5(password) === this.getDataValue("password");
  };
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },

    display_name: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.getDataValue("first_name") || ""} ${
          this.getDataValue("last_name") || ""
        }`.trim();
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue("password", md5(value));
      },
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "Users",
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

module.exports = Users;
