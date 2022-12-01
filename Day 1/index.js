import fs from "fs";

const start = async () => {
  const data = fs.readFileSync("./input.txt", "utf-8");

  const highestSum = data.split(/\r?\n/).reduce(
    (agg, curr) => {
      if (curr) {
        agg.currGroup += +curr;
      } else {
        if (agg.highest < agg.currGroup) agg.highest = agg.currGroup;
        agg.totals.push(agg.currGroup);
        agg.currGroup = 0;
      }
      return agg;
    },
    { highest: 0, currGroup: 0, totals: [] }
  );

  const top3 = highestSum.totals.sort((a, b) => b - a).slice(0, 3);

  console.log("   most resources with a single elf: ", highestSum.highest);
  console.log("top three elves with most resources: ", top3);
  console.log(
    "total resources for top three elves: ",
    top3.reduce((agg, curr) => (agg += curr))
  );
};

start();
