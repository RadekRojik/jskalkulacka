import { exportUserScope, importUserScope } from './importexport.js';
import { state, saveToLocal, walkTroughObject } from "./state.js";
import { cyklickeTema, mod_uhly } from "./theming.js";
import { reloadstatus } from "./statusbar.js";
// import { zmenScope } from './logika.js';

const math = window.math;

const userjson = document.getElementById('userJson');

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

function delItem(item){
  delete state.user[state.activeUserScope][item];
  document.getElementById('pamet').innerHTML = vypisObjektu(state.user, state.activeUserScope);
}

function vypisObjektu(obj, item){
  const klice = Object.keys(obj[item]);
  let html = `<h4>${item}</h4>`;
  klice.forEach((key) => {
    html += `<div>${key} : ${obj[item][key]}<button onclick="delItem('${key}')">Delete</button><div>`;
  });
  return html;
}


// Spouštěcí tabulka tlačítek
const tabulka = {
  btnTema: cyklickeTema,
  uhly: () => { mod_uhly();},
  ukapamet: vypisVzorce,
  zpet: goToIndex,
  importBtn: () => {
    const text = userjson.value;
    if (importUserScope(text)) {
      alert('Import proběhl.');
    }},
  exportBtn: () => {
  // const scopeName = document.getElementById('scopeName').value.trim();
  const json = exportUserScope(state.activeUserScope);
  userjson.value = json || '';
  userjson.dispatchEvent(new Event('input'));
  },
scope: () => {
  state['activeUserScope'] = walkTroughObject(state.user, state.activeUserScope, 1);
  document.getElementById('pamet').innerHTML = vypisObjektu(state.user, state.activeUserScope);},
}

function dispatch(event, table) {
  if (!event.target.closest("button")) return;
  if (Object.keys(table).includes(event.target.id)) {
    table[event.target.id](event);
  }
}

document.addEventListener('click', e => { dispatch(e, tabulka); });
userjson.addEventListener('input', function(){
  this.style.height = this.scrollHeight + 'px';
});

reloadstatus();
window.smazVzorec = smazVzorec;
window.delItem = delItem;
// vypisVzorce();
document.getElementById('pamet').innerHTML = vypisObjektu(state.user, state.activeUserScope);