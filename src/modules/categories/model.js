const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql");

class Categories extends Model {
  static associate(db) {
    Categories.belongsTo(db.Users, {
      foreignKey: "created_by",
      sourceKey: "id",
    });
    Categories.hasMany(db.SubCategories, {
      foreignKey: "category_id",
    });
    Categories.belongsTo(db.Users, {
      foreignKey: "updated_by",
      sourceKey: "id",
    });
    Categories.belongsTo(db.Users, {
      foreignKey: "deleted_by",
      sourceKey: "id",
    });
  }
}
Categories.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "categories",
    modelName: "Categories",
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

module.exports = Categories;
