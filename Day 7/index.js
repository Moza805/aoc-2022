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

const parseListing = (directoryListing) => {
  const rows = directoryListing.split(/\r?\n/);

  let directoryTree = new DirNode(rows.shift().split(" ")[2], null);
  let cursor = directoryTree;

  rows.forEach((row) => {
    const params = row.split(" ");

    if (params[0] === "$" && params[1] == "cd") {
      cursor =
        params[2] === ".." ? cursor.parent : cursor.directories[params[2]];
    } else if (params[0] === "dir") {
      cursor.directories[params[1]] = new DirNode(params[1], cursor);
    } else if (/\d+/.test(params[0])) {
      cursor.files[params[1]] = +params[0];
    }
  });

  return directoryTree;
};

const flattenDirs = ({ size, label, directories }) => [
  { label, size },
  ...Object.values(directories).flatMap((directory) => flattenDirs(directory)),
];

var directoryTree = parseListing(fs.readFileSync("./input.txt", "utf-8"));

const directorySizes = flattenDirs(directoryTree).sort(
  (a, b) => b.size - a.size
);

const remainingDriveSize = 70000000 - directoryTree.size;
const requiredSizeSaving = 30000000 - remainingDriveSize;

const suggestedDirForDeletion = directorySizes
  .filter((x) => x.size >= requiredSizeSaving)
  .pop();

console.log(
  " Total size of dirs under 100000: ",
  directorySizes
    .filter((x) => x.size < 100000)
    .reduce((agg, curr) => (agg += curr.size), 0)
);

console.log(
  `Directory suggested for deletion:  ${suggestedDirForDeletion.label} (${suggestedDirForDeletion.size})`
);
