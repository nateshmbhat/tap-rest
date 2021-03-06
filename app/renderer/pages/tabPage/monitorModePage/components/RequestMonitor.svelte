<script>
  import { EditorDataFlowMode } from './../../../../../commons/types'
  import { activeTabConfigStore } from '../../../../../stores'
  import { Col, ExpansionPanels } from 'svelte-materialify/src'
  import LiveEditCheckBox from './LiveEditCheckBox.svelte'
  import ConnectionComponentEditor from './ConnectionComponentEditor.svelte'
  import { StringUtil } from '../../../../../commons/utils/util'
  import type { IncomingRequest } from '../../../../../commons'

  const changeRequestMode = async (enableDataEdit: boolean) => {
    activeTabConfigStore.setMonitorRequestEditorState({
      ...$activeTabConfigStore.monitorRequestEditorState,
      dataFlowMode: enableDataEdit
        ? EditorDataFlowMode.liveEdit
        : EditorDataFlowMode.passThrough,
    })
  }

  const requestEditDone = async () => {
    $activeTabConfigStore.monitorRequestEditorState.eventEmitter.emitEditingDone()
  }

  $: requestLiveEditEnabled =
    $activeTabConfigStore.monitorRequestEditorState.dataFlowMode ==
    EditorDataFlowMode.liveEdit

  $: requestState = $activeTabConfigStore.monitorRequestEditorState
  let incomingRequest: IncomingRequest | undefined
  $: incomingRequest = requestState.incomingRequest
  
  function changeMonitorRequestState(updateObject: any) {
    activeTabConfigStore.setMonitorRequestEditorState({
      ...requestState,
      incomingRequest: {
        ...incomingRequest!,
        ...updateObject,
      },
    })
  }

  function changeBody(text: string) {
    try {
      changeMonitorRequestState({ body: JSON.parse(text) })
    } catch (e) {
      console.warn(e)
    }
  }
  function changeHeaders(text: string) {
    try {
      changeMonitorRequestState({ headers: JSON.parse(text) })
    } catch (e) {
      console.warn(e)
    }
  }
  function changeQueryParams(text: string) {
    try {
      changeMonitorRequestState({ query: JSON.parse(text) })
    } catch (e) {
      console.warn(e)
    }
  }
</script>

<Col>
  <LiveEditCheckBox
    checked={requestLiveEditEnabled}
    checkBoxLabel="Change Request"
    on:change={e => changeRequestMode(e.detail)}
    on:proceed={requestEditDone}
  />
  {#if incomingRequest !== undefined}
    <ExpansionPanels class="pa-0">
      <ConnectionComponentEditor
        visible={incomingRequest.body !== undefined}
        readonly={!requestLiveEditEnabled}
        width="100%"
        height={"400"}
        title="Body"
        text={StringUtil.jsonStringify(incomingRequest.body)}
        on:textChange={e => changeBody(e.detail)}
      />

      <ConnectionComponentEditor
        visible={incomingRequest.headers !== undefined}
        readonly={!requestLiveEditEnabled}
        width="100%"
        height={"350"}
        title="Headers"
        text={StringUtil.jsonStringify(incomingRequest.headers)}
        on:textChange={e => changeHeaders(e.detail)}
      />

      <ConnectionComponentEditor
        visible={incomingRequest.query !== undefined}
        readonly={!requestLiveEditEnabled}
        width="100%"
        height={"150"}
        title="Query Params"
        text={StringUtil.jsonStringify(incomingRequest.query)}
        on:textChange={e => changeQueryParams(e.detail)}
      />
    </ExpansionPanels>
  {:else}
    <div class="center waiting-for-request">Waiting for Request...</div>
  {/if}
</Col>

<style>
  .waiting-for-request {
    display: grid;
    place-items: center;
    height: 100%;
  }
</style>
