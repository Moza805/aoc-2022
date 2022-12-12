import fs from "fs";

class Monkey {
  constructor(data) {
    this.inspectionCount = 0;
    this.items = data[1].match(/\d+/g).map((x) => +x);
    this.operation = data[2].split("= ")[1].split(" ");
    this.test = +data[3].match(/\d+/)[0];
    this.onTrue = +data[4].match(/\d+/)[0];
    this.onFalse = +data[5].match(/\d+/)[0];
  }

  calculateWorry(item) {
    const left = this.operation[0] === "old" ? item : +this.operation[0];
    const right = this.operation[2] === "old" ? item : +this.operation[2];

    switch (this.operation[1]) {
      case "+":
        return left + right;
      case "*":
        return left * right;
    }
  }

  play(monkeys, worryReductionFactor, modulus) {
    while (this.items.length > 0) {
      const item = this.items.shift();
      this.inspectionCount++;

      const result = Math.floor(
        (this.calculateWorry(item) % modulus) / worryReductionFactor
      );

      if (result % this.test === 0) {
        monkeys[this.onTrue].items.push(result);
      } else {
        monkeys[this.onFalse].items.push(result);
      }
    }
  }
}
const monkeyData = fs.readFileSync("./input.txt", "utf-8");

const monkeys = monkeyData
  .split(/\r?\n\r?\n/g)
  .filter((x) => x.startsWith("\n") === false);

const playRounds = (monkeys, rounds, worryReductionFactor) => {
  const modulus = monkeys
    .map((monkey) => monkey.test)
    .reduce((a, b) => a * b, 1);

  for (let i = 0; i < rounds; i++) {
    monkeys.forEach((monkey) =>
      monkey.play(monkeys, worryReductionFactor, modulus)
    );
  }

  const result = monkeys
    .map((monkey) => monkey.inspectionCount)
    .sort((a, b) => b - a);

  return result[0] * result[1];
};

console.log(
  "Part A",
  playRounds(
    monkeys.map((data) => new Monkey(data.split(/\r?\n/))),
    20,
    3
  )
);

console.log(
  "Part B",
  playRounds(
    monkeys.map((data) => new Monkey(data.split(/\r?\n/))),
    10000,
    1
  )
);
