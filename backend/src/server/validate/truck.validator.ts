import { baseValidator } from "./base.validator";

export class TruckValidator {
    static CreateTruck_Payload = baseValidator.compile({
        nama: "string|empty:false|required|min:5|max:255",
        platNomor: "string|empty:false|required|min:5|max:255",
        $$strict: true,
    });

    static UpdateTruck_Payload = baseValidator.compile({
        status: "string|empty:false|required",
        estimasiDone: "number|empty:true|nullable|min:1",
        deskripsi: "string|empty:false|required|min:5|max:255",
        version: "number|empty:false|required|min:1",
        $$strict: true,
    });

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
            max: 100,
            messages: {
                numberMin: "Battery tidak boleh kurang dari 0",
                numberMax: "Battery tidak boleh lebih dari 100",
                required: "Battery harus diisi",
            },
        },
        $$strict: true,
    });
}
