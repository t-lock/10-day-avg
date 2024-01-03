import { writable, type Writable } from "svelte/store";

const localData = localStorage.getItem("data");

type Entry = {
  date: string;
  value: number;
};

export const data: Writable<Array<Entry>> = writable(
  localData ? JSON.parse(localData) : []
);

data.subscribe((entries) =>
  localStorage.setItem("data", JSON.stringify(entries))
);
