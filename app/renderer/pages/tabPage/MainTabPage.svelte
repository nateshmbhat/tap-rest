<script>
  import { activeTabConfigStore } from "../../../stores";
  import ClientModePage from "./clientModePage/ClientModePage.svelte";
  import MonitorModePage from "./monitorModePage/MonitorModePage.svelte";
  import { Tabs, TabContent, Tab } from "svelte-materialify/src";
  import { OperationMode } from "../../../commons/types";

  const allModes = Object.values(OperationMode);
  console.log(
    "value = ",
    allModes.indexOf($activeTabConfigStore.operationMode)
  );
  const changeMode = (e: CustomEvent<number>) => {
    const newMode = allModes[e.detail];
    console.log("new mode = ", newMode);
    activeTabConfigStore.setOperationMode(newMode);
  };
</script>

<div>
  <Tabs
    vertical
    class="primary-text"
    on:change={changeMode}
    value={allModes.indexOf($activeTabConfigStore.operationMode)}
  >
    <div slot="tabs">
      {#each allModes as mode, i (mode)}
        <Tab value={i}>
          <div style="text-transform:capitalize;">{mode}</div>
        </Tab>
      {/each}
    </div>
    <div class="ma-1">
      <!-- <TabContent>
        <MockRpcModePage />
      </TabContent> -->
      <TabContent>
        <MonitorModePage />
      </TabContent>
      <!-- <TabContent>
        <ClientModePage />
      </TabContent> -->
    </div>
  </Tabs>
</div>