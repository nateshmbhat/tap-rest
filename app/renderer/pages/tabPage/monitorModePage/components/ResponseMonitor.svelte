<script lang="ts">
  import { activeTabConfigStore } from "../../../../../stores";
  import { Row, Col, Divider } from "svelte-materialify/src";
  import LiveEditCheckBox from "./LiveEditCheckBox.svelte";
  import GenericEditor from "../../../../components/editors/GenericEditor.svelte";
  import { EditorDataFlowMode } from "../../../../../commons";

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
</script>

<Col>
  <LiveEditCheckBox
    checked={responseLiveEditEnabled}
    checkBoxLabel="Change Response"
    on:change={e => changeResponseMode(e.detail)}
    on:proceed={responseEditDone}
  />

  <GenericEditor
    text={responseState.text}
    on:textChange={e => {
      activeTabConfigStore.setMonitorResponseEditorState({
        ...responseState,
        text: e.detail
      });
    }}
  />
</Col>
