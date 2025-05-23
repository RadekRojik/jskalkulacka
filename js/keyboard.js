import { layouty } from './layout.js';
import { state, walkTroughArray } from './state.js';

const layoutNazvy = Object.keys(layouty);
let aktivniIndex = 0;
// const kontejner = document.getElementById("klavesnice");
let kontejner;

export function initKeyboard(container) {
  kontejner = container;
  vykresliKlavesnici(layoutNazvy[aktivniIndex], kontejner);
}

export function zmenLayout(smer) {
  aktivniIndex = (aktivniIndex + smer + layoutNazvy.length) % layoutNazvy.length;
  vykresliKlavesnici(layoutNazvy[aktivniIndex], kontejner);
}


export function vykresliKlavesnici(layoutNazev, kontejner) {
  kontejner.innerHTML = "";
  const layout = layouty[layoutNazev];
  kontejner.style.gridTemplateColumns = `repeat(${layout.columns}, 1fr)`;

  layout.keys.forEach((def) => {
    const btn = document.createElement("button");
    btn.innerHTML = `<span class="key-main">${def.name}</span>`;
    btn.innerHTML += def.name1 ? `<span class="key-alt">${def.name1}</span>` : "";
    btn.classList.add("key-button", def.cssClass);
    btn.style.gridRow = `span ${def.rowSpan ?? 1}`;
    btn.style.gridColumn = `span ${def.colSpan ?? 1}`;
    if (def.colSpan > 1) btn.classList.add("wide");
    btn.def = def;
    kontejner.appendChild(btn);
  });
};

