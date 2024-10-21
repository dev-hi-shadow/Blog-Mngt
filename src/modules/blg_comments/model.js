const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql");

class BlgComments extends Model {
  static associate(db) {
    BlgComments.belongsTo(db.Users, {
      as: "created_by_user",
      foreignKey: "created_by",
    });
    BlgComments.belongsTo(db.Users, {
      as: "updated_by_user",
      foreignKey: "updated_by",
    });
    BlgComments.belongsTo(db.Users, {
      as: "deleted_by_user",
      foreignKey: "deleted_by",
    });

    BlgComments.belongsTo(db.Blogs, {
      as: "blog",
      foreignKey: "blog_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

BlgComments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "blogs",
        key: "id",
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "blg_comments",
    modelName: "BlgComments",
    hooks: {
      afterDestroy: async (instance, options) => {
        if (options?.deleted_by) {
          instance.setDataValue("deleted_by", options.deleted_by);
          await instance.save();
        }
      },
    },
  }
);

module.exports = BlgComments;
