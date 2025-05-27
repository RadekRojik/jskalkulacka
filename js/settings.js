import { state, saveToLocal } from "./state.js";
import { cyklickeTema, mod_uhly } from "./theming.js";
import { reloadstatus } from "./statusbar.js";

const math = window.math;

// Skok na index.html
function goToIndex() {
  window.location.href = "index.html";
}

// Smazání vzorce z `state.vzorce`
function smazVzorec(index) {
  const expr = state.vzorce[index];
  if (!expr) return;

  // Odeber ze vzorců
  state.vzorce.splice(index, 1);
  saveToLocal('vzorce');

  // Odeber z runtime pameti (pamet)
  try {
    const node = math.parse(expr);
    if (node.type === 'AssignmentNode' || node.type === 'FunctionAssignmentNode') {
      const name = node.name;
      delete state.pamet[name];  // Už není pamet.default, ale přímo pamet
    }
  } catch (e) {
    console.warn('Chyba při odstraňování vzorce z pameti:', e.message);
  }

  vypisVzorce();
}

// Výpis všech vzorců
function vypisVzorce() {
  let html = "<h3>Formulas and variables</h3>";

  state.vzorce.forEach((expr, index) => {
    html += `<div>${expr} <button onclick="smazVzorec(${index})">Delete</button></div>`;
  });

  document.getElementById('pamet').innerHTML = html;
}

// Tlačítka
const tabulka = {
  btnTema: cyklickeTema,
  uhly: () => { mod_uhly(); reloadstatus(); },
  ukapamet: vypisVzorce,
  zpet: goToIndex,
}

function dispatch(event, table) {
  if (Object.keys(table).includes(event.target.id)) {
    table[event.target.id](event);
  }
}

document.addEventListener('click', e => { dispatch(e, tabulka); });

reloadstatus();
window.smazVzorec = smazVzorec;
vypisVzorce();