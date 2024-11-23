import { Sequelize } from "sequelize";
import { Users } from "./users.model";
import { Truck } from "./truck.model";
import { Jadwal } from "./jadwal.model";
import { Checkpoint } from "./checkpoint.model";

export interface AppSqlModel {
    Users: typeof Users;
    Truck: typeof Truck;
    Jadwal: typeof Jadwal;
    Checkpoint: typeof Checkpoint;
}

export function initSqlModels(sequelize: Sequelize): AppSqlModel {
    Users.initModels(sequelize);
    Truck.initModels(sequelize);
    Jadwal.initModels(sequelize);
    Checkpoint.initModels(sequelize);

    Jadwal.belongsTo(Users, {
        foreignKey: "driverId",
        as: "driver",
    });

    Jadwal.belongsTo(Truck, {
        foreignKey: "truckId",
        as: "truck",
    });

    Checkpoint.belongsTo(Jadwal, {
        foreignKey: "jadwalId",
        as: "jadwal",
    });

    Jadwal.hasMany(Checkpoint, {
        foreignKey: "jadwalId",
        as: "checkpoints",
    });

    return {
        Users,
        Truck,
        Jadwal,
        Checkpoint,
    };
}
