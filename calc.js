// calc.js
// Define and export a registry of calculation operations.
// You can import other modules, do async work, etc.

export const operations = [
  {
    id: "add",
    label: "Add Two Numbers",
    inputs: [
      { name: "a", type: "number", placeholder: "First number" },
      { name: "b", type: "number", placeholder: "Second number" }
    ],
    run: ({ a, b }) => Number(a) + Number(b)
  },
  {
    id: "hypot",
    label: "Hypotenuse (a² + b²)½",
    inputs: [
      { name: "a", type: "number", placeholder: "Side a" },
      { name: "b", type: "number", placeholder: "Side b" }
    ],
    run: ({ a, b }) => Math.hypot(Number(a), Number(b))
  },
  {
    id: "factorial",
    label: "Factorial (n!)",
    inputs: [
      { name: "n", type: "number", placeholder: "Integer ≥ 0" }
    ],
    run: ({ n }) => {
      const x = Number(n);
      if (!Number.isInteger(x) || x < 0) throw new Error("n must be a non‑negative integer");
      let res = 1;
      for (let i = 2; i <= x; i++) res *= i;
      return res;
    }
  }
];