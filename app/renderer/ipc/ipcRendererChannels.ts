import type { IpcRendererEvent } from "electron/main";
import { requestInterceptor, responseInterceptor } from "../behaviour";
import { IpcChannel, IpcRendererChannelInterface, IpcRequest } from "../../commons/ipc/ipcChannelInterface";
import { activeTabConfigStore, appConfigStore, RpcOperationMode} from "../../stores";
import { get } from "svelte/store";

export class RequestHandlerChannel implements IpcRendererChannelInterface {
    getName(): string {
        return IpcChannel.onRequest
    }

    async handle(event: IpcRendererEvent, request: IpcRequest): Promise<void> {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        const { requestData }: { requestData: any } = request.params
        const activeTabConfig = get(activeTabConfigStore)

        // rpc call was meant for active tab
        if (activeTabConfig.operationMode == RpcOperationMode.monitor) {
            this.handleRequestInMonitorMode(request, event);
        }
        else if (activeTabConfig.operationMode == RpcOperationMode.client) {
            this.handleRequestInClientMode(request, event);
        }
        else if (activeTabConfig.operationMode == RpcOperationMode.mockRpc) {
            this.hanldeRequestInMockRpcMode(request, event);
        }
    }

    private async handleRequestInClientMode(request: IpcRequest, event: IpcRendererEvent) {

    }

    private async handleRequestInMonitorMode(request: IpcRequest, event: IpcRendererEvent) {
        const { requestObject }: { requestObject: any } = request.params

        requestInterceptor({
            requestMessage: requestObject,
        })
            .then(responseInfo =>
                responseInterceptor({ responseMessage: responseInfo })
            ).then(transformedResponse => {
                event.sender.send(request.responseChannel!, transformedResponse);
            });
    }

    private async hanldeRequestInMockRpcMode(request: IpcRequest, event: IpcRendererEvent) {
        const mockResponse = get(activeTabConfigStore).mockRpcEditorText
        event.sender.send(request.responseChannel!, { data: JSON.parse(mockResponse) })
    }
}

