export function get_glue_mass(p1, p2, p3, p4, h1, h2, h3) {
  // TODO: Implement your actual calculation logic here.
  // For now, return a dummy sum as placeholder:\
  /*
    p1: Ταχύτητα μηχανής
    p2: μήκος πάνελ
    p3: ύψος πάνελ
    p4: Μήκος διάκενου
    h1: Ρυθμόσς τήξης
    h2: Απαιτούμενα γραμ. κόλλας ανά τ.μ.
    h3: δεν χρησιμοπ.
  */
  const v = p1 * 60; // m/hr
  const cnt = v / (p4 + p2) * 1000;
  const area1 = (p2 * p3) / 1000000;
  const glue_area1 = area1 * h2;
  
  return {mass:Math.round(glue_area1 * cnt), area: (area1 * cnt).toFixed(2), running: (cnt * p2 / 1000).toFixed(2)};
}
