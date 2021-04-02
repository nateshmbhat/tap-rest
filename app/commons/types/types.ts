import type http from 'http'
import type { EditorEventEmitter } from '../../renderer/behaviour/responseStateController';
export interface TransformedResponse {
    message: string
}

export interface AppConfigModel {
    proxyHttpServerHost: string;
    proxyHttpServer: http.Server | null;
    proxyHttpServerPort: number,
    testHttpServer: http.Server | null;
    testHttpServerUrl: string;
}

export enum OperationMode {
    mockRpc = 'mockRpc',
    monitor = 'monitor',
    client = 'client',
}

export interface RequestResponseEditorModel {
    requestText: string;
    responseText: string;
}

export interface ParsedQs { [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[] }
export interface IncomingRequest {
    url: string;
    query: ParsedQs;
    path: string;
    body: string;
    headers: http.IncomingHttpHeaders;
    trailers: { [key: string]: string | undefined };
    hostname: string;
    method: string;
}

export interface TabConfigModel {
    id: string;
    targetHttpServerUrl: string;
    operationMode: OperationMode;
    monitorRequestEditorState: MonitorRequestEditorModel;
    monitorResponseEditorState: MonitorResponseEditorModel;
    clientRequestEditorState: ClientEditorModel;
    clientResponseEditorState: ClientEditorModel;
    mockRpcEditorText: string;
}

export interface ClientEditorModel {
    text: string;
    metadata: string;
}
export interface TabListConfigModel {
    tabs: TabConfigModel[];
    activeTabIndex: number;
}

///Enum only applicable for editor when it "not in client mode"
export enum EditorDataFlowMode {
    passThrough, liveEdit
}

export interface MonitorRequestEditorModel {
    text: string;
    incomingRequest?: IncomingRequest;
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
}

export interface MonitorResponseEditorModel {
    text: string;
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
}
