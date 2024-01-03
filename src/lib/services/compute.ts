import { writable, type Writable } from "svelte/store";
import { data } from "./storage";

export const tenDayAvg: Writable<number | null> = writable(null);

data.subscribe((entries) => {
  entries = entries.filter((entry) => entry || entry === 0);
  if (!entries.length) tenDayAvg.set(null);
  else tenDayAvg.set(avg(entries.map(({ value }) => value)));
});

function avg(arr: Array<number>): number {
  return arr.reduce((prev, curr) => prev + curr, 0) / arr.length;
}
