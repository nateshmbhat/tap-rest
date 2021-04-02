import { get } from 'svelte/store';
import { EditorDataFlowMode } from '../../commons/types';
import { ProtoUtil } from '../../commons/utils';
import { activeTabConfigStore} from '../../stores';
import type { ResponseInfo} from './models';
import { EditorEventType } from './responseStateController';

interface ResponseInterceptorCallback {
    responseMessage: ResponseInfo
}

export async function responseInterceptor({ responseMessage }: ResponseInterceptorCallback): Promise<ResponseInfo> {
    const activeTabConfig = get(activeTabConfigStore)
    activeTabConfigStore.setMonitorResponseEditorState({ ...activeTabConfig.monitorResponseEditorState, text: ProtoUtil.stringify(responseMessage.data) })
    const transformedResponse = await transformResponse({ response: responseMessage })
    return transformedResponse
}

interface ResponseTransformerInput { response: ResponseInfo }

async function transformResponse(transformerInput: ResponseTransformerInput): Promise<ResponseInfo> {
    const transformedResponse = await new Promise<ResponseInfo>(async (resolve, reject) => {
        const activeTab = get(activeTabConfigStore)
        if (activeTab.monitorResponseEditorState.dataFlowMode == EditorDataFlowMode.passThrough) {
            resolve(transformerInput.response)
        }
        else if (activeTab.monitorResponseEditorState.dataFlowMode == EditorDataFlowMode.liveEdit) {
            activeTab.monitorResponseEditorState.eventEmitter.on(EditorEventType.editingDone, async () => {
                const newResponseString = get(activeTabConfigStore).monitorResponseEditorState.text
                const newResponseObject = JSON.parse(newResponseString)
                resolve({ ...transformerInput.response, data: newResponseObject });
            })
        }
    });
    return transformedResponse
}