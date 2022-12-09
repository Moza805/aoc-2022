import fs from "fs";

const moves = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((row) => {
    const parts = row.split(" ");
    const axis = ["U", "D"].includes(parts[0]) ? 1 : 0;
    const distance = +parts[1] * (["U", "L"].includes(parts[0]) ? -1 : 1);

    return { axis, distance };
  });

const createKnotArray = (knots) => {
  const knotArray = [];

  do {
    knotArray.push([0, 0]);
  } while (knotArray.length <= knots);

  return knotArray;
};

const simulate = (moves, numberOfKnots) =>
  moves.reduce(
    ({ knots, heatMap }, { axis, distance }) => {
      for (let i = 0; i < Math.abs(distance); i++) {
        for (const kIdx in knots) {
          if (kIdx === "0") {
            knots[0][axis] += distance < 0 ? -1 : 1;
            continue;
          }

          const [xDiff, yDiff] = [
            knots[kIdx - 1][0] - knots[kIdx][0],
            knots[kIdx - 1][1] - knots[kIdx][1],
          ];

          const [absXDiff, absYDiff] = [Math.abs(xDiff), Math.abs(yDiff)];

          if (xDiff === 0 && absYDiff > 1) {
            knots[kIdx][1] += yDiff > 0 ? 1 : -1;
          } else if (yDiff === 0 && absXDiff > 1) {
            knots[kIdx][0] += xDiff > 0 ? 1 : -1;
          } else if (absXDiff > 1 || absYDiff > 1) {
            knots[kIdx][0] += xDiff > 0 ? 1 : -1;
            knots[kIdx][1] += yDiff > 0 ? 1 : -1;
          }
        }

        const t = knots[numberOfKnots];
        heatMap[t[0]] = heatMap[t[0]] || {};
        heatMap[t[0]][t[1]] = heatMap[t[0]][t[1]] || 0;

        heatMap[t[0]][t[1]] += 1;
      }

      return { knots, heatMap };
    },
    {
      knots: createKnotArray(numberOfKnots),
      heatMap: {},
    }
  );

const getUniqueVisits = (simulationResult) =>
  Object.values(simulationResult.heatMap).reduce(
    (agg, row) => (agg += Object.values(row).length),
    0
  );

const partA = getUniqueVisits(simulate(moves, 1));
console.log("Part A unique tail visits:", partA);

const partB = getUniqueVisits(simulate(moves, 9));
console.log("Part B unique tail visits:", partB);
