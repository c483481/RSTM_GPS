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
}
