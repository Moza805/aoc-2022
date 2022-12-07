import fs from "fs";

class DirNode {
  constructor(label, parent) {
    this.label = label;
    this.parent = parent;
    this.files = {};
    this.directories = {};
  }

  get size() {
    const fSize = Object.values(this.files).reduce(
      (agg, curr) => (agg += curr),
      0
    );
    const dSize = Object.values(this.directories).reduce(
      (agg, curr) => (agg += curr.size),
      0
    );

    return fSize + dSize;
  }
}

var directoryListing = fs.readFileSync("./input.txt", "utf-8").split(/\r?\n/);
const root = directoryListing.shift();

let directoryTree = new DirNode(root.split(" ")[2], null);
let pointer = directoryTree;

for (const row of directoryListing) {
  const data = row.split(" ");

  if (data[0] === "$" && data[1] == "cd") {
    pointer = data[2] === ".." ? pointer.parent : pointer.directories[data[2]];
  } else if (data[0] === "dir") {
    pointer.directories[data[1]] = new DirNode(data[1], pointer);
  } else if (/\d+/.test(data[0])) {
    pointer.files[data[1]] = +data[0];
  }
}

const flattenDirs = ({ size, label, directories }) => {
  const result = [];

  result.push({ label: label, size });

  result.push(
    ...Object.values(directories).flatMap((directory) => flattenDirs(directory))
  );

  return result;
};

const directorySizes = flattenDirs(directoryTree).sort(
  (a, b) => b.size - a.size
);

console.log(
  " Total size of dirs under 100000: ",
  directorySizes
    .filter((x) => x.size < 100000)
    .reduce((agg, curr) => (agg += curr.size), 0)
);

const totalDriveSize = 70000000;
const updateSize = 30000000;
const remainingDriveSize = totalDriveSize - directoryTree.size;
const requiredSizeSaving = updateSize - remainingDriveSize;

const suggestedDirForDeletion = directorySizes
  .filter((x) => x.size >= requiredSizeSaving)
  .pop();

console.log(
  `Directory suggested for deletion:  ${suggestedDirForDeletion.label} (${suggestedDirForDeletion.size})`
);
