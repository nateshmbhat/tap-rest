import { derived, get, writable } from "svelte/store";
import { EditorEventEmitter } from "../renderer/behaviour/responseStateController";
import type { ClientEditorModel, MonitorRequestEditorModel, MonitorResponseEditorModel, TabConfigModel, TabListConfigModel, } from "../commons";
import { OperationMode, EditorDataFlowMode } from "../commons/types";

function getDefaultTabConfig(): TabConfigModel {
    return ({
        id: '0',
        targetHttpServerUrl: 'http://localhost:9090',
        operationMode: OperationMode.monitor,
        monitorRequestEditorState: {
            text: '',
            // incomingRequest: {
            //     body: '{}', headers: {}, hostname: '', method: 'GET', path: '', query: {},
            //     url: '', trailers: {}
            // },
            eventEmitter: new EditorEventEmitter(),
            dataFlowMode: EditorDataFlowMode.passThrough,
        },
        clientRequestEditorState: { text: '{}', metadata: '{}' },
        monitorResponseEditorState: { text: '', eventEmitter: new EditorEventEmitter(), dataFlowMode: EditorDataFlowMode.passThrough },
        clientResponseEditorState: { text: '', metadata: '{}' },
        mockRpcEditorText: 'Coming Soon...'
    });
}

function createTabListConfigStore() {
    const defaultTabConfig = getDefaultTabConfig();
    const { set, subscribe, update } = writable<TabListConfigModel>({
        activeTabIndex: 0,
        tabs: [defaultTabConfig],
    });
    return {
        subscribe,
        setActiveTab: (index: number) => update((store) => ({ ...store, activeTabIndex: index })),
        setValue: async (tabConfigListModel: TabListConfigModel) => set(tabConfigListModel),
        setActiveTabTargetHttpServerUrl: (url: string) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, targetHttpServerUrl: url }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabOperationMode: (mode: OperationMode) => update(config => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, operationMode: mode }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabMonitorRequestEditorState: (requestEditorModel: MonitorRequestEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, monitorRequestEditorState: requestEditorModel }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabMonitorResponseEditorState: (responseEditorModel: MonitorResponseEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, monitorResponseEditorState: responseEditorModel }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabClientRequestEditorState: (requestEditorModel: ClientEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, clientRequestEditorState: requestEditorModel }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabClientResponseEditorState: (responseEditorModel: ClientEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, clientResponseEditorState: responseEditorModel }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabMockRpcEditorText: (text: string) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, mockRpcEditorText: text }
            return { ...config, tabs: allTabs }
        }),
        addNewTab: () => update((config) => {
            const allTabs = Array.from(config.tabs)
            const newTab = { ...getDefaultTabConfig(), id: allTabs.length.toString() }
            allTabs.push(newTab)
            return { ...config, tabs: allTabs }
        }),
        removeTab: (index: number) => update((config) => {
            const allTabs = Array.from(config.tabs)
            let newActiveTab = config.activeTabIndex
            if (allTabs.length == 1) return config
            allTabs.splice(index, 1)
            if (config.activeTabIndex >= allTabs.length) newActiveTab = config.activeTabIndex--;
            return { ...config, tabs: allTabs }
        })
    };
}

export const tabListConfigStore = createTabListConfigStore()

function createActiveTabConfigStore() {
    const { subscribe } = derived(tabListConfigStore, (configStore) => {
        return configStore.tabs[configStore.activeTabIndex]
    })

    return {
        subscribe,
        setTargetHttpServerUrl: (url: string) => tabListConfigStore.setActiveTabTargetHttpServerUrl(url),
        setOperationMode: async (mode: OperationMode) => {
            tabListConfigStore.setActiveTabOperationMode(mode);
        },
        setMonitorRequestEditorState: (editorModel: MonitorRequestEditorModel) => tabListConfigStore.setActiveTabMonitorRequestEditorState(editorModel),
        setMonitorResponseEditorState: (editorModel: MonitorResponseEditorModel) => tabListConfigStore.setActiveTabMonitorResponseEditorState(editorModel),
        setClientRequestEditorState: (editorModel: ClientEditorModel) => tabListConfigStore.setActiveTabClientRequestEditorState(editorModel),
        setClientResponseEditorState: (editorModel: ClientEditorModel) => tabListConfigStore.setActiveTabClientResponseEditorState(editorModel),
        setMockRpcEditorText: (text: string) => tabListConfigStore.setActiveTabMockRpcEditorText(text),
    };
}


export const activeTabConfigStore = createActiveTabConfigStore();