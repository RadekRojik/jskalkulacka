// ======== DATA =========

export const layouty = {
  default: {
    columns: 4,
    keys: [
      { name: "7", fn: "vlozText", cssClass: "numeric" },
      { name: "8", fn: "vlozText", cssClass: "numeric" },
      { name: "9", fn: "vlozText", cssClass: "numeric" },
      { name: "/", fn: "vlozText", cssClass: "function" },
      { name: "4", fn: "vlozText", cssClass: "numeric" },
      { name: "5", fn: "vlozText", cssClass: "numeric" },
      { name: "6", fn: "vlozText", cssClass: "numeric" },
      { name: "*", fn: "vlozText", cssClass: "function" },
      { name: "1", fn: "vlozText", cssClass: "numeric" },
      { name: "2", fn: "vlozText", cssClass: "numeric" },
      { name: "3", fn: "vlozText", cssClass: "numeric" },
      { name: "-", fn: "vlozText", cssClass: "function" },
      { name: "0", fn: "vlozText", cssClass: "numeric" },
      { name: ".", fn: "vlozText", cssClass: "other" },
      { name: "+", fn: "vlozText", cssClass: "function" },
      { name: "=", fn: "spocitej", cssClass: "function", rowSpan: 2 },
      { name: "C", fn: "smaz", cssClass: "other" },
    ],
  },

  scientific: {
    columns: 5,
    keys: [
      { name: "sin", fn: "vlozText", cssClass: "function" },
      { name: "cos", fn: "vlozText", cssClass: "function" },
      { name: "tan", fn: "vlozText", cssClass: "function" },
      { name: "(", fn: "vlozText", cssClass: "other" },
      { name: ")", fn: "vlozText", cssClass: "other" },
      { name: "sqrt", fn: "vlozText", cssClass: "function" },
      { name: "^", fn: "vlozText", cssClass: "function" },
      { name: "log", fn: "vlozText", cssClass: "function" },
      { name: "ln", fn: "vlozText", cssClass: "function" },
      { name: "C", fn: "smaz", cssClass: "other" },
    ],
  },
};

