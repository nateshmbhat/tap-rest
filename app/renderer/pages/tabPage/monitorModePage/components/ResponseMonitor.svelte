<script lang="ts">
  import { activeTabConfigStore } from "../../../../../stores";
  import { Col, ExpansionPanels } from "svelte-materialify/src";
  import LiveEditCheckBox from "./LiveEditCheckBox.svelte";
  import { EditorDataFlowMode, IncomingResponse } from "../../../../../commons";
  import ConnectionComponentEditor from "./ConnectionComponentEditor.svelte";
  import { HttpHeaderUtil, StringUtil } from "../../../../../commons/utils/util";

  let incomingResponse: IncomingResponse | undefined;
  let isJsonData = false;

  const changeResponseMode = async (enableDataEdit: boolean) => {
    activeTabConfigStore.setMonitorResponseEditorState({
      ...$activeTabConfigStore.monitorResponseEditorState,
      dataFlowMode: enableDataEdit
        ? EditorDataFlowMode.liveEdit
        : EditorDataFlowMode.passThrough
    });
  };

  const responseEditDone = async () => {
    $activeTabConfigStore.monitorResponseEditorState.eventEmitter.emitEditingDone();
  };

  $: responseLiveEditEnabled =
    $activeTabConfigStore.monitorResponseEditorState.dataFlowMode ==
    EditorDataFlowMode.liveEdit;

  $: responseState = $activeTabConfigStore.monitorResponseEditorState;

  $: {
    incomingResponse = responseState.incomingResponse;
    if (incomingResponse !== undefined) {
      isJsonData = HttpHeaderUtil.isContentJson(incomingResponse.headers)
    }
  }

  function changeMonitorResponseState(updateObject: any) {
    activeTabConfigStore.setMonitorResponseEditorState({
      ...responseState,
      incomingResponse: {
        ...incomingResponse!,
        ...updateObject
      }
    });
  }

  function changeData(text: string) {
    changeMonitorResponseState({ data: text });
  }
  function changeHeaders(text: string) {
    try {
      changeMonitorResponseState({ headers: JSON.parse(text) });
    } catch (e) {
      console.warn(e);
    }
  }
</script>

<Col>
  <LiveEditCheckBox
    checked={responseLiveEditEnabled}
    checkBoxLabel="Change Response"
    on:change={e => changeResponseMode(e.detail)}
    on:proceed={responseEditDone}
  />
  {#if incomingResponse !== undefined}
    <ExpansionPanels value={[1]} class="pa-0">
      <ConnectionComponentEditor
        visible={incomingResponse.headers !== undefined}
        width="100%"
        height={"300"}
        title="Headers"
        text={StringUtil.jsonStringify(incomingResponse.headers)}
        on:textChange={e => changeHeaders(e.detail)}
      />
      <ConnectionComponentEditor
        visible={incomingResponse !== undefined}
        width="100%"
        height={"500"}
        isJson={isJsonData}
        title="Response Data"
        text={incomingResponse.data}
        on:textChange={e => changeData(e.detail)}
      />
    </ExpansionPanels>
  {:else}
    <div class="center waiting-for-response">Waiting for Response...</div>
  {/if}
</Col>

<style>
  .waiting-for-response {
    display: grid;
    place-items: center;
    height: 100%;
  }
</style>
