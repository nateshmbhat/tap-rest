import type { IncomingRequest, IncomingResponse } from "../../commons";
import axios, { AxiosResponse } from 'axios'
import { activeTabConfigStore } from "../../stores";
import type http from 'http'
import { get } from "svelte/store";

export class ClientManager {
    private static filterUnSafeHeaders(headers: http.IncomingHttpHeaders) {
        const unsafeHeaders = new Set([
            'accept-charset',
            'accept-encoding',
            'access-control-request-headers',
            'access-control-request-method',
            'connection',
            'content-length',
            'cookie',
            'cookie2',
            'date',
            'dNT',
            'expect',
            'feature-policy',
            'host',
            'origin',
            'keep-alive',
            'proxy-',
            'sec-',
            'referer',
            'tE',
            'trailer',
            'transfer-encoding',
            'upgrade',
            'via',
            'user-agent',
        ])
        const safeHeaders: { [header: string]: string | string[] | undefined } = {}
        for (let header in headers) {
            const lowerCasedHeader = header.toLowerCase()
            if (lowerCasedHeader.startsWith('proxy-') || lowerCasedHeader.startsWith('sec-') || unsafeHeaders.has(lowerCasedHeader)) {
                continue
            }
            safeHeaders[header] = headers[header]
        }
        return safeHeaders
    }

    static sendRequest = (request: IncomingRequest) : Promise<AxiosResponse> => {
        const activeTabConfig = get(activeTabConfigStore)
        const safeHeaders = ClientManager.filterUnSafeHeaders(request.headers)
        return axios.request({
            method: request.method,
            url: activeTabConfig.targetHttpServerUrl,
            params: request.query,
            headers: safeHeaders,
            data: request.body,
        })
    }
}