<script>
  import { activeTabConfigStore } from "../../../../../stores";

  let errorMessage: string = "";

  $: monitorRequestEditorState =
    $activeTabConfigStore.monitorRequestEditorState;

  function setCapturePath(value: string) {
    try {
      const regExp = RegExp(value);
      activeTabConfigStore.setMonitorRequestEditorState({
        ...monitorRequestEditorState,
        capturePathSelector: regExp
      });
      errorMessage = "";
    } catch (e) {
      console.warn(e);
      errorMessage = e.message;
    }
  }
</script>

<div class="row border rounded fullwidth">
  <span style="flex: 0 0 auto" class="primary-color white-text pa-1 pl-2 pr-2"
    >Capture Path Selector Regex
  </span>

  <div class="col fullwidth">
    <input
      style="text-indent: 5px;"
      class="fullwidth"
      on:input={e => setCapturePath(e.currentTarget.value)}
      value={monitorRequestEditorState.capturePathSelector.source}
      placeholder="Regex : /users/path"
    />
    {#if errorMessage.length > 0}
      <span class="red-text">
        {errorMessage}
      </span>
    {/if}
  </div>
</div>
