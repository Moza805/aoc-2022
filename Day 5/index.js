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

const showStacks = (stacks) => {
  const cols = Object.keys(stacks).length;
  const rows = Object.values(stacks)
    .map((x) => x.length)
    .sort((a, b) => b - a)[0];

  for (let y = 0; y < rows; y++) {
    let output = "";
    for (let x = 1; x <= cols; x++) {
      output += ` ${stacks[x.toString()][y] || " "} `;
    }
    console.log(output);
  }
};

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

const result9000 = crateMover9000(getStacks(data), procedureSteps);
const result9001 = crateMover9001(getStacks(data), procedureSteps);

showStacks(result9000);
console.log(
  "Crate mover 9000:",
  Object.values(result9000)
    .map((x) => x.slice(0, 1))
    .join("")
);

showStacks(result9001);
console.log(
  "Crate mover 9001:",
  Object.values(result9001)
    .map((x) => x.slice(0, 1))
    .join("")
);
