import { Namespace, Server } from "socket.io";
import { AppServiceMap } from "../../contract/service.contract";

export abstract class BaseSocket {
    private readonly prefix: string;
    protected io!: Namespace;
    constructor(prefix: string) {
        this.prefix = prefix;
    }

    init(_service: AppServiceMap): void {
        console.log(`Socket Prefix /${this.prefix} don't use service`);
    }

    initEvent(): void {
        console.log(`Socket Prefix /${this.prefix} don't have trigger event`);
    }

    abstract initSocket(): void;

    getPrefix = (): string => {
        return this.prefix;
    };

    setSocket = (socket: Namespace<Server>): void => {
        this.io = socket;
    };
}
