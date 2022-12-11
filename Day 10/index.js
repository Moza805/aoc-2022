import fs from "fs";

const output = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .reduce(
    (agg, curr) => {
      const [instruction, param] = curr.split(" ");
      const prev = agg[agg.length - 1];
      agg.push(prev);
      if (instruction === "addx") {
        agg.push(prev + +param);
      }

      return agg;
    },
    [1]
  );

const signalStrengthSum = [20, 60, 100, 140, 180, 220].reduce(
  (agg, curr) => agg + output[curr - 1] * curr,
  0
);
console.log("Part A:", signalStrengthSum);

console.clear();

output.forEach((register, i) => {
  const pixel = i % 40;
  process.stdout.write(
    [pixel - 1, pixel, pixel + 1].includes(register) ? "#" : " "
  );
  (i + 1) % 40 === 0 && process.stdout.write("\n");
});
