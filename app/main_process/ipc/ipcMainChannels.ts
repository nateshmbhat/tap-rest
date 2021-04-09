import type { IpcMainEvent } from "electron";
import { IpcChannel, IpcMainChannelInterface, IpcRequest } from "../../commons/ipc/ipcChannelInterface";
import { startHttpProxyServer } from "../httpServer";
import { startTestHttpServer } from "../../renderer/components/testing/HttpTestServer";
import { get } from "svelte/store";
import { appConfigStore } from "../../stores";

export class StartServerChannel implements IpcMainChannelInterface {
    getName(): string {
        return IpcChannel.startServer;
    }

    async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        startHttpProxyServer()
        if (process.env.NODE_ENV === 'development') {
            startTestHttpServer()
        }

        event.sender.send(request.responseChannel, {});
    }
}

export class OnAppDestoryChannel implements IpcMainChannelInterface {
    getName(): string {
        return IpcChannel.onAppDestroy;
    }

    async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        const appConfig = get(appConfigStore)
        appConfig.proxyHttpServer?.close();
        appConfig.testHttpServer?.close();

        event.sender.send(request.responseChannel, {});
    }
}