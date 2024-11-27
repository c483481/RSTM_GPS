"use strict";

const { ControlStatusJadwal } = require("../constants");

const name = "checkpoint";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(name, "status", {
            type: {
                type: Sequelize.ENUM(
                    ControlStatusJadwal.ONPROGRESS,
                    ControlStatusJadwal.DONE,
                    ControlStatusJadwal.PENDING,
                    ControlStatusJadwal.CANCEL
                ),
                allowNull: false,
                defaultValue: ControlStatusJadwal.PENDING,
            },
            allowNull: false,
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.removeColumn(name, "status");
    },
};
