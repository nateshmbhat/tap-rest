import type { Method } from 'axios';
import type http from 'http'
import type { EditorEventEmitter } from '../../renderer/behaviour/responseStateController';

export interface AppConfigModel {
    proxyHttpServerHost: string;
    proxyHttpServer: http.Server | null;
    proxyHttpServerPort: number,
    testHttpServer: http.Server | null;
    testHttpServerHost: string;
    testHttpServerPort: number,
}

export enum OperationMode {
    // mockRpc = 'mockRpc',
    monitor = 'monitor',
    // client = 'client',
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
    method: Method;
}

export interface IncomingResponse {
    data: string;
    status: number;
    headers: http.IncomingHttpHeaders;
    error?: Error
}

export interface TabConfigModel {
    id: string;
    targetHttpServerBaseUrl: string;
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

export enum EditorDataFlowMode {
    passThrough, liveEdit
}
export interface MonitorRequestEditorModel {
    incomingRequest?: IncomingRequest;
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
}

export interface MonitorResponseEditorModel {
    incomingResponse?: IncomingResponse;
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
}
