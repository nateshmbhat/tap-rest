import { get } from "svelte/store"
import { appConfigStore } from "../stores"
import http from 'http'
import type { Method } from 'axios'
import express from 'express'
import { RendererProcessInterface } from "./ipc/ipcRendererProcessInterface"
import { HttpHeaderUtil } from "../commons/utils/util"


export const startHttpProxyServer = async (): Promise<void> => {
    const appConfig = get(appConfigStore)
    const expressApp = express()
    expressApp.use(express.json())

    expressApp.use((req, res, next) => {
        console.log('got request : ')
        console.log('request url : ', req.url)
        console.log('request method : ', req.method)
        console.log('headers : ', req.headers)
        console.log('query : ', req.query)
        console.log('path and params : ', req.path, req.params)
        console.log('body : ', req.body)
        const { body, url, method, headers, trailers, hostname, query, path } = req
        RendererProcessInterface.onRequest({ body, url, method: method as Method, headers: HttpHeaderUtil.removeHopByHopHeaders(req.headers), trailers, hostname, path, query }).then(
            transformedResponse => {
                console.log('transformed response : ', transformedResponse)
                const error = transformedResponse.error
                if (error != null && error != undefined) {
                    const resultArray = error.message.match('status code (\\d{3})')
                    if (resultArray != null && resultArray !== undefined && resultArray.length > 0) {
                        res.status(Number.parseInt(resultArray[1]))
                        return
                    }
                    res.send(error.message)
                    return
                }
                for (let [key, value] of Object.entries(transformedResponse.headers)) {
                    res.setHeader(key, value as number | string | ReadonlyArray<string>)
                }
                res.status(transformedResponse.status)
                res.send(transformedResponse.data)
            }
        )
            .catch(e => {
                console.error(e)
                res.send(e.message)
            })
    })

    if (appConfig.proxyHttpServer !== undefined) {
        appConfig.proxyHttpServer?.close()
    }
    const server = http.createServer(expressApp);

    appConfigStore.setProxyHttpServer(server)
    server.listen(process.env.PORT || appConfig.proxyHttpServerPort)
}
