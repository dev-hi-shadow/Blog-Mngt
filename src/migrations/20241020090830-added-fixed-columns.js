"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "created_by", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: true,
    });

    await queryInterface.addColumn("users", "updated_by", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: true,
    });

    await queryInterface.addColumn("users", "deleted_by", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "created_by");
    await queryInterface.removeColumn("users", "updated_by");
    await queryInterface.removeColumn("users", "deleted_by");
  },
};
