import { SmartDataParser } from './importexport.js';
import { layouty } from './layout.js';
import { state, walkTroughObject } from './state.js';

// const layoutNazvy = Object.keys(layouty);
// let aktivniIndex = 0;
// const kontejner = document.getElementById("klavesnice");
let kontejner;

export function initKeyboard(container) {
  kontejner = container;
  vykresliKlavesnici(state.keyboardlayout, kontejner);
}

export function zmenLayout(smer) {
  const dalsi = walkTroughObject(layouty, state.keyboardlayout, smer);
  // aktivniIndex = (aktivniIndex + smer + layoutNazvy.length) % layoutNazvy.length;
  state['keyboardlayout'] = dalsi;
  vykresliKlavesnici(dalsi, kontejner);
  // vykresliKlavesnici(layoutNazvy[aktivniIndex], kontejner);
}


// Vytvoří klávesnici z objektu
export function vykresliKlavesnici(layoutNazev, kontejner) {
  const frag = document.createDocumentFragment();
  const layout = layoutNazev === "default" ? layouty[layoutNazev] : generateCustomKeyboard();
  kontejner.style.gridTemplateColumns = `repeat(${layout.columns}, 1fr)`;

  layout.keys?.forEach((def) => {
    const btn = document.createElement("button");
    btn.innerHTML = `<span class="key-main">${def.name}</span>`;
    btn.innerHTML += def.name1 ? `<span class="key-alt">${def.name1}</span>` : "";
    btn.classList.add("key-button", def.cssClass);
    btn.style.gridRow = `span ${def.rowSpan ?? 1}`;
    btn.style.gridColumn = `span ${def.colSpan ?? 1}`;
    if (def.colSpan > 1) btn.classList.add("wide");
    btn.def = def;
    frag.append(btn);
  });
  kontejner.replaceChildren(frag);
};


// Vytvoří objekt user klávesnice
function generateCustomKeyboard(){
  const scope = state.activeUserScope;
  const BASE = {fn: "insertValue", cssClass: "numeric", colSpan: 2};
  const keyb = {
    columns: 4,
    keys: [
      { name: "M1", name1: state.memory.M1, str: state.memory.M1, fn: "insertValue", fn1: "saveMemory", cssClass: "numeric", colSpan: 2 },
      { name: "M2", name1: state.memory.M2, str: state.memory.M2, fn: "insertValue", fn1: "saveMemory", cssClass: "numeric", colSpan: 2 },
    ]
  };
  const vstupy = Object.entries(state.user[scope]).map(([k, v])=>{
      if (typeof v === 'string') {
      if (v.includes('=') && (v.includes('(') || /[a-zA-Z_]\w*\s*=/.test(v))) {
        return {...BASE, ...{name: k.trim(), fn: "insertAndMakeResult", cssClass: "function"}};
      }
    }
    return {...BASE, ...{name: k.trim(), name1: v.trim(), str: v.trim(), fn1: "saveToObjekt"}};
  });
  keyb.keys.push(...vstupy);
  return keyb;
};