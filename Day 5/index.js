import fs from "fs";

const data = fs.readFileSync("./input.txt", "utf-8").split(/\r?\n/);

const getStacks = (data) =>
  data
    .filter((x) => x.indexOf("[") > -1)
    .reduce((agg, row) => {
      const numberOfStacks = (data[0].length + 1) / 4;
      for (let i = 1; i <= numberOfStacks; i++) {
        if (!agg[i]) {
          agg[i] = [];
        }

        const char = row[i * 4 - 3];
        if (/[A-Z]/.test(char)) {
          agg[i].push(char);
        }
      }
      return agg;
    }, {});

const procedureSteps = data
  .filter((x) => x.startsWith("move") === true)
  .map((step) => step.match(/\d+/g));

const crateMover9000 = (initialState, steps) => {
  const arranged = { ...initialState };
  steps.forEach(([quantity, from, to]) => {
    arranged[to].splice(0, 0, ...arranged[from].splice(0, quantity).reverse());
  });

  return arranged;
};

const crateMover9001 = (initialState, steps) => {
  const arranged = { ...initialState };
  steps.forEach(([quantity, from, to]) => {
    arranged[to].splice(0, 0, ...arranged[from].splice(0, quantity));
  });

  return arranged;
};

console.log(
  "Crate mover 9000:",
  Object.values(crateMover9000(getStacks(data), procedureSteps))
    .map((x) => x.slice(0, 1))
    .join("")
);

console.log(
  "Crate mover 9001:",
  Object.values(crateMover9001(getStacks(data), procedureSteps))
    .map((x) => x.slice(0, 1))
    .join("")
);
