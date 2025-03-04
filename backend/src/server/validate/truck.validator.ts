import { UploadedFile } from "express-fileupload";
import { baseValidator } from "./base.validator";

export class TruckValidator {
    static CreateTruck_Payload = baseValidator.compile({
        nama: "string|empty:false|required|min:5|max:255",
        platNomor: "string|empty:false|required|min:5|max:255",
        $$strict: true,
    });

    static UpdateTruck_Payload = baseValidator.compile({
        status: "string|empty:false|required",
        estimasiDone: "string|empty:true|nullable|min:1",
        deskripsi: "string|empty:false|required|min:5|max:255",
        version: "string|empty:false|required|min:1",
        $$strict: true,
    });

    static isValidImage = (payload: unknown): UploadedFile | null => {
        if (!payload) {
            return null;
        }

        if (typeof payload !== "object" || !("image" in payload)) {
            return null;
        }

        if (!this.isValidUploadedFile(payload.image)) {
            return null;
        }

        if (!["image/jpeg", "image/png"].includes(payload.image.mimetype)) {
            return null;
        }

        return payload.image;
    };

    static isValidUploadedFile(obj: unknown): obj is UploadedFile {
        return (
            obj != null &&
            typeof obj == "object" &&
            "name" in obj &&
            typeof obj.name === "string" &&
            "mv" in obj &&
            typeof obj.mv === "function" &&
            "encoding" in obj &&
            typeof obj.encoding === "string" &&
            "mimetype" in obj &&
            typeof obj.mimetype === "string" &&
            "data" in obj &&
            Buffer.isBuffer(obj.data) &&
            "tempFilePath" in obj &&
            typeof obj.tempFilePath === "string" &&
            "truncated" in obj &&
            typeof obj.truncated === "boolean" &&
            "size" in obj &&
            typeof obj.size === "number" &&
            "md5" in obj &&
            typeof obj.md5 === "string"
        );
    }

    static UpdateLocation_Payload = baseValidator.compile({
        xid: "string|empty:false|required",
        latitude: {
            type: "number",
            min: -90,
            max: 90,
            messages: {
                numberMin: "Latitude tidak boleh kurang dari -90",
                numberMax: "Latitude tidak boleh lebih dari 90",
                required: "Latitude harus diisi",
            },
        },
        longitude: {
            type: "number",
            min: -180,
            max: 180,
            messages: {
                numberMin: "Longitude tidak boleh kurang dari -180",
                numberMax: "Longitude tidak boleh lebih dari 180",
                required: "Longitude harus diisi",
            },
        },
        battery: {
            type: "number",
            min: 0,
            max: 200,
            messages: {
                numberMin: "Battery tidak boleh kurang dari 0",
                numberMax: "Battery tidak boleh lebih dari 100",
                required: "Battery harus diisi",
            },
        },
        $$strict: true,
    });
}
