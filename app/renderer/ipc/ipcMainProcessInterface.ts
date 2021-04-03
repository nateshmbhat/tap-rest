import { IpcChannel } from "../../commons/ipc/ipcChannelInterface"
import { IpcMainService } from "./ipcMainService"

export class MainProcessInterface {
    static startServer<T>(): Promise<T> {
        return IpcMainService.send<T>(IpcChannel.startServer, {})
    }
}
