import { writable } from "svelte/store";
import type http from 'http'
import type { AppConfigModel } from "../commons/types";


function createAppConfigStore() {
  const { set, subscribe, update } = writable<AppConfigModel>({
    proxyHttpServerHost: '0.0.0.0',
    proxyHttpServerPort: 50052,
    proxyHttpServer: null,
    testHttpServer: null,
    testHttpServerHost: '0.0.0.0',
    testHttpServerPort: 9090,
  });

  return {
    subscribe,
    setConfig: (config: AppConfigModel) => set(config),
    setProxyHttpServerUrl: (url: string) => update((config) => ({ ...config, proxyHttpServerHost: url })),
    setProxyHttpServer: (server: any) => update((config) => {
      return ({ ...config, proxyHttpServer: server });
    }),
    setTestHttpServer: (server: any) => update((config) => {
      return ({ ...config, testHttpServer: server });
    }),
    setProtoPaths: (paths: string[]) => update(config => ({ ...config, protoPaths: paths }))
  };
}


export const appConfigStore = createAppConfigStore();
