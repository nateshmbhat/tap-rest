<script>
  import { Button, Icon, ProgressCircular } from "svelte-materialify/src";
  import { activeTabConfigStore } from "../../../stores";
  import { ClientManager} from "../../behaviour/clientManager";
  let requestInProgress = false;

  const setResponseEditorText = (text: string) => {
    activeTabConfigStore.setClientResponseEditorState({
      ...$activeTabConfigStore.clientResponseEditorState,
      text
    });
  };

  async function onClick(e: any) {
    if (requestInProgress) return;
    requestInProgress = true;
    const requestModel = $activeTabConfigStore.clientRequestEditorState;
    ClientManager.sendRequest();
  }
</script>

<Button on:click={onClick} size="small" class="primary-color" fab>
  {#if requestInProgress}
    <ProgressCircular indeterminate color="primary" />
  {:else}
    <Icon class="mdi mdi-play" />
  {/if}
</Button>
