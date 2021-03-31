<script lang="ts">
  import TapRest from "./renderer/components/TapRest.svelte";
  import { MaterialApp } from "svelte-materialify";
  import { onMount } from "svelte";
  import { MainProcessInterface } from "./renderer/ipc/ipcMainProcessInterface";
  onMount(() => {
    MainProcessInterface.startServer();
  });
</script>

<MaterialApp>
  <TapRest />
</MaterialApp>

<style global>
  * {
    box-sizing: border-box;
  }
  html,
  body {
    position: relative;
    width: 100%;
    height: 100%;
  }

  label {
    display: block;
    user-select: none;
  }

  .d-flex {
    display: flex;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .col {
    display: flex;
    flex-direction: column;
  }
  .center {
    text-align: center;
  }
  .border {
    border: 1px solid black;
  }
</style>
