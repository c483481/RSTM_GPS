"use strict";

const { ControlStatusJadwal } = require("../constants");

const name = "checkpoint";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(name, "status", {
            type: Sequelize.ENUM(
                ControlStatusJadwal.ONPROGRESS,
                ControlStatusJadwal.DONE,
                ControlStatusJadwal.PENDING,
                ControlStatusJadwal.CANCEL
            ),
            allowNull: false,
            defaultValue: ControlStatusJadwal.PENDING,
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.removeColumn(name, "status");
    },
};
