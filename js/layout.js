// ======== DATA =========

export const layouty = {
  default: {
    columns: 4,
    keys: [
      { name: "7", name1: "(", fn: "vlozText", cssClass: "numeric" },
      { name: "8", name1: ")", fn: "vlozText", cssClass: "numeric" },
      { name: "9", fn: "vlozText", cssClass: "numeric" },
      { name: "/", fn: "vlozText", cssClass: "function" },
      { name: "4", fn: "vlozText", cssClass: "numeric" },
      { name: "5", fn: "vlozText", cssClass: "numeric" },
      { name: "6", fn: "vlozText", cssClass: "numeric" },
      { name: "✕", fkchar: "*", fn: "vlozText", cssClass: "function" },
      { name: "1", fn: "vlozText", cssClass: "numeric" },
      { name: "2", fn: "vlozText", cssClass: "numeric" },
      { name: "3", fn: "vlozText", cssClass: "numeric" },
      { name: "-", fn: "vlozText", cssClass: "function" },
      { name: "0", fn: "vlozText", cssClass: "numeric" },
      { name: ".", fn: "vlozText", cssClass: "other" },
      { name: "S", fn: "cyklickeTema", cssClass: "other" },
      { name: "+", fn: "vlozText", cssClass: "function" },
      { name: "↩", fn: "del", fn1: "smaz", cssClass: "other" },
      { name: "=", fn: "spocitej", cssClass: "function", colSpan:3},
    ],
  },

  scientific: {
    columns: 4,
    keys: [
      { name: "sin", fn: "vlozText", cssClass: "function" },
      { name: "cos", fn: "vlozText", cssClass: "function" },
      { name: "tan", fn: "vlozText", cssClass: "function" },
      { name: "(", fn: "vlozText", cssClass: "other" },
      { name: ")", fn: "vlozText", cssClass: "other" },
      { name: "√", fkchar: "sqrt", fn: "vlozText", cssClass: "function" },
      { name: "^", fn: "vlozText", cssClass: "function" },
      { name: "log", fn: "vlozText", cssClass: "function" },
      { name: "ln", fn: "vlozText", cssClass: "function" },
      { name: "C", fn: "smaz", cssClass: "other" },
    ],
  },
};

