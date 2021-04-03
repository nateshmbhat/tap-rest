<script lang="ts">
  import { activeTabConfigStore, appConfigStore } from "../../../stores";
  $: targetServer = $activeTabConfigStore.targetHttpServerUrl;
</script>

<div class="row">
  <div class="row border rounded">
    <label
      id="target-server-label"
      class="primary-color white-text pa-1 pl-2 pr-2"
      for="target-server"
      >Target Server
    </label>
    <input
      id="target-server-input"
      on:input={e =>
        activeTabConfigStore.setTargetHttpServerUrl(e.currentTarget.value)}
      value={targetServer}
      name="target-server"
      placeholder="api.example.com/users/"
    />
  </div>
</div>

<style>
  #target-server-input {
    text-indent: 5px;
  }
</style>
