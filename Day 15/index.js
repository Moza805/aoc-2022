import fs from "fs";

const getRectilinearDistance = (a, b) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

const sensors = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((x) => x.match(/-?\d+/g))
  .map((x) => ({ loc: [+x[0], +x[1]], near: [+x[2], +x[3]] }))
  .map((x) => ({
    ...x,
    rad: getRectilinearDistance(x.loc, x.near),
  }));

const yAxisData = sensors.reduce(
  (result, sensor) => {
    const options = [
      result.min,
      sensor.loc[0],
      sensor.near[0],
      result.max,
    ].sort((a, b) => a - b);
    const min = options.at(0) - sensor.rad;
    const max = options.at(-1) + sensor.rad;
    result.min = result.min > min ? min : result.min;
    result.max = result.max < max ? max : result.max;
    result.length = Math.abs(min) + Math.abs(max) + 1;

    return result;
  },
  { min: 0, max: 0, length: 1 }
);

const row = 2000000;
const part1 = new Array(yAxisData.length).fill(null).reduce(
  (agg, _, index) => {
    if (
      sensors.some((sensor) => {
        const distance = getRectilinearDistance(sensor.loc, [
          index + yAxisData.min,
          row,
        ]);
        return sensor.rad >= distance;
      })
    ) {
      agg++;
    }
    return agg;
  },
  new Set(
    sensors
      .map((x) => x.near)
      .filter((x) => x[1] === row)
      .map((x) => x[0] + x[1])
  ).size * -1
);

console.log("Part 1:", part1);

const limit = 4000000;
let partB = undefined;

for (const sensor of sensors) {
  for (
    let x = sensor.loc[0] + sensor.rad * -1;
    x <= sensor.loc[0] + sensor.rad;
    x++
  ) {
    let yStart = sensor.loc[1] - (sensor.rad - Math.abs(x - sensor.loc[0])) - 1;
    let yEnd =
      sensor.loc[1] -
      (sensor.rad - Math.abs(x - sensor.loc[0])) +
      (sensor.rad - Math.abs(x - sensor.loc[0])) * 2 -
      1;
    if (
      yStart < 0 ||
      yEnd > limit ||
      yStart > limit ||
      yEnd < 0 ||
      x < 0 ||
      x > limit
    ) {
      continue;
    }
    if (
      sensors.every((s) => {
        const distance = getRectilinearDistance([x, yStart], s.loc);

        return s.rad < distance;
      })
    ) {
      partB = [x, yStart];
      break;
    } else if (
      sensors.every((s) => {
        const distance = getRectilinearDistance([x, yEnd], s.loc);

        return s.rad < distance;
      })
    ) {
      partB = [x, yEnd];
      break;
    }
  }
}

console.log("Part 2:", partB[0] * limit + partB[1]);
