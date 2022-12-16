const gridSize = 4000000;
const partB = new Array(gridSize)
  .fill(null)
  .map((_) => new Array(gridSize).fill(false));

for (const sensor of data) {
  for (
    let x = sensor.loc[0] + sensor.rad * -1;
    x <= sensor.loc[0] + sensor.rad;
    x++
  ) {
    if (x >= 0 && x < gridSize) {
      for (
        let y = sensor.loc[1] - (sensor.rad - Math.abs(x - sensor.loc[0]));
        y <=
        sensor.loc[1] -
          (sensor.rad - Math.abs(x - sensor.loc[0])) +
          (sensor.rad - Math.abs(x - sensor.loc[0])) * 2;
        y++
      ) {
        if (y >= 0 && y < gridSize) {
          partB[x][y] = true;
        }
      }
    }
  }
}

console.log(
  "Part B:",
  partB.findIndex((x) => x.includes(false)),
  partB.find((x) => x.includes(false)).indexOf(false)
);

partB.map((x) => console.log(x.map((x) => (x ? "T" : ".")).join(" ")));
