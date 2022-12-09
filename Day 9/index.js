import fs from "fs";

const moves = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((row) => {
    const parts = row.split(" ");
    return [
      ["U", "D"].includes(parts[0]) ? 1 : 0,
      +parts[1] * (["U", "L"].includes(parts[0]) ? -1 : 1),
    ];
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
    ({ knots, heatMap }, [axis, distance]) => {
      for (let i = 0; i < Math.abs(distance); i++) {
        knots = knots.reduce((result, knot) => {
          if (result.length === 0) {
            knot[axis] += distance < 0 ? -1 : 1;
          } else {
            const following = result[result.length - 1];
            const [xDiff, yDiff] = [
              following[0] - knot[0],
              following[1] - knot[1],
            ];
            const [absX, absY] = [Math.abs(xDiff), Math.abs(yDiff)];

            if (absX + absY > 2) {
              knot[0] += xDiff > 0 ? 1 : -1;
              knot[1] += yDiff > 0 ? 1 : -1;
            } else if (absX > 1) {
              knot[0] += xDiff > 0 ? 1 : -1;
            } else if (absY > 1) {
              knot[1] += yDiff > 0 ? 1 : -1;
            }
          }
          result.push(knot);

          return result;
        }, []);

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
