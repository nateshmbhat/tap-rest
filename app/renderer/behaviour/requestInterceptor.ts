import { get } from 'svelte/store';
import { ProtoUtil } from '../../commons/utils';
import { activeTabConfigStore } from '../../stores';
import { EditorDataFlowMode } from '../../stores/tabStore';
import { ClientManager } from './clientManager';
import type { ResponseInfo } from './models';
import { EditorEventType } from './responseStateController';

interface RequestInterceptorCallback {
    requestMessage: Object,
}


export function requestInterceptor({ requestMessage}: RequestInterceptorCallback): Promise<ResponseInfo> {
    const responsePromise = new Promise<ResponseInfo>(async (resolve, reject) => {
        const config = get(activeTabConfigStore)
        console.log('request message : ', requestMessage)
        const metadata = '{}'
        activeTabConfigStore.setRequestEditorState({
            ...config.monitorRequestEditorState,
            metadata: metadata,
            text: ProtoUtil.stringify(requestMessage)
        })
        const transformedRequest = await requestTransformer({ requestMessage })
        console.log('transformedRequest : ', transformedRequest)
        ClientManager.sendRequest()
    });
    return responsePromise;
}


interface RequestTransformerInput { requestMessage: Object }
interface RequestTransformerOutput { requestMessage: Object }

async function requestTransformer(request: RequestTransformerInput): Promise<RequestTransformerOutput> {
    const transformedRequest = await new Promise<RequestTransformerOutput>(async (resolve, reject) => {
        const activeTab = get(activeTabConfigStore)
        if (activeTab.monitorRequestEditorState.dataFlowMode == EditorDataFlowMode.passThrough) {
            resolve(request)
        }
        else if (activeTab.monitorRequestEditorState.dataFlowMode == EditorDataFlowMode.liveEdit) {
            activeTab.monitorRequestEditorState.eventEmitter.on(EditorEventType.editingDone, async () => {
                const newRequestString = get(activeTabConfigStore).monitorRequestEditorState.text;
                const newRequestObject = JSON.parse(newRequestString)
                resolve({ requestMessage: newRequestObject });
            })
        }
    });
    return transformedRequest
}