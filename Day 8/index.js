import fs from "fs";

const forest = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((row) => row.split("").map((x) => +x));

const getVisibilityMatrix = (forest) => {
  const matrix = [...forest.map((x) => x.slice())];

  for (let rI = 1; rI < forest[0].length - 1; rI++) {
    for (let rC = 1; rC < forest.length - 1; rC++) {
      const tree = forest[rI][rC];
      const visibleLeft = forest[rI].slice(0, rC).every((t) => t < tree);
      const visible =
        visibleLeft || forest[rI].slice(rC + 1).every((t) => t < tree);

      matrix[rI][rC] = visible;
    }
  }

  return matrix;
};

const getScenicMatrix = (forest) => {
  const matrix = [...forest.map((x) => x.slice())];

  for (let rI = 0; rI < forest[0].length; rI++) {
    for (let rC = 0; rC < forest.length; rC++) {
      const tree = forest[rI][rC];

      let left = forest[rI].slice(0, rC).reverse();
      left =
        left.findIndex((t) => t >= tree) === -1
          ? left.length
          : left.findIndex((t) => t >= tree) + 1;

      let right = forest[rI].slice(rC + 1);
      right =
        right.findIndex((t) => t >= tree) === -1
          ? right.length
          : right.findIndex((t) => t >= tree) + 1;

      matrix[rI][rC] = left * right;
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

const part1 = (forest) => {
  let tally = 2 * forest.length + 2 * forest[0].length - 4;

  const xMatrix = getVisibilityMatrix(forest);
  const rotatedForest = rotate(forest, "right");
  const y = getVisibilityMatrix(rotatedForest);
  const yMatrix = rotate(y, "left");

  tally += xMatrix
    .map((row, rowIdx) =>
      row.map((col, colIdx) => {
        return col || yMatrix[rowIdx][colIdx];
      })
    )
    .flatMap((row) => row.filter((y) => y === true)).length;

  return tally;
};

const part2 = (forest) => {
  const xMatrix = getScenicMatrix(forest);
  const rotatedForest = rotate(forest, "right");
  const y = getScenicMatrix(rotatedForest);
  const yMatrix = rotate(y, "left");

  return xMatrix
    .flatMap((row, rowIdx) =>
      row.map((col, colIdx) => {
        return col * yMatrix[rowIdx][colIdx];
      })
    )
    .sort((a, b) => a - b)
    .pop();
};

console.log("Visibility score:", part1(forest));
console.log("    Scenic score:", part2(forest));
