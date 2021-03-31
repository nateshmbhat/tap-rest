<script lang="ts">
  import { activeTabConfigStore, appConfigStore } from '../../../stores'
  $: targetServer = $activeTabConfigStore.targetHttpServerUrl
</script>

<input
  on:input={(e) => activeTabConfigStore.setTargetHttpServerUrl(e.currentTarget.value)}
  value={targetServer}
  placeholder="Target server" />
