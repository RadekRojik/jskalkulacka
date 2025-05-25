// ======== DATA =========

export const layouty = {
  default: {
    columns: 4,
    keys: [
      { name: "7", name1: "(", fn: "vlozText", cssClass: "numeric" },
      { name: "8", name1: ")", fn: "vlozText", cssClass: "numeric" },
      { name: "9", fn: "vlozText", cssClass: "numeric" },
      { name: "/", fn: "vlozText", cssClass: "function" },
      { name: "4", name1: "sin", str1: "sin(", fn: "vlozText", cssClass: "numeric" },
      { name: "5", name1: "cos", str1: "cos(", fn: "vlozText", cssClass: "numeric" },
      { name: "6", name1: "tan", str1: "tan(", fn: "vlozText", cssClass: "numeric" },
      { name: "✕", name1: "xʸ", str1: "^", fn: "vlozText", cssClass: "function" },
      { name: "1", name1: "√x", str1: "√(", fn: "vlozText", cssClass: "numeric" },
      { name: "2", fn: "vlozText", cssClass: "numeric" },
      { name: "3", fn: "vlozText", cssClass: "numeric" },
      { name: "-", fn: "vlozText", cssClass: "function" },
      { name: "0", fn: "vlozText", cssClass: "numeric" },
      { name: ".", fn: "vlozText", cssClass: "numeric" },
      { name: "+", fn: "vlozText", cssClass: "function" },
      { name: "S", fn: "goToNastaveni", cssClass: "other" },
      { name: "←", fn: "del", fn1: "smaz", cssClass: "other" },
      { name: "=", name1: "Ans", fn: "spocitej", fn1: "vratAns", cssClass: "function", colSpan:3},
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

