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
}
