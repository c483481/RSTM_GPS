"use strict";

const { CommonColumn } = require("../columns");
const { id, version, createdAt, updatedAt, xid, modifiedBy } = CommonColumn;
const name = "checkpoint";
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
            jadwalId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "jadwal",
                    key: "id",
                },
            },
            checkpoint: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            order: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        });

        await queryInterface.addConstraint(name, {
            fields: ["jadwalId", "checkpoint"],
            type: "unique",
            name: "unique_jadwal_checkpoint",
        });

        await queryInterface.addConstraint(name, {
            fields: ["jadwalId", "checkpoint", "order"],
            type: "unique",
            name: "unique_jadwal_checkpoint_order",
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.removeConstraint(name, "unique_jadwal_checkpoint_order");

        await queryInterface.dropTable(name);
    },
};
