import fs from "fs";

const moves = fs
  .readFileSync("./input.txt", "utf-8")
  //   `R 4
  // U 4
  // L 3
  // D 1
  // R 4
  // D 1
  // L 5
  // R 2`
  .split(/\r?\n/)
  .map((row) => {
    const parts = row.split(" ");
    const axis = parts[0] === "U" || parts[0] === "D" ? 1 : 0;

    const distance =
      +parts[1] * (parts[0] === "U" || parts[0] === "L" ? -1 : 1);

    return {
      axis,
      distance,
    };
  });

const partA = moves.reduce(
  ({ h, t, m }, { axis, distance }) => {
    const sign = distance < 0 ? -1 : 1;

    for (let i = 0; i < Math.abs(distance); i++) {
      h[axis] += sign;
      const [xDiff, yDiff] = [h[0] - t[0], h[1] - t[1]];
      const [absXDiff, absYDiff] = [Math.abs(xDiff), Math.abs(yDiff)];

      if ((xDiff === 0 && absYDiff > 1) || (yDiff === 0 && absXDiff > 1)) {
        t[axis] += sign;
      } else if (absXDiff > 1 || absYDiff > 1) {
        const otherAxis = axis === 0 ? 1 : 0;
        const otherSign = h[otherAxis] - t[otherAxis] < 0 ? 1 : -1;
        t[axis] += sign;
        t[otherAxis] -= otherSign;
      }

      m[t[0]] = m[t[0]] || {};
      m[t[0]][t[1]] = m[t[0]][t[1]] || 0;

      m[t[0]][t[1]] += 1;
    }

    return { h, t, m };
  },
  {
    h: [0, 0],
    t: [0, 0],
    m: {},
  }
);

const uniqueTailVisits = Object.values(partA.m).reduce(
  (agg, row) => (agg += Object.values(row).length),
  0
);
console.log("Unique tail visits:", uniqueTailVisits);
