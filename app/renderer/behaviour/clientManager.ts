import type { IncomingRequest, IncomingResponse } from "../../commons";
import axios, { AxiosResponse } from 'axios'
import { activeTabConfigStore } from "../../stores";
import { get } from "svelte/store";
import { HttpHeaderUtil } from "../../commons/utils/util";
import path from 'path'

export class ClientManager {
    static sendRequest = (request: IncomingRequest): Promise<AxiosResponse> => {
        const activeTabConfig = get(activeTabConfigStore)
        const safeHeaders = HttpHeaderUtil.filterSafeHeaders(request.headers)
        return axios.request({
            method: request.method,
            url: path.join(activeTabConfig.targetHttpServerBaseUrl, request.path),
            params: request.query,
            headers: safeHeaders,
            data: request.body,
        })
    }
}