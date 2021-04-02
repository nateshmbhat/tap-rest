<script lang="ts">
  import ServerConfigController from "../../../components/serverConfigController/ServerConfigController.svelte";
  import { Row, Col, Divider } from "svelte-materialify/src";
  import ResponseMonitor from "./components/ResponseMonitor.svelte";
  import RequestMonitor from "./components/RequestMonitor.svelte";
</script>

<div class="page">
  <ServerConfigController />
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
