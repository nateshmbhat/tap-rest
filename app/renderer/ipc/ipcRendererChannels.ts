import type { IpcRendererEvent } from "electron/main";
import { requestInterceptor, responseInterceptor } from "../behaviour";
import { IpcChannel, IpcRendererChannelInterface, IpcRequest } from "../../commons/ipc/ipcChannelInterface";
import { activeTabConfigStore } from "../../stores";
import { get } from "svelte/store";
import { IncomingRequest, IncomingResponse, OperationMode } from "../../commons/types";
import { StringUtil } from "../../commons/utils/util";

export class RequestHandlerChannel implements IpcRendererChannelInterface {
    getName(): string {
        return IpcChannel.onRequest
    }

    async handle(event: IpcRendererEvent, request: IpcRequest): Promise<void> {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        const activeTabConfig = get(activeTabConfigStore)
        const req: IncomingRequest = request.params

        activeTabConfigStore.setMonitorRequestEditorState({
            ...activeTabConfig.monitorRequestEditorState,
            incomingRequest: req
        })
        // rpc call was meant for active tab
        if (activeTabConfig.operationMode == OperationMode.monitor) {
            this.handleRequestInMonitorMode(request, event);
        }
        else if (activeTabConfig.operationMode == OperationMode.client) {
            this.handleRequestInClientMode(request, event);
        }
        else if (activeTabConfig.operationMode == OperationMode.mockRpc) {
            this.handleRequestInMockRpcMode(request, event);
        }
    }

    private async handleRequestInClientMode(request: IpcRequest, event: IpcRendererEvent) {

    }

    private async handleRequestInMonitorMode(request: IpcRequest, event: IpcRendererEvent) {
        const req: IncomingRequest = request.params
        requestInterceptor(req)
            .then(responseInfo =>
                responseInterceptor(responseInfo)
            ).then(transformedResponse => {
                event.sender.send(request.responseChannel!, transformedResponse);
            })
            .catch((e: Error) => {
                const responseObject: IncomingResponse = { data: '', status: 0, headers: {}, error: e }
                const activeConfig = get(activeTabConfigStore)
                activeTabConfigStore.setMonitorResponseEditorState({
                    ...activeConfig.monitorResponseEditorState,
                    incomingResponse: responseObject
                })
                event.sender.send(request.responseChannel!, responseObject)
            });
    }

    private async handleRequestInMockRpcMode(request: IpcRequest, event: IpcRendererEvent) {
        const req: IncomingRequest = request.params
        const mockResponse = get(activeTabConfigStore).mockRpcEditorText
        event.sender.send(request.responseChannel!, { data: JSON.parse(mockResponse) })
    }
}

