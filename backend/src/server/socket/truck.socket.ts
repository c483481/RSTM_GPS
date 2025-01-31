import { pubsubEvent } from "../../constant/pubsub-symbole.constant";
import { pubSub, PubSubAck } from "../../module/pubsub.module";
import { UpdateLocation_Payload } from "../dto/truck.dto";
import { BaseSocket } from "./base.socket";

export class TruckSocket extends BaseSocket {
    constructor() {
        super("truck");
    }

    initEvent(): void {
        pubSub.subscribe(pubsubEvent.updateTruckLocation, this.sendNewTruckLocation);
    }

    initSocket() {
        this.io.on("connection", (socket) => {
            socket.on("disconnect", () => {
                console.log("user disconnected");
            });
        });
    }

    private sendNewTruckLocation = (payload: UpdateLocation_Payload): PubSubAck => {
        this.io.emit("updateLocation", payload);

        return PubSubAck.ACK;
    };
}
