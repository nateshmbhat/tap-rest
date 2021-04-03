import { get } from 'svelte/store';
import { EditorDataFlowMode, IncomingResponse } from '../../commons/types';
import { ProtoUtil } from '../../commons/utils';
import { activeTabConfigStore} from '../../stores';
import { EditorEventType } from './responseStateController';


export async function responseInterceptor(response:IncomingResponse): Promise<IncomingResponse> {
    const activeTabConfig = get(activeTabConfigStore)
    // activeTabConfigStore.setMonitorResponseEditorState({ ...activeTabConfig.monitorResponseEditorState, text: ProtoUtil.stringify(responseMessage) })
    const transformedResponse = await transformResponse({response})
    return transformedResponse
}

interface ResponseTransformerInput { response: IncomingResponse }

async function transformResponse(transformerInput: ResponseTransformerInput): Promise<IncomingResponse> {
    const transformedResponse = await new Promise<IncomingResponse>(async (resolve, reject) => {
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