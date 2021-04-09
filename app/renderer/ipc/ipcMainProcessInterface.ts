import { IpcChannel } from "../../commons/ipc/ipcChannelInterface"
import { IpcMainService } from "./ipcMainService"

export class MainProcessInterface {
    static startServer(): Promise<void> {
        return IpcMainService.send(IpcChannel.startServer, {})
    }

    static onAppDestroy(): Promise<void> {
        return IpcMainService.send(IpcChannel.onAppDestroy, {})
    }
}
