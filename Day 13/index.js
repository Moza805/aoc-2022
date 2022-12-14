import fs from "fs";
const data = fs.readFileSync("./input.txt", "utf-8");

//  1 bad
//  0 continue
// -1 good

const resolve = ([a, b]) => {
  if (typeof a === "number" && typeof b === "number") {
    return +a - +b;
  } else if (typeof a === "object" && typeof b === "object") {
    let good = 0;
    while (b.length) {
      const aArgy = a.shift();
      const bArgy = b.shift();

      if (aArgy === undefined) {
        good = -1;
        break;
      }

      // teehee
      good = resolve([aArgy, bArgy]);

      if (good !== 0) {
        break;
      }
    }
    if (good === 0) {
      good = a.length;
    }
    return good;
  } else {
    a = typeof a === "number" ? [a] : a;
    b = typeof b === "number" ? [b] : b;
    return resolve([a, b]);
  }
};

const flatten = (packet) =>
  packet.flatMap((data) =>
    typeof data === "object" ? (data?.length ? flatten(data) : 0) : +data
  );

const partA = data
  .split(/\r?\n\r?\n/g)
  .filter((x) => x.startsWith("\n") === false)
  .map((x) => x.split(/\r?\n/).map((x) => JSON.parse(x)))
  .map(resolve);

console.log(
  "Part A:",
  partA.reduce((agg, curr, idx) => (curr < 0 ? agg + idx + 1 : agg), 0)
);

const partB = data
  .split(/\r?\n/)
  .filter((x) => x.length > 0 && x.startsWith("\n") === false)
  .map((x) => JSON.parse(x))
  .map(flatten)
  .sort((a, b) => {
    let diff = 0;

    for (const aIdx in a) {
      if (+b[aIdx] === undefined) {
        diff = -1;
        break;
      }

      diff = +a[aIdx] - +b[aIdx];

      if (diff !== 0) break;
    }
    if (diff === 0) diff = a.length - b.length;
    return diff;
  });

partB.splice(
  partB.findIndex((x) => x[0] && x[0] > 2),
  0,
  [2]
);
partB.splice(
  partB.findIndex((x) => x[0] && x[0] > 6),
  0,
  [6]
);

console.log(
  "Part B:",
  (partB.findIndex((x) => x[0] && x[0] === 2) + 1) *
    (partB.findIndex((x) => x[0] && x[0] === 6) + 1)
);
