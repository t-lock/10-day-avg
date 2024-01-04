import { data } from "./storage";
import { sub, isBefore, format } from "date-fns";

const today = new Date(new Date());
const limit = format(sub(today, { days: 9 }), "yyyy-MM-dd"); //? use 9 days such that 10 days is inclusive of today

data.subscribe((entries) => {
  const valid = entries.filter((entry) => !isBefore(entry.date, limit));
  console.log(limit, valid);
  if (valid.length < entries.length) {
    console.log("setting valid");
    data.set(valid);
  }
});
