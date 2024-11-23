import express from "express";
import helmet from "helmet";
import cors from "cors";
import { AppDataSource, datasource } from "./module/datasource.module";
import { Repository } from "./server/repository";
import { Service } from "./server/service";
import { Controller } from "./server/controller";
import { handleApiStatus, handleError, handleNotFound, handleRequest } from "./handler/default.handler";
import { config } from "./config";
import { manifest } from "./manifest";
import { initErrorResponse } from "./response";
import compression from "compression";
import { AppRepositoryMap } from "./contract/repository.contract";
import { AppServiceMap } from "./contract/service.contract";
import fileUpload from "express-fileupload";
import { createServer, Server } from "http";
import { SocketServer } from "./server/socket";

start();

function initRepository(dataSource: AppDataSource): AppRepositoryMap {
    const repository = new Repository();
    repository.init(dataSource);
    return repository;
}

function initService(repository: AppRepositoryMap): AppServiceMap {
    const services = new Service();
    services.init(repository);
    return services;
}

async function start(): Promise<void> {
    const source = await datasource.init(config);
    initErrorResponse();

    const repository = initRepository(source);
    const service = initService(repository);

    const app = init(service);
    app.listen(config.port, () => {
        console.log(`Running on ${config.baseUrl}:${config.port}`);
    });
}

function init(service: AppServiceMap): Server {
    const app = express();
    const server = createServer(app);

    app.use(
        helmet({
            frameguard: {
                action: "deny",
            },
            dnsPrefetchControl: false,
        })
    );

    app.use(
        cors({
            origin: config.cors,
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        })
    );

    app.use(
        compression({
            level: 6,
            threshold: 10 * 1000,
        })
    );

    app.use(express.urlencoded({ extended: false, limit: "50kb" }));
    app.use(express.json({ limit: "50kb" }));

    app.use(
        fileUpload({
            limits: { fileSize: 512 * 1024, fieldSize: 512 * 1024 },
        })
    );

    const socket = new SocketServer();

    socket.init({ server, service });

    const controller = new Controller();

    app.use(handleRequest);

    app.get("/", handleApiStatus(manifest));

    app.use("/public", express.static("public"));

    app.use(controller.init(service));

    app.use(handleNotFound);

    app.use(handleError);

    return server;
}
