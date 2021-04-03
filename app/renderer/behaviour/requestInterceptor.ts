import { get } from 'svelte/store';
import { EditorDataFlowMode, IncomingRequest } from '../../commons';
import type { IncomingResponse } from '../../commons/types/types';
import { ProtoUtil } from '../../commons/utils';
import { activeTabConfigStore } from '../../stores';
import { ClientManager } from './clientManager';
import { EditorEventType } from './responseStateController';


export function requestInterceptor(request: IncomingRequest): Promise<IncomingResponse> {
    return new Promise<IncomingResponse>(async (resolve, reject) => {
        console.log('request message : ', request)
        const transformedRequest = await requestTransformer(request)
        console.log('transformedRequest : ', transformedRequest)
        ClientManager.sendRequest(transformedRequest).then(response=>{
            console.log(response)
        })
    });
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