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
      $data[existingEntryIndexForToday].value = value;
    } else if (existingEntryIndexForToday !== null && value === null) {
      $data = $data.filter((_, i) => i !== existingEntryIndexForToday);
    } else if (value !== null) {
      $data = [
        ...$data,
        {
          date: today,
          value,
        },
      ];
    }
  }

  $: formattedTenDayAvg = $tenDayAvg ? $tenDayAvg.toFixed(1) + " kg" : null;
</script>

<main>
  {#if formattedTenDayAvg}
    <h1>10 Day Average: {formattedTenDayAvg}</h1>
  {:else}
    <h1>10 Day Average</h1>
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <label>
      <span>Today's weight:</span>
      <input type="number" bind:value min="0" max="300" step="0.1" />
      <span>kg</span>
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
    gap: 1.8em;
    font-size: 2em;
  }

  input {
    font-size: 1em;
    max-width: 80px;
  }

  label {
    display: flex;
    gap: 20px;
  }

  h1 {
    margin-bottom: 1em;
  }
</style>
