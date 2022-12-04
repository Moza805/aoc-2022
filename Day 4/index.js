import fs from "fs";

const cleaningSectionData = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((row) =>
    row
      .split(",")
      .map((sections) => sections.split("-").map((section) => +section))
  );

const entirelyContainedSections = cleaningSectionData.map(
  ([a, b]) => (a[0] >= b[0] && a[1] <= b[1]) || (b[0] >= a[0] && b[1] <= a[1])
);

const partiallyContainedSections = cleaningSectionData.map(([a, b]) => {
  const a0 = a[0] >= b[0] && a[0] <= b[1];
  const a1 = a[1] >= b[0] && a[1] <= b[1];

  return a0 || a1;
});

const containedInAnyWay = entirelyContainedSections.reduce((agg, curr, idx) => {
  agg.push(curr || partiallyContainedSections[idx]);
  return agg;
}, []);

console.log(
  "     Entirely contained: ",
  entirelyContainedSections.filter((a) => a === true).length
);
console.log(
  "Even slightly contained: ",
  containedInAnyWay.filter((x) => x === true).length
);
