<script>
  import { GenericEditor } from "../../../../components/editors";
  import { ExpansionPanel } from "svelte-materialify/src";

  export let text: string = "";
  export let title: string = "";
  export let height: string = "450";
  export let width: string = "100%";
  export let visible: boolean = true;
  export let isJson: boolean = true;
  export let readonly: boolean = false;
</script>

{#if visible}
  <ExpansionPanel>
    <span slot="header">{title}</span>
    <GenericEditor
      lang={isJson ? "json" : "plain_text"}
      {width}
      {height}
      {text}
      {readonly}
      on:textChange
    />
  </ExpansionPanel>
{/if}
