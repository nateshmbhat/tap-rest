import { get } from "svelte/store"
import { appConfigStore } from "../stores"
import http from 'http'
import httpProxy from 'http-proxy'
import express from 'express'
import { RendererProcessInterface } from "./ipc/ipcRendererProcessInterface"
import { StringUtil } from "../commons/utils/util"


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
        RendererProcessInterface.onRequest({ body: StringUtil.stringify(body), url, method, headers, trailers, hostname, path, query }).then(
            transformedResponse => {
                console.log('transformed message : ', transformedResponse)
                res.send(transformedResponse.message)
            }
        )
            .catch(e => {
                console.error(e)
            })
    })

    if (appConfig.proxyHttpServer !== undefined) {
        appConfig.proxyHttpServer?.close()
    }
    const server = http.createServer(expressApp);

    appConfigStore.setProxyHttpServer(server)
    server.listen(process.env.PORT || appConfig.proxyHttpServerPort)
}
