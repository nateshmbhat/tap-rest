<script lang="ts">
  import { TextField } from "svelte-materialify/src";

  import { activeTabConfigStore, appConfigStore } from "../../../stores";
  $: targetServer = $activeTabConfigStore.targetHttpServerUrl;
</script>

<div class="row border rounded fullwidth">
  <span style="flex: 0 0 115px" class="primary-color white-text pa-1 pl-2 pr-2"
    >Target Server
  </span>

  <!-- <TextField dense solo color='color-primary'   /> -->

  <input
    id="host-input"
    class="fullwidth"
    on:input={e =>
      activeTabConfigStore.setTargetHttpServerUrl(e.currentTarget.value)}
    value={targetServer}
    placeholder="api.example.com/users/"
  />

  <!-- <input
    id="path-input"
    class="fullwidth"
    value={"/hello/itsme/"}
    placeholder="/users/1"
  /> -->
</div>

<style>
  #host-input {
    text-indent: 5px;
  }
</style>
