"use strict";

const { CommonColumn } = require("../columns");
const { ControlStatusJadwal } = require("../constants");
const { id, version, createdAt, updatedAt, xid, modifiedBy } = CommonColumn;
const name = "jadwal";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(name, {
            id,
            version,
            createdAt,
            updatedAt,
            xid,
            modifiedBy,
            truckId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "truck",
                    key: "id",
                },
            },
            driverId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            customer: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            destination: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM(
                    ControlStatusJadwal.ONPROGRESS,
                    ControlStatusJadwal.DONE,
                    ControlStatusJadwal.PENDING,
                    ControlStatusJadwal.CANCEL
                ),
                allowNull: false,
                defaultValue: ControlStatusJadwal.PENDING,
            },
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable(name);
    },
};
