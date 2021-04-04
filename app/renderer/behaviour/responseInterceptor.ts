import type { AxiosResponse } from 'axios';
import { get } from 'svelte/store';
import { EditorDataFlowMode, IncomingResponse } from '../../commons/types';
import { HttpHeaderUtil, StringUtil } from '../../commons/utils/util';
import { activeTabConfigStore } from '../../stores';
import { EditorEventType } from './responseStateController';
import type http from 'http'


function handleResponseHeaders(headers: http.IncomingHttpHeaders): http.IncomingHttpHeaders {
    const modifiableHeaders = HttpHeaderUtil.removeHopByHopHeaders(headers)
    delete modifiableHeaders['content-encoding']
    return modifiableHeaders
}


export async function responseInterceptor(response: AxiosResponse): Promise<IncomingResponse> {
    console.log("Incoming response : ", response)
    const activeTabConfig = get(activeTabConfigStore)
    const { data, headers, status } = response
    const modifiableHeaders = handleResponseHeaders(headers)

    let stringifiedData: string;
    if (typeof data === 'string') stringifiedData = data;
    else stringifiedData = StringUtil.jsonStringify(data)

    activeTabConfigStore.setMonitorResponseEditorState({
        ...activeTabConfig.monitorResponseEditorState, incomingResponse: { data: stringifiedData, headers: modifiableHeaders, status }
    })

    const transformedResponse = await transformResponse({ data, headers: modifiableHeaders, status })
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