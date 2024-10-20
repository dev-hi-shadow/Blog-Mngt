const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql");
const md5 = require("md5");

class Blogs extends Model {
  static associate(db) {
    Blogs.belongsTo(db.Users, {
      as: "created_by_user",
      foreignKey: "created_by",
      sourceKey: "id",
    });
    Blogs.belongsTo(db.Users, {
      as: "updated_by_user",
      foreignKey: "updated_by",
      sourceKey: "id",
    });
    Blogs.belongsTo(db.Users, {
      as: "deleted_by_user",
      foreignKey: "deleted_by",
      sourceKey: "id",
    });
    Blogs.belongsTo(db.Categories, {
      as: "category",
      foreignKey: "category_id",
      sourceKey: "id",
    });
    Blogs.belongsTo(db.SubCategories, {
      as: "sub_category",
      foreignKey: "sub_category_id",
      sourceKey: "id",
    });
    Blogs.hasMany(db.BlgComments, {
      as: "comments",
      foreignKey: "blog_id",
      sourceKey: "id",
    });
  }
}

Blogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "sub_categories",
        key: "id",
      },
      allowNull: true,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "blogs",
    modelName: "Blogs",
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

module.exports = Blogs;
