import { IpcChannel } from "../../commons/ipc/ipcChannelInterface"
import { IpcRendererService } from "./ipcRendererService"
import type { IncomingRequest, IncomingResponse } from "../../commons";
export class RendererProcessInterface {
    static async onRequest(request: IncomingRequest): Promise<IncomingResponse> {
        const ipcResponse = await IpcRendererService.send<IncomingResponse>(IpcChannel.onRequest, {
            params: request
        })
        return ipcResponse
    }
}