"use strict";

const { CommonColumn } = require("../columns");
const { id, version, createdAt, updatedAt, xid, modifiedBy } = CommonColumn;
const name = "truck_information";
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
            latitude: {
                type: Sequelize.DECIMAL(9, 6),
                allowNull: false,
            },
            longitude: {
                type: Sequelize.DECIMAL(9, 6),
                allowNull: false,
            },
            battrey: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable(name);
    },
};
