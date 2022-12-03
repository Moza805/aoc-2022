import fs from "fs";

const asciiRanges = [
  [97, 122],
  [65, 90],
].reduce((agg, curr) => {
  for (let i = curr[0]; i <= curr[1]; i++) {
    agg.push(String.fromCharCode(i));
  }
  return agg;
}, []);

const backpacks = fs.readFileSync("./input.txt", "utf-8").split(/\r?\n/);

const misplacedItemPriorityTotal = backpacks.reduce(
  (total, backpackContents) => {
    const itemCount = backpackContents.length;
    const compartments = [
      backpackContents.substring(0, itemCount / 2),
      backpackContents.substring(itemCount / 2),
    ];

    for (const item of compartments[0]) {
      if (compartments[1].includes(item)) {
        return total + asciiRanges.indexOf(item) + 1;
      }
    }

    return total;
  },
  0
);

const badgePriorityTotal = backpacks
  .reduce((agg, curr, index) => {
    const newIndex = Math.floor(index / 3);
    if (index % 3 === 0) {
      agg.push([]);
    }

    agg[newIndex].push(curr);

    return agg;
  }, [])
  .reduce((agg, [a, b, c]) => {
    for (const item of a) {
      if (b.includes(item) && c.includes(item)) {
        agg += asciiRanges.indexOf(item) + 1;
        break;
      }
    }

    return agg;
  }, 0);

console.log("Misplaced items priority total: ", misplacedItemPriorityTotal);
console.log("          Badge priority total: ", badgePriorityTotal);
