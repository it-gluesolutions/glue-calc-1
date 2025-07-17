import { get_glue_mass } from "./calc.js";

document.getElementById("runCalc").addEventListener("click", () => {
  const p1 = Number(document.getElementById("input-p1").value);
  const p2 = Number(document.getElementById("input-p2").value);
  const p3 = Number(document.getElementById("input-p3").value);
  const p4 = Number(document.getElementById("input-p4").value);
  const h1 = Number(document.getElementById("input-h1").value);
  const h2 = Number(document.getElementById("input-h2").value);
  const h3 = Number(document.getElementById("input-h3").value);

  try {
    const result = get_glue_mass(p1, p2, p3, p4, h1, h2, h3);
    document.getElementById("resultOutput").textContent = result;
  } catch (err) {
    document.getElementById("resultOutput").textContent = "Error: " + err.message;
  }
});
