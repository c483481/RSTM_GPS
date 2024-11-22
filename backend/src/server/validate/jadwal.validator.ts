import { baseValidator } from "./base.validator";

export class JadwalValidator {
    static CreateJadwal_Payload = baseValidator.compile({
        truckXid: "string|empty:false|required",
        driverXid: "string|empty:false|required",
        tanggal: "number|empty:false|required",
        customer: "string|empty:false|required|min:5|max:255",
        destination: "string|empty:false|required|min:5|max:255",
        deskripsi: "string|empty:true|nullable|min:5|max:255",
        $$strict: true,
    });

    static PatchJadwal_Payload = baseValidator.compile({
        status: "string|empty:false|required",
        version: "number|empty:false|required|min:1",
        $$strict: true,
    });
}
