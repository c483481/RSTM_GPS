"use strict";

const name = "truck";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(name, {});

        await queryInterface.addColumn(name, "truckImg", {
            type: Sequelize.STRING(255),
            allowNull: false,
        });

        await queryInterface.addColumn(name, "truckMaintenanceImg", {
            type: Sequelize.STRING(255),
            allowNull: true,
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.removeColumn(name, "truckImg");
        await queryInterface.removeColumn(name, "truckMaintenanceImg");
    },
};
