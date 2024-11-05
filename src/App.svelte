<script lang="ts">
  import { format } from "date-fns";
  import { tenDayAvg } from "./lib/services/compute";
  import { data } from "./lib/services/storage";

  const today = format(new Date(), "yyyy-MM-dd");

  let value: number | null = $state(null);

  let initialIndex = getExistingEntryIndexForToday();
  let reactiveIndex = $derived(
    $data.findIndex((entry) => entry.date === today)
  );

  if (initialIndex !== null) {
    value = $data[initialIndex].value;
  }

  function getExistingEntryIndexForToday(): number | null {
    const index = $data.findIndex((entry) => entry.date === today);
    return index === -1 ? null : index;
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
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

  let formattedTenDayAvg = $derived(
    $tenDayAvg ? $tenDayAvg.toFixed(2) + " kg" : null
  );
</script>

<main>
  {#if formattedTenDayAvg}
    <h1>10 Day Average: {formattedTenDayAvg}</h1>
  {:else}
    <h1>10 Day Average</h1>
  {/if}

  <form onsubmit={handleSubmit}>
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

  {#if $data.length}
    <table class="values">
      <thead>
        <tr>
          <th>Date</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        {#each $data as { date, value }}
          <tr>
            <td>{format(date, "MM/dd/yyyy")}</td>
            <td>{value}kg</td>
          </tr>
        {/each}
      </tbody>
    </table>
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

  table {
    text-align: left;
    margin: 0 auto;
    width: min-content;
    margin-top: 30%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 12px;
    border: 1px solid #505050;
  }

  thead {
    background-color: #505050;
  }

  @media (prefers-color-scheme: light) {
    thead {
      background-color: #f9f9f9;
    }
    th,
    td {
      border-color: #f9f9f9;
    }
  }
</style>
