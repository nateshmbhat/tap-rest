import type { IpcMainEvent } from "electron";
import { IpcChannel, IpcMainChannelInterface, IpcRequest } from "../../commons/ipc/ipcChannelInterface";
import { startHttpProxyServer } from "../httpServer";
import { get } from "svelte/store";

export class StartServerChannel implements IpcMainChannelInterface {
    getName(): string {
        return IpcChannel.startServer;
    }

    async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        startHttpProxyServer()

        event.sender.send(request.responseChannel, {});
    }
}
