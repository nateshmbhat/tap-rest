import { get } from "svelte/store"
import { appConfigStore } from "../../../stores"
import http from 'http'
import express from 'express'


export const startTestHttpServer = async (): Promise<void> => {
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
        res.send('Hello World !')
    })

    const server = http.createServer(expressApp);

    appConfigStore.setTestHttpServer(server)
    server.listen(process.env.PORT || appConfig.testHttpServerPort)
}