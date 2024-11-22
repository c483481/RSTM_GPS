"use strict";

const { CommonColumn } = require("../columns");
const { id, version, createdAt, updatedAt, xid, modifiedBy } = CommonColumn;
const name = "truck";
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
            namaTruck: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            platNomor: {
                type: Sequelize.STRING(10),
                allowNull: false,
                unique: true,
            },
            deskripsi: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            status: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            estimasiDone: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable(name);
    },
};
