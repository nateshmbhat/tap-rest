import type { AxiosResponse } from 'axios';
import { get } from 'svelte/store';
import { EditorDataFlowMode, IncomingRequest } from '../../commons';
import { activeTabConfigStore } from '../../stores';
import { ClientManager } from './clientManager';
import { EditorEventType } from './responseStateController';


export async function requestInterceptor(request: IncomingRequest): Promise<AxiosResponse> {
    console.log('request message : ', request)
    const transformedRequest = await requestTransformer(request)
    console.log('transformedRequest : ', transformedRequest)
    const activeTabConfig = get(activeTabConfigStore)
    activeTabConfigStore.setMonitorRequestEditorState({
        ...activeTabConfig.monitorRequestEditorState,
        incomingRequest: request
    })
    return ClientManager.sendRequest(transformedRequest)
}


async function requestTransformer(request: IncomingRequest): Promise<IncomingRequest> {
    const transformedRequest = await new Promise<IncomingRequest>(async (resolve, reject) => {
        const activeTab = get(activeTabConfigStore)
        if (activeTab.monitorRequestEditorState.dataFlowMode == EditorDataFlowMode.passThrough) {
            resolve(request)
        }
        else if (activeTab.monitorRequestEditorState.dataFlowMode == EditorDataFlowMode.liveEdit) {
            activeTab.monitorRequestEditorState.eventEmitter.on(EditorEventType.editingDone, async () => {
                const newRequestObject: IncomingRequest = get(activeTabConfigStore).monitorRequestEditorState.incomingRequest!
                resolve(newRequestObject);
            })
        }
    });
    return transformedRequest
}