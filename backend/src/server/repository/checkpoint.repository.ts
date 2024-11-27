import { CheckpointRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { Checkpoint, CheckpointAttributes, CheckpointCreationAttributes } from "../model/checkpoint.model";
import { BaseRepository } from "./base.repository";

export class SequelizeCheckpointRepository extends BaseRepository implements CheckpointRepository {
    private checkpoint!: typeof Checkpoint;
    init(datasource: AppDataSource): void {
        this.checkpoint = datasource.sqlModel.Checkpoint;
    }

    insertCheckpoint = async (data: CheckpointCreationAttributes): Promise<CheckpointAttributes> => {
        return this.checkpoint.create(data);
    };

    findByXid = async (xid: string): Promise<CheckpointAttributes | null> => {
        return this.checkpoint.findOne({
            where: {
                xid,
            },
        });
    };

    updateCheckpoint = async (id: number, payload: Partial<CheckpointAttributes>, version: number): Promise<number> => {
        const result = await this.checkpoint.update(payload, {
            where: {
                id,
                version,
            },
        });

        return result[0];
    };
}
