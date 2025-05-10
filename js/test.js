const funkce = {
  fn1: () => undefined,
  fallback: () => {},
  "": () => {},
};

const ITERACE = 1_000_000;

let def;

// `||`
def = { fn1: "", fn: "fallback" };
console.time("||");
for (let i = 0; i < ITERACE; i++) {
  const f = funkce[def.fn1 || def.fn];
}
console.timeEnd("||");

// `? :`
def = { fn1: "", fn: "fallback" };
console.time("?:");
for (let i = 0; i < ITERACE; i++) {
  const f = funkce[def.fn1 ? def.fn1 : def.fn];
}
console.timeEnd("?:");

// `??`
def = { fn1: "", fn: "fallback" };
console.time("??");
for (let i = 0; i < ITERACE; i++) {
  const f = funkce[def.fn1 ?? def.fn];
}
console.timeEnd("??");

