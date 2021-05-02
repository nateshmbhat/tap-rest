import type { IpcRendererEvent } from "electron/main";
import { requestInterceptor, responseInterceptor } from "../behaviour";
import { IpcChannel, IpcRendererChannelInterface, IpcRequest } from "../../commons/ipc/ipcChannelInterface";
import { activeTabConfigStore } from "../../stores";
import { get } from "svelte/store";
import { HttpHeaderUtil, StringUtil } from "../../commons/utils/util";
import type { IncomingRequest, IncomingResponse } from "../../commons/types";
import { ClientManager } from "../behaviour/clientManager";

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

        const pathSelectorRegex = activeTabConfig.monitorRequestEditorState.capturePathSelector
        if (!pathSelectorRegex.test(req.path)) {
            ClientManager.sendRequest(req)
                .then(res => {
                    const responseObject: IncomingResponse = { data: res.data, headers: HttpHeaderUtil.removeHopByHopAndEncodingHeaders(res.headers), status: res.status }
                    event.sender.send(request.responseChannel!, responseObject);
                })
                .catch((e: Error) => {
                    const responseObject: IncomingResponse = { data: '', status: 0, headers: {}, error: e }
                    event.sender.send(request.responseChannel!, responseObject)
                });
            return;
        }

        activeTabConfigStore.setMonitorRequestEditorState({
            ...activeTabConfig.monitorRequestEditorState,
            incomingRequest: req
        })
        // rpc call was meant for active tab
        // if (activeTabConfig.operationMode == OperationMode.monitor) {
        this.handleRequestInMonitorMode(request, event);
        // }
        // else if (activeTabConfig.operationMode == OperationMode.client) {
        //     this.handleRequestInClientMode(request, event);
        // }
        // else if (activeTabConfig.operationMode == OperationMode.mockRpc) {
        //     this.handleRequestInMockRpcMode(request, event);
        // }
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

