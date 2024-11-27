import { baseValidator } from "./base.validator";

export class CheckpointValidator {
    static CreateCheckpoint_Payload = baseValidator.compile({
        jadwalXid: "string|empty:false|required",
        name: "string|empty:false|required|min:5|max:255",
        order: "number|empty:false|required|min:1",
        $$strict: true,
    });

    static PatchCheckpoint_Payload = baseValidator.compile({
        status: "string|empty:false|required",
        version: "number|empty:false|required|min:1",
        $$strict: true,
    });
}
