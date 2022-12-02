import fs from "fs";

const data = fs
  .readFileSync("./input.txt", "utf-8")
  .split(/\r?\n/)
  .map((x) => x.split(" "));

const part1ValueMapper = {
  //        X(r) Y(p) Z(s)
  //  A(r)   D    W    L
  //  B(p)   L    D    W
  //  C(s)   W    L    D
  A: { X: 4, Y: 8, Z: 3 }, // 1 + 3, 2 + 6, 3 + 0
  B: { X: 1, Y: 5, Z: 9 }, // 1 + 0, 2 + 3, 3 + 6
  C: { X: 7, Y: 2, Z: 6 }, // 1 + 6, 2 + 0, 3 + 3
};

const part2ValueMapper = {
  //        X(l) Y(d) Z(w)
  //  A(r)  s(Z) r(X) p(Y)
  //  B(p)  r(X) p(Y) s(Z)
  //  C(s)  p(Y) s(Z) r(X)
  A: { X: 3, Y: 4, Z: 8 }, // 3 + 0, 1 + 3, 2 + 6
  B: { X: 1, Y: 5, Z: 9 }, // 1 + 0, 2 + 3, 3 + 6
  C: { X: 2, Y: 6, Z: 7 }, // 2 + 0, 3 + 3, 1 + 6
};

const calculate = (values, mapper) =>
  values.reduce((agg, [them, you]) => (agg += mapper[them][you]), 0);

const part1Score = calculate(data, part1ValueMapper);
const part2Score = calculate(data, part2ValueMapper);

console.log("Part 1 score:", part1Score);
console.log("Part 2 score:", part2Score);
