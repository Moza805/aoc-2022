import fs from "fs";
const grid = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((row, yIdx) =>
    [...row].map((x, xIdx) => ({
      v: x.charCodeAt(0),
      e: false,
      y: yIdx,
      x: xIdx,
    }))
  );

const findFirst = (charGrid, char) => {
  const charCode = char.charCodeAt(0);
  const y = charGrid.findIndex((row) => row.some((x) => x.v === charCode));
  return [charGrid[y].findIndex((x) => x.v === charCode), y];
};

const BFS = (g, root) => {
  const grid = g.map((row) =>
    row.map((pos) => ({ e: false, x: pos.x, y: pos.y, v: pos.v }))
  );
  const queue = [];
  const r = grid[root[1]][root[0]];
  r.e = true;
  queue.push(r);
  while (queue.length) {
    const v = queue.shift();
    if (v.x === endX && v.y === endY) {
      return v;
    }

    const edges = [
      [v.x + 1, v.y],
      [v.x, v.y + 1],
      [v.x - 1, v.y],
      [v.x, v.y - 1],
    ].filter(
      (x) =>
        x[0] > -1 &&
        x[1] > -1 &&
        x[0] < grid[0].length &&
        x[1] < grid.length &&
        grid[x[1]][x[0]].v <= v.v + 1
    );

    for (const edge of edges) {
      const neighbour = grid[edge[1]][edge[0]];
      if (neighbour.e === false) {
        neighbour.e = true;
        neighbour.p = grid[v.y][v.x];
        queue.push(neighbour);
      }
    }
  }
};

const [startX, startY] = findFirst(grid, "S");
grid[startY][startX].v = "a".charCodeAt(0);

const [endX, endY] = findFirst(grid, "E");
grid[endY][endX].v = "z".charCodeAt(0);

let pointer = BFS(grid, [startX, startY]);
let count = 0;
while (pointer.p) {
  count++;
  pointer = pointer.p;
}
console.log("Part A:", count);

const candidates = grid
  .flatMap((row) =>
    row
      .filter(
        (v) =>
          v.v === "a".charCodeAt(0) &&
          [
            [v.x + 1, v.y],
            [v.x, v.y + 1],
            [v.x - 1, v.y],
            [v.x, v.y - 1],
          ].some(
            (x) =>
              x[0] > -1 &&
              x[1] > -1 &&
              x[0] < grid[0].length &&
              x[1] < grid.length &&
              grid[x[1]][x[0]].v === "b".charCodeAt(0)
          )
      )
      .map((x) => {
        let pointer = BFS(grid, [x.x, x.y]);
        let count = 0;
        while (pointer.p) {
          count++;
          pointer = pointer.p;
        }
        return count;
      })
  )
  .sort((a, b) => a - b);

console.log("Part B:", candidates[0]);
