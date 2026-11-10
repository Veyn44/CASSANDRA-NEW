export const PROFESSION_IDS = Object.freeze([
  "mining",
  "engineering",
  "materialScience",
  "technician",
  "science",
  "fabrication",
  "soldier",
  "medicine",
  "operator",
]);

export const PROFESSION_DEFINITIONS = Object.freeze({
  mining: { id: "mining", name: "Mining" },
  engineering: { id: "engineering", name: "Engineering" },
  materialScience: { id: "materialScience", name: "Material Science" },
  technician: { id: "technician", name: "Technician" },
  science: { id: "science", name: "Science" },
  fabrication: { id: "fabrication", name: "Fabrication" },
  soldier: { id: "soldier", name: "Soldier" },
  medicine: { id: "medicine", name: "Medicine" },
  operator: { id: "operator", name: "Operator" },
});

export const PROFESSION_MAX_LEVEL = 30;
export const PROFESSION_XP_PER_LEVEL = 100;
export const PROFESSION_BASE_AP = 1;
export const PROFESSION_AP_PER_MASTERY_STAR = 1;
export const PROFESSION_EFFICIENCY_PER_LEVEL = 0.1;
