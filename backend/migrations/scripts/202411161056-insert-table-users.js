"use strict";
const { ulid } = require("ulidx");
const { hashSync } = require("bcrypt");

const { Constants, ControlRole } = require("../constants");

const { DEFAULT_JSON, DEFAULT_VERSION, DEFAULT_TIMESTAMP } = Constants;

const name = "users";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, _Sequelize) {
        await queryInterface.bulkInsert(name, [
            {
                xid: ulid(),
                modifiedBy: DEFAULT_JSON,
                version: DEFAULT_VERSION,
                createdAt: DEFAULT_TIMESTAMP,
                updatedAt: DEFAULT_TIMESTAMP,
                username: "admin",
                name: "Admin",
                noHP: "081234567890",
                password: hashSync("qwert12345", 10),
                role: ControlRole.ADMIN,
            },
        ]);
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.bulkDelete(name, {
            email: ["admin@gmail.com"],
        });
    },
};
