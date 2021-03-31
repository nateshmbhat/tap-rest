import { writable } from "svelte/store";
export interface AppConfigModel {
  proxyHttpServerUrl: string;
  proxyHttpServer: any| null;
  testHttpServer: any| null;
  testHttpServerUrl: string;
}

export enum RpcOperationMode {
  mockRpc = 'mockRpc',
  monitor = 'monitor',
  client = 'client',
}

export interface RequestResponseEditorModel {
  requestText: string;
  responseText: string;
}

function createAppConfigStore() {
  const { set, subscribe, update } = writable<AppConfigModel>({
    proxyHttpServerUrl: '0.0.0.0:50051',
    proxyHttpServer: null,
    testHttpServer: null,
    testHttpServerUrl: '0.0.0.0:9090',
  });

  return {
    subscribe,
    setConfig: (config: AppConfigModel) => set(config),
    setProxyHttpServerUrl: (url: string) => update((config) => ({ ...config, proxyHttpServerUrl: url })),
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
