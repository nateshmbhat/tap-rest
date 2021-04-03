import type { AxiosResponse } from 'axios';
import { get } from 'svelte/store';
import { EditorDataFlowMode, IncomingResponse } from '../../commons/types';
import { ProtoUtil } from '../../commons/utils';
import { activeTabConfigStore } from '../../stores';
import { EditorEventType } from './responseStateController';


export async function responseInterceptor(response: AxiosResponse): Promise<IncomingResponse> {
    console.log("Incoming response : " , response)
    const activeTabConfig = get(activeTabConfigStore)
    const { data, headers, status} = response
    activeTabConfigStore.setMonitorResponseEditorState({
        ...activeTabConfig.monitorResponseEditorState, incomingResponse: {
            data: response.data, headers: response.headers, status: response.status
        }
    })
    const transformedResponse = await transformResponse({ data, headers, status})
    return transformedResponse
}

async function transformResponse(incomingResponse: IncomingResponse): Promise<IncomingResponse> {
    const transformedResponse = await new Promise<IncomingResponse>(async (resolve, reject) => {
        const activeTab = get(activeTabConfigStore)
        if (activeTab.monitorResponseEditorState.dataFlowMode == EditorDataFlowMode.passThrough) {
            resolve(incomingResponse)
        }
        else if (activeTab.monitorResponseEditorState.dataFlowMode == EditorDataFlowMode.liveEdit) {
            activeTab.monitorResponseEditorState.eventEmitter.on(EditorEventType.editingDone, async () => {
                const newResponseState = get(activeTabConfigStore).monitorResponseEditorState.incomingResponse!
                resolve(newResponseState);
            })
        }
    });
    return transformedResponse
}