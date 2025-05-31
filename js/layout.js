// ======== DATA =========

export const layouty = {
  default: {
    columns: 4,
    keys: [
      { name: "7", name1: "(", fn: "insertText", cssClass: "numeric" },
      { name: "8", name1: ")", fn: "insertText", cssClass: "numeric" },
      { name: "9", fn: "insertText", cssClass: "numeric" },
      { name: "/", fn: "insertText", cssClass: "function" },
      { name: "4", name1: "sin", str1: "sin(", fn: "insertText", cssClass: "numeric" },
      { name: "5", name1: "cos", str1: "cos(", fn: "insertText", cssClass: "numeric" },
      { name: "6", name1: "tan", str1: "tan(", fn: "insertText", cssClass: "numeric" },
      { name: "✕", name1: "xʸ", str1: "^", fn: "insertText", cssClass: "function" },
      { name: "1", name1: "√x", str1: "√(", fn: "insertText", cssClass: "numeric" },
      { name: "2", fn: "insertText", cssClass: "numeric" },
      { name: "3", fn: "insertText", cssClass: "numeric" },
      { name: "-", fn: "insertText", cssClass: "function" },
      { name: "0", fn: "insertText", cssClass: "numeric" },
      { name: ".", fn: "insertText", cssClass: "numeric" },
      { name: "+", fn: "insertText", cssClass: "function" },
      { name: "Sc", name1: "Set", fn: "zmenScope", fn1: "goToNastaveni", cssClass: "other" },
      { name: "←", fn: "del", fn1: "smaz", cssClass: "other" },
      { name: "=", name1: "Ans", fn: "makeResult", fn1: "vratAns", cssClass: "function", colSpan:3},
    ],
  },

  scientific: {
    columns: 4,
    keys: [
      { name: "sin", str: 'sin(', name1: "sin⁻¹", str1: 'asin(', fn: "insertText", cssClass: "function" },
      { name: "cos", str: 'cos(', name1: "cos⁻¹", str1: 'acos(', fn: "insertText", cssClass: "function" },
      { name: "tan", str: 'tan(', name1: "tan⁻¹", str1: 'atan(', fn: "insertText", cssClass: "function" },
      { name: "log", fn: "insertText", cssClass: "function" },
      { name: "ln", fn: "insertText", cssClass: "function" },
      { name: "←", fn: "del", fn1: "smaz", cssClass: "other" },
    ],
  },
};

