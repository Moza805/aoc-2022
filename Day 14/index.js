import fs from "fs";
const walls = fs
  .readFileSync("./sample.txt", "utf-8")
  .split(/\r?\n/)
  .map((edge) =>
    edge.split(" -> ").map((vertex) => vertex.split(",").map((x) => +x))
  );

const rotate = (forest, direction = "right") => {
  const matrix = [...forest.map((x) => x.slice())];

  const rotatedMatrix = new Array(
    matrix[0].map((_) => new Array(matrix.length))
  )[0];

  direction === "left" && matrix.map((x) => x.reverse());

  matrix.forEach((row, rowIdx) =>
    row.forEach((col, colIdx) => {
      rotatedMatrix[colIdx][rowIdx] = [col];
    })
  );

  direction === "right" && rotatedMatrix.map((x) => x.reverse());

  return rotatedMatrix;
};

const drawGrid = (grid, perspective) => {
  console.clear();

  const rotated = perspective === true ? rotate(grid, "right") : grid;

  for (const row of rotated) {
    console.log(row.join(""));
  }
};

const boundaries = walls.reduce(
  (boundaries, edge) => {
    const limits = {
      max: { x: edge[0][0], y: edge[0][1] },
      min: { x: edge[0][0], y: edge[0][1] },
    };

    for (const vertex of edge) {
      if (vertex[0] > limits.max.x) limits.max.x = vertex[0];
      else if (vertex[0] < limits.min.x) limits.min.x = vertex[0];
      if (vertex[1] > limits.max.y) limits.max.y = vertex[1];
      else if (vertex[1] < limits.min.y) limits.min.y = vertex[1];
    }
    if (boundaries.max.x < limits.max.x) boundaries.max.x = limits.max.x;
    if (boundaries.max.y < limits.max.y) boundaries.max.y = limits.max.y;
    if (boundaries.min.x > limits.min.x) boundaries.min.x = limits.min.x;
    if (boundaries.min.y > limits.min.y) boundaries.min.y = limits.min.y;

    return boundaries;
  },
  { max: { x: -Infinity, y: -Infinity }, min: { x: Infinity, y: 0 } }
);

const xOffset = boundaries.min.x;
const yOffset = boundaries.min.y;

const getGrid = () => {
  const grid = new Array(boundaries.max.x - boundaries.min.x + 1)
    .fill(null)
    .map((x) => new Array(boundaries.max.y - boundaries.min.y + 1).fill("."));

  for (const wall of walls) {
    for (let i = 0; i < wall.length - 1; i++) {
      let a = wall[i];
      let b = wall[i + 1];

      const cursor = [a[0], a[1]];
      const axis = a[0] - b[0] === 0 ? 1 : 0;
      const sign = a[axis] < b[axis] ? 1 : -1;

      do {
        grid[cursor[0] - xOffset][cursor[1] - yOffset] = "#";
        cursor[axis] += sign;
      } while (cursor[axis] !== b[axis] + sign);
    }
  }
  return grid;
};

const place = (grid, x, y, infinityWalls = []) => {
  let floorIndex = grid[x].slice(y ?? 0).findIndex((x) => x !== ".") + (y ?? 0);
  if (floorIndex === -1 && infinityWalls) {
    floorIndex =
      infinityWalls.filter((iW) => iW > y).sort((a, b) => a - b)[0] || -1;
  }
  let left = [x - 1, floorIndex];
  let right = [x + 1, floorIndex];

  drawGrid(grid, true);

  if (left[0] < 0) {
    grid.unshift(new Array(grid[0].length).fill("."));
    left[0]++;
    right[0]++;
    x++;
  }
  if (right[0] > grid[x].length) {
    grid.push(new Array(grid[x].length).fill("."));
  }

  if (floorIndex === -1) {
    return true;
  }

  if (
    infinityWalls.includes(floorIndex) === false &&
    grid[left[0]][left[1]] === "."
  ) {
    return place(grid, left[0], left[1], infinityWalls);
  } else if (
    infinityWalls.includes(floorIndex) === false &&
    grid[right[0]][right[1]] === "."
  ) {
    return place(grid, right[0], right[1], infinityWalls);
  } else {
    grid[x][floorIndex - 1] = "+";
  }
  drawGrid(grid, true);
};

let sand = 0;
const aGrid = getGrid();
while (!place(aGrid, 500 - xOffset)) {
  sand++;
}

drawGrid(aGrid, true);
console.log("Part A:", sand);

// boundaries.max.y += 2;
// const infinityWalls = [boundaries.max.y];
// const bGrid = getGrid();

// while (!place(bGrid, 500 - xOffset, null, infinityWalls)) {
//   sand++;
// }
//drawGrid(bGrid, true);
