<script lang="ts">
  import ServerConfigController from "../../../components/serverConfigController/ServerConfigController.svelte";
  import { Row, Col, Divider } from "svelte-materialify/src";
  import ResponseMonitor from "./components/ResponseMonitor.svelte";
  import RequestMonitor from "./components/RequestMonitor.svelte";
  import { activeTabConfigStore } from "../../../../stores";
  import { get } from "svelte/store";
  import CapturePathSelector from "./components/CapturePathSelector.svelte";

  $: incomingRequest =
    $activeTabConfigStore.monitorRequestEditorState.incomingRequest;
  function changeUrlPath(text: string) {
    const activeTabConfig = get(activeTabConfigStore);
    activeTabConfigStore.setMonitorRequestEditorState({
      ...activeTabConfig.monitorRequestEditorState,
      incomingRequest: {
        ...incomingRequest!,
        path: text
      }
    });
  }
</script>

<div class="page">
  <ServerConfigController
    urlPath={incomingRequest === undefined ? undefined : incomingRequest.path}
    on:changeUrlPath={e => changeUrlPath(e.detail)}
  />
  <CapturePathSelector />
  <Row class="pl-2">
    <RequestMonitor />
    <Divider vertical />
    <ResponseMonitor />
  </Row>
</div>

<style>
  .page {
    height: calc(100vh - 52px);
    display: flex;
    flex-flow: column;
  }
</style>
