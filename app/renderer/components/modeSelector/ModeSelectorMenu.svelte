<script lang="ts">
  import { Button, List, ListItem, Menu } from 'svelte-materialify/src'
  import { OperationMode, activeTabConfigStore } from '../../../stores'
  const modes = Object.values(OperationMode)
  $: currentMode = $activeTabConfigStore.OperationMode

  const changeMode = (mode: OperationMode) => {
    activeTabConfigStore.setOperationMode(mode)
  }
</script>

<Menu>
  <div slot="activator">
    <Button active>{currentMode}</Button>
  </div>
  <List>
    {#each modes as mode (mode)}
      <ListItem on:click={(e) => changeMode(mode)}>{mode}</ListItem>
    {/each}
  </List>
</Menu>
