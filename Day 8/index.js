import fs from "fs";

const forest = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((row) => row.split("").map((x) => +x));

// const forest = [
//   [3, 0, 3, 7, 3],
//   [2, 5, 5, 1, 2],
//   [6, 5, 3, 3, 2],
//   [3, 3, 5, 4, 9],
//   [3, 5, 3, 9, 0],
// ];

const getVisibilityMatrix = (forest) => {
  const matrix = [...forest.map((x) => x.slice())];

  for (let rI = 1; rI < forest[0].length - 1; rI++) {
    for (let rC = 1; rC < forest.length - 1; rC++) {
      const tree = forest[rI][rC];
      const visibleLeft = forest[rI].slice(0, rC).every((t) => t < tree);

      const visible = forest[rI].slice(rC + 1).every((t) => t < tree);

      matrix[rI][rC] = visibleLeft || visible;
    }
  }

  return matrix;
};

const rotate = (forest, direction = "right") => {
  const matrix = [...forest.map((x) => x.slice())];

  const rotatedMatrix = new Array(
    matrix[0].map((_) => new Array(matrix.length))
  )[0];

  direction === "left" && matrix.map((x) => x.reverse());

  matrix.forEach((row, rowIdx) =>
    row.forEach((col, colIdx) => {
      rotatedMatrix[colIdx][rowIdx] = col;
    })
  );

  direction === "right" && rotatedMatrix.map((x) => x.reverse());

  return rotatedMatrix;
};

let tally = 2 * forest.length + 2 * forest[0].length - 4;

const xMatrix = getVisibilityMatrix(forest);
const rotatedForest = rotate(forest, "right");
const y = getVisibilityMatrix(rotatedForest);
const yMatrix = rotate(y, "left");

var result = xMatrix.map((row, rowIdx) =>
  row.map((col, colIdx) => {
    return col || yMatrix[rowIdx][colIdx];
  })
);

console.log(
  tally + result.flatMap((row) => row.filter((y) => y === true)).length
);
