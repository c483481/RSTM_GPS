"use strict";

const Constants = {
    SALT_ROUNDS: 14,
    DEFAULT_TIMESTAMP: "2000-01-01 00:00:00",
    DEFAULT_JSON: "{}",
    DEFAULT_JSON_MYSQL: "JSON_OBJECT()",
    DEFAULT_VERSION: 1,
    DEFAULT_MODIFIED_BY: {
        xid: "anonymus",
        email: "anonymus@anonymus.com",
    },
};

const ControlRole = {
    ADMIN: "ADMIN",
    SALES: "SALES",
    DRIVER: "DRIVER",
};

const ControlStatusJadwal = {
    PENDING: "PENDING",
    ONPROGRESS: "ONPROGRESS",
    DONE: "DONE",
    CANCEL: "CANCEL",
};

module.exports = {
    Constants,
    ControlRole,
    ControlStatusJadwal,
};
