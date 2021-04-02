import { IpcChannel } from "../../commons/ipc/ipcChannelInterface"
import { IpcRendererService } from "./ipcRendererService"
import type { IncomingRequest, TransformedResponse } from "../../commons";
export class RendererProcessInterface {
    static async onRequest(request: IncomingRequest): Promise<TransformedResponse> {
        const ipcResponse = await IpcRendererService.send<{ data: string }>(IpcChannel.onRequest, {
            params: request
        })
        return { message: ipcResponse.data };
    }
}