<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { AceEditor } from "svelte-ace";
  require("brace/mode/json");
  require("brace/mode/plain_text");
  require("brace/theme/chrome");
  export let width = "100%";
  export let height = "100%";
  export let readonly: boolean = true;
  export let lang = "json";
  const theme = "chrome";

  export let text = "";

  const dispatch = createEventDispatcher<{ textChange: string }>();
</script>

<AceEditor
  on:input={e => dispatch("textChange", e.detail)}
  value={text}
  {theme}
  {width}
  {lang}
  {height}
  {readonly}
/>
