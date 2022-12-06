import fs from "fs";

fs.open("./input.txt", "r", (err, fd) => {
  if (err) throw err;

  const findFirstUnique = (length) => {
    const buffer = Buffer.alloc(length);
    let position = 0;
    while (true) {
      var num = fs.readSync(fd, buffer, 0, length, position);
      if (num !== length) {
        break;
      }

      const set = new Set(buffer);
      if (set.size === length) {
        return { data: set, position: position + length };
      }
      position++;
    }
  };

  const startOfPacket = findFirstUnique(4);
  console.log(
    "Start of packet:",
    [...startOfPacket.data].reduce(
      (agg, curr) => agg + String.fromCharCode(curr),
      ""
    )
  );
  console.log("       Position: ", startOfPacket.position);

  const startOfMessage = findFirstUnique(14);
  console.log(
    "Start of message:",
    [...startOfMessage.data].reduce(
      (agg, curr) => agg + String.fromCharCode(curr),
      ""
    )
  );
  console.log("       Position: ", startOfMessage.position);
});
