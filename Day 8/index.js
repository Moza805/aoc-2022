import fs from "fs";

const forest = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((row) =>
    row.split("").map((value) => ({
      visible: false,
      value,
    }))
  );

const calculateVisibilityOnXAxis = (forest) => {
  const updatedForest = [...forest];
  let count = 0;
  for (let rI = 1; rI < updatedForest[0].length - 1; rI++) {
    for (let rC = 1; rC < updatedForest.length - 1; rC++) {
      const tree = updatedForest[rI][rC];
      if (tree.visible === false) {
        const visibleLeft = updatedForest[rI]
          .slice(0, rC)
          .every((t) => t.value < tree.value);

        const visible =
          visibleLeft ||
          updatedForest[rI].slice(rC + 1).every((t) => t.value < tree.value);

        if (visible) {
          count++;
          updatedForest[rI][rC].visible = true;
        }
      }
    }
  }
  return [count, updatedForest];
};

const rotate = (forest, direction) => {
  const rotatedForest = new Array(
    forest[0].map((_) => new Array(forest.length))
  )[0];

  if (direction === "right") {
    forest.forEach((row, rowIdx) =>
      row.forEach((col, colIdx) => {
        rotatedForest[colIdx][rowIdx] = col;
      })
    );

    rotatedForest.forEach((x) => x.reverse());
  }

  return rotatedForest;
};

let tally = 2 * forest.length + 2 * forest[0].length - 4;

const [xCount, updatedForest] = calculateVisibilityOnXAxis(forest);
const rotatedForest = rotate(updatedForest, "right");
const [yCount] = calculateVisibilityOnXAxis(rotatedForest);

console.log(tally + xCount + yCount);
