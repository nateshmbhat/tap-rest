<script lang="ts">
  import { activeTabConfigStore, appConfigStore } from '../../../stores'
  $: targetServer = $activeTabConfigStore.targetHttpServerUrl
</script>

<label for="target-server">Target Server :</label>
<input
  on:input={(e) => activeTabConfigStore.setTargetHttpServerUrl(e.currentTarget.value)}
  value={targetServer}
  name="target-server"
  placeholder="Target server" />
