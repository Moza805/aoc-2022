import fs from "fs";

const getRectilinearDistance = (a, b) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

const data = fs
  .readFileSync("./sample.txt", "utf-8")
  .split(/\r?\n/)
  .map((x) => x.match(/-?\d+/g))
  .map((x) => ({ loc: [+x[0], +x[1]], near: [+x[2], +x[3]] }))
  .map((x) => ({
    ...x,
    rad: getRectilinearDistance(x.loc, x.near),
  }));

// const yAxisData = data.reduce(
//   (result, sensor) => {
//     const options = [
//       result.min,
//       sensor.loc[0],
//       sensor.near[0],
//       result.max,
//     ].sort((a, b) => a - b);
//     const min = options.at(0) - sensor.rad;
//     const max = options.at(-1) + sensor.rad;
//     result.min = result.min > min ? min : result.min;
//     result.max = result.max < max ? max : result.max;
//     result.length = Math.abs(min) + Math.abs(max) + 1;

//     return result;
//   },
//   { min: 0, max: 0, length: 1 }
// );

// const row = 2000000; // 10 for sample.txt
// const part1 = new Array(yAxisData.length).fill(null).reduce(
//   (agg, _, index) => {
//     if (
//       data.some((sensor) => {
//         const distance = getRectilinearDistance(sensor.loc, [
//           index + yAxisData.min,
//           row,
//         ]);
//         return sensor.rad >= distance;
//       })
//     ) {
//       agg++;
//     }
//     return agg;
//   },
//   new Set(
//     data
//       .map((x) => x.near)
//       .filter((x) => x[1] === row)
//       .map((x) => x[0] + x[1])
//   ).size * -1
// );

// console.log("Part 1:", part1);

const gridSize = 21;
const partB = new Array(gridSize)
  .fill(null)
  .map((_) => new Array(gridSize).fill(false));

const tempData = [{ loc: [10, 10], rad: 3 }];
for (const sensor of tempData) {
  for (
    let x = sensor.loc[0] + sensor.rad * -1;
    x <= sensor.loc[0] + sensor.rad;
    x++
  ) {
    //width = radius - distance from loc[1]
    // start = width / 2
    if (x >= 0 && x < gridSize) {
      for (
        let y = sensor.loc[1] + (sensor.loc[0] - Math.abs(x) - sensor.rad);
        y <= sensor.loc[1] + (sensor.rad + Math.abs(x) - sensor.loc[0]);
        y++
      ) {
        if (y >= 0 && y < gridSize) {
          partB[x][y] = true;
        }
      }
    }
  }
}
partB.map((x) => console.log(x.map((x) => (x ? "T" : "F")).join(" ")));
