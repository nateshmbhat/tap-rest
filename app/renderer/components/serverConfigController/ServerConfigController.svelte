<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { Divider } from "svelte-materialify/src";
  import { activeTabConfigStore, appConfigStore } from "../../../stores";
  $: targetServer = $activeTabConfigStore.targetHttpServerBaseUrl;
  export let urlPath: string;

  const dispatch = createEventDispatcher<{ changeUrlPath: string }>();
</script>

<div class="row border rounded fullwidth">
  <span style="flex: 0 0 115px" class="primary-color white-text pa-1 pl-2 pr-2"
    >Target Server
  </span>

  <input
    style="text-indent: 5px;"
    class="fullwidth"
    on:input={e =>
      activeTabConfigStore.setTargetHttpServerUrl(e.currentTarget.value)}
    value={targetServer}
    placeholder="https://api.example.com"
  />

  <Divider vertical />
  {#if urlPath}
    <input
      id="path-input"
      style="text-indent: 5px;"
      class="fullwidth"
      value={urlPath}
      on:input={e => dispatch("changeUrlPath", e.currentTarget.value)}
      placeholder="/users/profile/83828"
    />
  {/if}
</div>
