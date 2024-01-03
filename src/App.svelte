<script lang="ts">
  import { data } from "./lib/services/storage";
  import { tenDayAvg } from "./lib/services/compute";
  import { format } from "date-fns";

  const today = format(new Date(), "yyyy-MM-dd");

  let value: number | null;

  let initialIndex = getExistingEntryIndexForToday();
  $: reactiveIndex = $data.findIndex((entry) => entry.date === today);

  if (initialIndex !== null) {
    value = $data[initialIndex].value;
  }

  function getExistingEntryIndexForToday(): number | null {
    const index = $data.findIndex((entry) => entry.date === today);
    return index === -1 ? null : index;
  }

  function handleSubmit() {
    if (typeof value === "undefined") return;
    const existingEntryIndexForToday = getExistingEntryIndexForToday();
    if (existingEntryIndexForToday !== null && value !== null) {
      console.log("rewrite today");
      $data[existingEntryIndexForToday].value = value;
    } else if (existingEntryIndexForToday !== null && value === null) {
      console.log("remove today");
      $data = $data.filter((_, i) => i !== existingEntryIndexForToday);
    } else if (value !== null) {
      console.log("add value");
      $data = [
        ...$data,
        {
          date: today,
          value,
        },
      ];
    }
  }

  $: console.table({ data: $data, tenDayAvg: $tenDayAvg });
  $: console.log(reactiveIndex);
</script>

<main>
  <h1>10 Day Average: {$tenDayAvg ?? ""}</h1>

  <form on:submit|preventDefault={handleSubmit}>
    <label>
      <span>Today's weight:</span>
      <input type="number" bind:value min="0" max="300" /> <span>kg</span>
    </label>
    <button type="submit">Save</button>
  </form>

  {#if reactiveIndex !== -1}
    <p>Be sure to come back tomorrow!</p>
  {/if}
</main>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 40px;
    font-size: 30px;
  }

  input {
    font-size: 30px;
    max-width: 80px;
  }

  label {
    display: flex;
    gap: 20px;
  }
</style>
